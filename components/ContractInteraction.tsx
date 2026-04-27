"use client"

import React, { useState, useEffect } from "react"
import { useWallet } from "../context/WalletContext"
import { getCount, callIncrement, subscribeToEvents } from "../lib/soroban"
import { Plus, RefreshCw, Copy, Check, ExternalLink, Box, Loader2 } from "lucide-react"
import TransactionStatus from "./TransactionStatus"
import { SkeletonText } from "./ui/Skeleton"

type State = "IDLE" | "SIMULATING" | "SIGNING" | "SUBMITTING" | "SUCCESS" | "FAILED"

export default function ContractInteraction() {
  const { publicKey, isConnected } = useWallet()
  const [count, setCount] = useState<number | null>(null)
  const [state, setState] = useState<State>("IDLE")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<number>(0)

  const contractId = process.env.NEXT_PUBLIC_COUNTER_CONTRACT_ID || "N/A"

  const fetchCount = async () => {
    const val = await getCount()
    setCount(val)
    setLastUpdated(0)
  }

  useEffect(() => {
    fetchCount()
    const timer = setInterval(() => setLastUpdated(prev => prev + 1), 1000)
    
    const unsubscribe = subscribeToEvents((newCount) => {
      setCount(newCount)
      setLastUpdated(0)
    })

    return () => {
      clearInterval(timer)
      unsubscribe()
    }
  }, [])

  const handleIncrement = async () => {
    if (!publicKey) return
    
    setState("SIMULATING")
    setError(null)
    setTxHash(null)

    const previousCount = count
    setCount((prev) => (prev !== null ? prev + 1 : 1))

    try {
      // Small delay for UI feel
      await new Promise(r => setTimeout(r, 500))
      setState("SIGNING")
      
      const result = await callIncrement(publicKey)
      
      setTxHash(result.txHash)
      setState("SUBMITTING")
    } catch (e: any) {
      console.error(e)
      setError(e.message || "Failed to increment counter")
      setState("FAILED")
      setCount(previousCount)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(contractId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const truncate = (str: string) => `${str.slice(0, 6)}...${str.slice(-6)}`

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Box className="w-24 h-24" />
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            On-Chain Counter
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] uppercase tracking-wider border border-blue-500/20">
              Soroban
            </span>
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-slate-400 font-mono">{truncate(contractId)}</p>
            <button onClick={handleCopy} className="text-slate-500 hover:text-white transition">
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
        <button 
          onClick={fetchCount}
          className="p-2 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col items-center py-8">
        {count !== null ? (
          <div className={`text-7xl font-black text-white mb-2 transition-all duration-500 ${state === "SUCCESS" ? "scale-110 text-green-400" : ""}`}>
            {count}
          </div>
        ) : (
          <SkeletonText className="w-24 h-24 mb-2" />
        )}
        <p className="text-xs text-slate-500">
          Last updated: {lastUpdated} seconds ago
        </p>
      </div>

      <div className="space-y-4">
        {txHash && (
          <TransactionStatus 
            txHash={txHash} 
            onComplete={(success) => setState(success ? "SUCCESS" : "FAILED")} 
          />
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-400 flex items-center gap-3">
            <XCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleIncrement}
          disabled={!isConnected || state === "SIMULATING" || state === "SIGNING" || state === "SUBMITTING"}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded-2xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
        >
          {state === "SIMULATING" && <Loader2 className="w-5 h-5 animate-spin" />}
          {state === "SIGNING" && <Loader2 className="w-5 h-5 animate-spin" />}
          {state === "SUBMITTING" && <Loader2 className="w-5 h-5 animate-spin" />}
          
          {state === "IDLE" && <><Plus className="w-5 h-5" /> Increment Counter</>}
          {state === "SIMULATING" && "Simulating..."}
          {state === "SIGNING" && "Waiting for Wallet..."}
          {state === "SUBMITTING" && "Submitting..."}
          {(state === "SUCCESS" || state === "FAILED") && "Increment Counter"}
        </button>

        <a 
          href={`https://stellar.expert/explorer/testnet/contract/${contractId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 text-xs text-slate-400 hover:text-white transition"
        >
          View Contract on Explorer <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}

function XCircle(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
}
