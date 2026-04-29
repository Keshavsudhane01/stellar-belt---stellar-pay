"use client"

import { useEffect, useState } from "react"
import { useWallet } from "../context/WalletContext"
import { getRecentTransactions } from "../lib/stellar"
import { Transaction } from "../types"
import { ArrowUpRight, ArrowDownLeft, RefreshCw, ExternalLink, XCircle, Clock } from "lucide-react"
import { SkeletonRow } from "./ui/Skeleton"

export default function TransactionList() {
  const { publicKey, network, optimisticTxs } = useWallet()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTransactions = async () => {
    if (!publicKey) return
    setIsLoading(true)
    const txs = await getRecentTransactions(publicKey)
    setTransactions(txs)
    setIsLoading(false)
  }

  useEffect(() => {
    if (!publicKey) return

    const loadTransactions = async () => {
      setIsLoading(true)
      const txs = await getRecentTransactions(publicKey)
      setTransactions(txs)
      setIsLoading(false)
    }

    loadTransactions()
  }, [publicKey])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date)
  }

  const truncate = (str: string) => `${str.slice(0, 5)}...${str.slice(-5)}`

  const allTxs = [...(optimisticTxs || []), ...transactions]

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 md:p-6 shadow-lg h-full max-h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
        <button 
          onClick={fetchTransactions}
          disabled={isLoading}
          className="text-slate-400 hover:text-white transition disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto flex-1 pr-1">
        {isLoading && transactions.length === 0 ? (
          // Skeleton loader
          Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))
        ) : allTxs.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No transactions yet
          </div>
        ) : (
          allTxs.map((tx: any) => (
            <a 
              key={tx.id}
              href={`https://stellar.expert/explorer/${network.toLowerCase()}/tx/${tx.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-700/50 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800 transition group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.successful ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {tx.successful ? <ArrowUpRight className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-slate-200">
                      {truncate(tx.id)}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatDate(tx.createdAt)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs px-2 py-0.5 rounded flex items-center justify-center ${tx.successful ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {tx.successful ? "Success" : "Failed"}
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  )
}
