import {
  Horizon, TransactionBuilder, Networks,
  BASE_FEE, Operation, Asset, Memo
} from "@stellar/stellar-sdk"
import { signWithKit } from "./wallet"
import { TransactionResult } from "../types"
import { 
  UserRejectedError, 
  InsufficientBalanceError, 
  NetworkError,
  parseHorizonError 
} from "./errors"
import { stellarCache } from "./cache"

const server = new Horizon.Server("https://horizon-testnet.stellar.org")

export async function sendXLM(params: {
  sourcePublicKey: string
  destination: string
  amount: string
  memo?: string
}): Promise<TransactionResult> {
  try {
    const account = await server.loadAccount(params.sourcePublicKey)
    
    // Check balance before building
    const nativeBalance = account.balances.find(b => b.asset_type === "native")
    const available = parseFloat(nativeBalance?.balance || "0")
    const required = parseFloat(params.amount) + 1 // 1 XLM reserve
    
    if (available < required) {
      throw new InsufficientBalanceError(available.toFixed(4), required.toFixed(4))
    }

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET
    })
    .addOperation(Operation.payment({
      destination: params.destination,
      asset: Asset.native(),
      amount: params.amount
    }))
    .addMemo(params.memo ? Memo.text(params.memo) : Memo.none())
    .setTimeout(180)
    .build()

    let signedXDR: string
    try {
      signedXDR = await signWithKit(tx.toXDR(), params.sourcePublicKey)
    } catch (e: any) {
      if (e.message?.toLowerCase().includes("rejected") || e.message?.toLowerCase().includes("cancel")) {
        throw new UserRejectedError()
      }
      throw e
    }

    const signedTx = TransactionBuilder.fromXDR(signedXDR, Networks.TESTNET)
    const result = await server.submitTransaction(signedTx)
    
    stellarCache.invalidate(`balance:${params.sourcePublicKey}`)
    stellarCache.invalidate(`txs:${params.sourcePublicKey}`)
    
    return { success: true, hash: result.hash, error: null }
  } catch (error: any) {
    console.error("Transaction failed:", error)
    
    if (error instanceof UserRejectedError || 
        error instanceof InsufficientBalanceError || 
        error instanceof NetworkError) {
      return { success: false, hash: null, error: error.message }
    }

    if (error.response) {
      return { success: false, hash: null, error: parseHorizonError(error) }
    }

    return { success: false, hash: null, error: error.message || "Unknown error" }
  }
}
