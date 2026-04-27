"use client"

import { useState } from "react"
import { useWallet } from "../context/WalletContext"
import { Users, Plus, Trash2, ArrowRight, Loader2, ExternalLink, CheckCircle } from "lucide-react"
import { signWithKit } from "../lib/wallet"
import { TransactionBuilder, Networks, BASE_FEE, Contract, Address, rpc as SorobanRpc, nativeToScVal, xdr, scValToNative } from "@stellar/stellar-sdk"

interface SplitRecipient {
  address: string
}

export default function PaymentSplitter() {
  const { publicKey } = useWallet()
  const [amount, setAmount] = useState("")
  const [asset, setAsset] = useState<"XLM" | "SDT">("XLM")
  const [recipients, setRecipients] = useState<SplitRecipient[]>([{ address: "" }])
  const [status, setStatus] = useState<"IDLE" | "SIMULATING" | "SIGNING" | "SUBMITTING" | "CONFIRMING" | "SUCCESS" | "FAILED">("IDLE")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  
  const server = new SorobanRpc.Server(process.env.NEXT_PUBLIC_SOROBAN_RPC || "https://soroban-testnet.stellar.org")

  const addRecipient = () => {
    if (recipients.length >= 10) return
    setRecipients([...recipients, { address: "" }])
  }

  const removeRecipient = (index: number) => {
    if (recipients.length <= 1) return
    const newRecipients = [...recipients]
    newRecipients.splice(index, 1)
    setRecipients(newRecipients)
  }

  const updateRecipient = (index: number, address: string) => {
    const newRecipients = [...recipients]
    newRecipients[index].address = address
    setRecipients(newRecipients)
  }

  const numericAmount = parseFloat(amount) || 0
  const share = recipients.length > 0 ? (numericAmount / recipients.length).toFixed(4) : "0.0000"
  const reward = recipients.length * 100

  const handleSplit = async () => {
    if (!publicKey) return
    if (!amount || numericAmount <= 0) return
    if (recipients.some(r => !r.address)) return

    try {
      setStatus("SIMULATING")
      setErrorMsg("")
      setTxHash(null)

      const account = await server.getAccount(publicKey)
      
      const contractId = process.env.NEXT_PUBLIC_PAYMENT_SPLITTER_ADDRESS!
      const contract = new Contract(contractId)
      
      const tokenId = asset === "XLM" 
        ? "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC" // native contract ID on testnet
        : process.env.NEXT_PUBLIC_SDT_TOKEN_ADDRESS!
      
      const scRecipients = recipients.map(r => Address.fromString(r.address).toScVal())
      const recipientsVec = xdr.ScVal.scvVec(scRecipients)
      
      // Amount in stroops (7 decimals)
      const stroopsAmount = nativeToScVal(Math.floor(numericAmount * 1e7), { type: "i128" })

      let tx = new TransactionBuilder(account, {
        fee: BASE_FEE.toString(),
        networkPassphrase: Networks.TESTNET
      })
      .addOperation(contract.call(
        "split_payment",
        Address.fromString(publicKey).toScVal(),
        Address.fromString(tokenId).toScVal(),
        recipientsVec,
        stroopsAmount
      ))
      .setTimeout(300)
      .build()

      const simulation = await server.simulateTransaction(tx)
      
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        throw new Error(simulation.error)
      }

      if (!SorobanRpc.Api.isSimulationSuccess(simulation)) {
        throw new Error("Simulation failed")
      }

      tx = SorobanRpc.assembleTransaction(tx, simulation).build()
      
      setStatus("SIGNING")
      const signedXdr = await signWithKit(tx.toXDR(), publicKey)
      
      setStatus("SUBMITTING")
      const submitted = await server.sendTransaction(TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET))
      
      if (submitted.status === "ERROR") {
        throw new Error("Transaction submission failed")
      }

      setStatus("CONFIRMING")
      
      let fetchStatus = submitted.status as string
      let result: any = submitted
      const start = Date.now()
      
      while (fetchStatus === "PENDING" && Date.now() - start < 30000) {
        await new Promise(r => setTimeout(r, 3000))
        result = await server.getTransaction(submitted.hash)
        fetchStatus = result.status
      }

      if (fetchStatus !== SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
        throw new Error("Transaction failed or timed out on-chain")
      }

      setTxHash(submitted.hash)
      setStatus("SUCCESS")
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || "An error occurred")
      setStatus("FAILED")
    }
  }

  if (status === "SUCCESS") {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl text-center">
        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Split Successful!</h3>
        <p className="text-slate-400 mb-6">Your payment was split and sent on-chain.</p>
        
        <div className="bg-slate-900/50 rounded-xl p-4 text-left space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-400">Total Split:</span>
            <span className="font-medium text-white">{amount} {asset}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Recipients:</span>
            <span className="font-medium text-white">{recipients.length} addresses</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Each received:</span>
            <span className="font-medium text-white">{share} {asset}</span>
          </div>
          <div className="flex justify-between text-amber-400">
            <span>Your SDT reward:</span>
            <span className="font-bold">+{reward} SDT</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {txHash && (
            <a 
              href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 bg-blue-500/10 py-3 rounded-xl transition"
            >
              View on Stellar Expert <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button 
            onClick={() => {
              setStatus("IDLE")
              setAmount("")
              setRecipients([{ address: "" }])
            }}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition font-medium"
          >
            Split Another Payment
          </button>
        </div>
      </div>
    )
  }

  const isWorking = ["SIMULATING", "SIGNING", "SUBMITTING", "CONFIRMING"].includes(status)

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Payment Splitter</h2>
          <p className="text-xs text-slate-400">Split tokens and earn SDT rewards</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Amount</label>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isWorking}
              placeholder="0.00"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div className="w-32 space-y-1">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Token</label>
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value as "XLM" | "SDT")}
              disabled={isWorking}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition appearance-none"
            >
              <option value="XLM">XLM</option>
              <option value="SDT">SDT</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Recipients ({recipients.length}/10)</label>
            <button 
              onClick={addRecipient}
              disabled={recipients.length >= 10 || isWorking}
              className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 disabled:opacity-50 transition"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>

          <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
            {recipients.map((r, i) => (
              <div key={i} className="flex items-center gap-2 animate-in slide-in-from-left-2">
                <input 
                  type="text"
                  value={r.address}
                  onChange={(e) => updateRecipient(i, e.target.value)}
                  disabled={isWorking}
                  placeholder="G..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                />
                <div className="w-24 text-right text-sm font-medium text-slate-300 bg-slate-900 py-2 px-3 rounded-xl border border-slate-800">
                  {share}
                </div>
                <button
                  onClick={() => removeRecipient(i)}
                  disabled={recipients.length <= 1 || isWorking}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-xl transition disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex justify-between items-center">
        <span className="text-sm text-amber-200/70">Reward for this split:</span>
        <span className="font-bold text-amber-400">+{reward} SDT</span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      <button
        onClick={handleSplit}
        disabled={isWorking || !publicKey || !amount || recipients.some(r => !r.address)}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 group"
      >
        {isWorking ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {status}...
          </>
        ) : (
          <>
            Split {amount || "0"} {asset} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </div>
  )
}
