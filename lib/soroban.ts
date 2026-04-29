import {
  Contract, rpc as SorobanRpc, TransactionBuilder,
  Networks, BASE_FEE, Address, nativeToScVal, xdr,
  scValToNative, Account
} from "@stellar/stellar-sdk"
import { signWithKit } from "./wallet"

const RPC_URL = "https://soroban-testnet.stellar.org"
const server = new SorobanRpc.Server(RPC_URL)
const CONTRACT_ID = process.env.NEXT_PUBLIC_COUNTER_CONTRACT_ID!

export async function getCount(): Promise<number> {
  try {
    const contract = new Contract(CONTRACT_ID)
    const transaction = new TransactionBuilder(
      new Account("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF", "-1"),
      { fee: BASE_FEE.toString(), networkPassphrase: Networks.TESTNET }
    )
      .addOperation(contract.call("get_count"))
      .setTimeout(30)
      .build()

    const simulation = await server.simulateTransaction(transaction)
    if (SorobanRpc.Api.isSimulationSuccess(simulation)) {
      const result = simulation.result?.retval
      if (result) {
        return scValToNative(result)
      }
    }
    return 0
  } catch (error) {
    console.error("Error fetching count:", error)
    return 0
  }
}

export async function callIncrement(publicKey: string): Promise<{ count: number; txHash: string }> {
  const account = await server.getAccount(publicKey)
  const contract = new Contract(CONTRACT_ID)
  
  let tx = new TransactionBuilder(account, {
    fee: BASE_FEE.toString(),
    networkPassphrase: Networks.TESTNET
  })
    .addOperation(contract.call("increment", Address.fromString(publicKey).toScVal()))
    .setTimeout(180)
    .build()

  const simulation = await server.simulateTransaction(tx)
  if (SorobanRpc.Api.isSimulationRestore(simulation)) {
    // In a real app we'd handle restore here
    throw new Error("Transaction requires restoration")
  }
  
  if (!SorobanRpc.Api.isSimulationSuccess(simulation)) {
    throw new Error("Simulation failed")
  }

  tx = SorobanRpc.assembleTransaction(tx, simulation).build()
  
  const signedTxXdr = await signWithKit(tx.toXDR(), publicKey)

  const submittedTx = await server.sendTransaction(TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET))
  
  if (submittedTx.status === "ERROR") {
    throw new Error("Transaction submission failed")
  }

  // Poll for status
  let status: string = submittedTx.status
  let result: any = submittedTx
  const start = Date.now()
  
  while (status === "PENDING" && Date.now() - start < 30000) {
    await new Promise(r => setTimeout(r, 3000))
    result = await server.getTransaction(submittedTx.hash)
    status = result.status
  }

  if (status !== "SUCCESS") {
    throw new Error(`Transaction failed with status: ${status}`)
  }

  const newCount = scValToNative(result.returnValue!)
  return { count: newCount, txHash: submittedTx.hash }
}

export function subscribeToEvents(onEvent: (count: number) => void): () => void {
  const interval = setInterval(async () => {
    try {
      const latestLedger = await server.getLatestLedger()
      const events = await server.getEvents({
        startLedger: latestLedger.sequence - 10,
        filters: [
          {
            type: "contract",
            contractIds: [CONTRACT_ID],
            topics: [[xdr.ScVal.scvSymbol("INCREMENT").toXDR("base64")]]
          }
        ]
      })

      if (events.events.length > 0) {
        const lastEvent = events.events[events.events.length - 1]
        // The event data is the new count in our contract
        const count = scValToNative(lastEvent.value)
        onEvent(count)
      }
    } catch (error) {
      console.error("Event subscription error:", error)
    }
  }, 5000)

  return () => clearInterval(interval)
}
