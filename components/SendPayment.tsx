"use client"

import { useState } from "react"
import { useWallet } from "../context/WalletContext"
import { isValidStellarAddress } from "../lib/stellar"
import { sendXLM } from "../lib/transactions"
import { Send, CheckCircle, XCircle, ArrowRight, ExternalLink, Info } from "lucide-react"

type TxState = "IDLE" | "SIGNING" | "SENDING" | "SUCCESS" | "FAILED" | "REJECTED"

export default function SendPayment() {
  const {
    publicKey,
    balance,
    refreshBalance,
    setOptimisticBalance,
    addOptimisticTx,
    removeOptimisticTx
  } = useWallet()
  const [destination, setDestination] = useState("")
  const [amount, setAmount] = useState("")
  const [memo, setMemo] = useState("")
  const [txState, setTxState] = useState<TxState>("IDLE")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState("")

  const getValidationErrors = () => {
    const errors: { destination?: string; amount?: string; memo?: string } = {}
    
    if (destination && !isValidStellarAddress(destination)) {
      errors.destination = "Invalid Stellar address"
    }
    if (destination === publicKey) {
      errors.destination = "Cannot send to yourself"
    }

    const numAmount = parseFloat(amount)
    if (amount) {
      if (isNaN(numAmount) || numAmount < 0.0000001) {
        errors.amount = "Must be greater than 0"
      } else {
        const availableBalance = parseFloat(balance) - 1 // 1 XLM reserve
        if (numAmount > availableBalance) {
          errors.amount = `Exceeds available balance (1 XLM reserve)`
        }
      }
    }

    if (memo && memo.length > 28) {
      errors.memo = "Memo cannot exceed 28 characters"
    }

    return errors
  }

  const errors = getValidationErrors()
  const isValid = destination && amount && Object.keys(errors).length === 0

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || !publicKey) return

    setTxState("SIGNING")
    setErrorMsg("")
    
    // Optimistic UI updates
    const currentBalance = parseFloat(balance)
    const sendAmount = parseFloat(amount)
    const newBalance = (currentBalance - sendAmount - 0.0001).toFixed(4) // rough fee estimate
    
    const optId = Math.random().toString(36).substring(7)
    const optimisticTx = {
      id: optId,
      type: "tx",
      amount: amount,
      destination: destination,
      createdAt: new Date().toISOString(),
      successful: true,
      pending: true
    }

    setOptimisticBalance?.(newBalance)
    addOptimisticTx?.(optimisticTx)

    const result = await sendXLM({
      sourcePublicKey: publicKey,
      destination,
      amount,
      memo
    })

    if (result.success) {
      setTxState("SUCCESS")
      setTxHash(result.hash)
      // Confirmed, clear optimistic state to let refreshBalance take over
      setOptimisticBalance?.(null)
      removeOptimisticTx?.(optId)
      refreshBalance()
    } else {
      // Revert optimistic updates
      setOptimisticBalance?.(null)
      removeOptimisticTx?.(optId)
      
      if (result.error?.includes("rejected") || result.error?.includes("cancelled")) {
        setTxState("REJECTED")
      } else {
        setTxState("FAILED")
        setErrorMsg(result.error || "Transaction failed")
      }
    }
  }

  const resetForm = () => {
    setDestination("")
    setAmount("")
    setMemo("")
    setTxState("IDLE")
    setTxHash(null)
    setErrorMsg("")
  }

  if (txState === "SUCCESS") {
    return (
      <div className="bg-slate-800 border border-green-500/30 rounded-2xl p-6 shadow-lg text-center h-full flex flex-col justify-center items-center">
        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sent Successfully!</h2>
        <p className="text-slate-400 mb-6">Your XLM has been transferred.</p>
        
        {txHash && (
          <div className="mb-8 w-full">
            <p className="text-sm text-slate-500 mb-1 font-mono">HASH: {txHash.slice(0, 8)}...{txHash.slice(-8)}</p>
            <a 
              href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition text-sm underline decoration-blue-400/30"
            >
              View on Stellar Expert <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
        
        <button 
          onClick={resetForm}
          className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition"
        >
          Send Another
        </button>
      </div>
    )
  }

  const isProcessing = txState === "SIGNING" || txState === "SENDING"

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
          <Send className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-white">Send XLM</h2>
      </div>

      <form onSubmit={handleSend} className="space-y-5 flex-1">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">
            Destination Address
          </label>
          <input 
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled={isProcessing}
            placeholder="Destination Address"
            className={`w-full px-4 py-3 bg-slate-900 border ${errors.destination ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-blue-500/50 focus:ring-blue-500/10'} rounded-2xl text-white outline-none focus:ring-4 transition-all duration-200 font-mono text-xs`}
          />
          {errors.destination && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> {errors.destination}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">
            Amount (XLM)
          </label>
          <div className="relative">
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isProcessing}
              min="0.0000001"
              step="any"
              placeholder="Amount"
              className={`w-full px-4 py-3 bg-slate-900 border ${errors.amount || errorMsg.includes("balance") ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-blue-500/50 focus:ring-blue-500/10'} rounded-2xl text-white outline-none focus:ring-4 transition-all duration-200`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
              XLM
            </div>
          </div>
          {errors.amount && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> {errors.amount}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">
            Memo (Optional)
          </label>
          <input 
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            disabled={isProcessing}
            maxLength={28}
            placeholder="e.g. For dinner"
            className={`w-full px-4 py-3 bg-slate-900 border ${errors.memo ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-blue-500/50 focus:ring-blue-500/10'} rounded-2xl text-white outline-none focus:ring-4 transition-all duration-200`}
          />
          <div className="flex justify-between mt-1.5">
            {errors.memo ? (
              <p className="text-xs text-red-400 flex items-center gap-1"><XCircle className="w-3 h-3" /> {errors.memo}</p>
            ) : <div />}
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{memo.length}/28</p>
          </div>
        </div>

        {txState === "REJECTED" && (
          <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-xs text-orange-400 flex items-center gap-3">
            <Info className="w-4 h-4 shrink-0" />
            Transaction cancelled in wallet.
          </div>
        )}

        {txState === "FAILED" && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400 flex items-center gap-3 break-words">
            <XCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || isProcessing}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 mt-auto shadow-lg shadow-blue-600/20"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {txState === "SIGNING" ? "Waiting for Wallet..." : "Submitting..."}
            </>
          ) : (
            <>
              Send XLM <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
