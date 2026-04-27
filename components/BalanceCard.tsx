"use client"

import { useWallet } from "../context/WalletContext"
import { RefreshCw } from "lucide-react"

import { SkeletonText } from "./ui/Skeleton"

export default function BalanceCard() {
  const { balance, optimisticBalance, isLoading, refreshBalance, network } = useWallet()
  const displayBalance = optimisticBalance !== null ? optimisticBalance : balance
  const usdValue = (parseFloat(displayBalance) * 0.10).toFixed(2)

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 md:p-6 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-slate-400 font-medium">XLM Balance</h2>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-500 text-xs font-bold tracking-wider">
            {network}
          </span>
          <button 
            onClick={refreshBalance}
            disabled={isLoading}
            className="text-slate-400 hover:text-white transition disabled:opacity-50"
            title="Refresh balance"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
      
      {isLoading && balance === "0.0000" ? (
        <div className="space-y-2">
          <SkeletonText className="w-1/2 h-10" />
          <SkeletonText className="w-1/3 h-5" />
        </div>
      ) : (
        <div>
          <div className="text-3xl md:text-4xl font-bold text-white mb-1">
            {Number(displayBalance).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} XLM
          </div>
          <div className="text-slate-400 font-medium">
            ≈ ${usdValue} USD
          </div>
        </div>
      )}
    </div>
  )
}
