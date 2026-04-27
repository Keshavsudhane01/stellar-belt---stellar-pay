"use client"

import React, { useEffect, useState } from "react"
import { rpc as SorobanRpc } from "@stellar/stellar-sdk"
import { CheckCircle2, XCircle, Loader2, ExternalLink, Clock, AlertCircle } from "lucide-react"

interface TransactionStatusProps {
  txHash: string
  onComplete?: (success: boolean) => void
}

type Status = "PENDING" | "SUCCESS" | "FAILED" | "NOT_FOUND"

export default function TransactionStatus({ txHash, onComplete }: TransactionStatusProps) {
  const [status, setStatus] = useState<Status>("PENDING")
  const [error, setError] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    const RPC_URL = "https://soroban-testnet.stellar.org"
    const server = new SorobanRpc.Server(RPC_URL)
    
    let attempts = 0
    const poll = async () => {
      try {
        const result = await server.getTransaction(txHash)
        attempts++

        if (result.status === "SUCCESS") {
          setStatus("SUCCESS")
          clearInterval(timer)
          onComplete?.(true)
          return true
        } else if (result.status === "FAILED") {
          setStatus("FAILED")
          setError("Transaction execution failed.")
          clearInterval(timer)
          onComplete?.(false)
          return true
        }
      } catch (e) {
        console.error("Polling error:", e)
      }

      if (attempts > 20) {
        setStatus("NOT_FOUND")
        clearInterval(timer)
        onComplete?.(false)
        return true
      }
      return false
    }

    const interval = setInterval(async () => {
      const finished = await poll()
      if (finished) clearInterval(interval)
    }, 3000)

    poll() // Initial check

    return () => {
      clearInterval(timer)
      clearInterval(interval)
    }
  }, [txHash, onComplete])

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {status === "PENDING" && (
            <div className="w-10 h-10 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          )}
          {status === "SUCCESS" && (
            <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
          {status === "FAILED" && (
            <div className="w-10 h-10 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
          )}
          {status === "NOT_FOUND" && (
            <div className="w-10 h-10 bg-slate-700/50 text-slate-400 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
          
          <div>
            <h3 className="font-bold text-white">
              {status === "PENDING" && "Transaction Pending..."}
              {status === "SUCCESS" && "Transaction Confirmed!"}
              {status === "FAILED" && "Transaction Failed"}
              {status === "NOT_FOUND" && "Status Unknown"}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {status === "SUCCESS" ? `Confirmed in ${elapsed}s` : `Elapsed: ${elapsed}s`}
            </p>
          </div>
        </div>
        
        <a 
          href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-blue-400 transition"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {status === "PENDING" && (
        <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-500 animate-[shimmer_2s_infinite] w-full origin-left" 
               style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)', backgroundSize: '200% 100%' }} />
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}
