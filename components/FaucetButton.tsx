"use client"

import { useState } from "react"
import { useWallet } from "../context/WalletContext"
import { fundTestnetAccount } from "../lib/stellar"
import { Droplet, CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function FaucetButton() {
  const { publicKey, refreshBalance } = useWallet()
  const [isFunding, setIsFunding] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleFund = async () => {
    if (!publicKey) return
    setIsFunding(true)
    setStatus("idle")
    
    const success = await fundTestnetAccount(publicKey)
    if (success) {
      setStatus("success")
      setTimeout(() => {
        refreshBalance()
        setStatus("idle")
      }, 3000)
    } else {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
    }
    
    setIsFunding(false)
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Droplet className="w-24 h-24" />
      </div>

      <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4">
        <Droplet className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Need Testnet XLM?</h3>
      <p className="text-sm text-slate-400 mb-6 max-w-[240px]">
        Receive 10,000 XLM instantly for testing and development.
      </p>
      
      {status === "success" && (
        <div className="mb-4 w-full flex items-center gap-2 text-green-400 text-xs bg-green-400/10 border border-green-400/20 px-4 py-3 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Account funded! +10,000 XLM added
        </div>
      )}
      
      {status === "error" && (
        <div className="mb-4 w-full flex items-center gap-2 text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <XCircle className="w-4 h-4 shrink-0" />
          Funding failed. Try again in a moment.
        </div>
      )}

      <button
        onClick={handleFund}
        disabled={isFunding || status === "success"}
        className="w-full py-4 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isFunding ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Funding account...
          </>
        ) : (
          "Fund with Testnet XLM"
        )}
      </button>
      <p className="mt-3 text-[10px] text-slate-500 uppercase tracking-widest font-medium">
        Free testnet XLM for testing purposes only
      </p>
    </div>
  )
}
