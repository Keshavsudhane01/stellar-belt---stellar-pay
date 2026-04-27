"use client"

import { useEffect, useState } from "react"
import { eventStream, StellarEvent } from "../lib/eventStream"
import { Activity, Clock, ExternalLink } from "lucide-react"

export default function ActivityFeed() {
  const [events, setEvents] = useState<StellarEvent[]>([])

  useEffect(() => {
    const contractIds = [
      process.env.NEXT_PUBLIC_COUNTER_CONTRACT_ID!,
      process.env.NEXT_PUBLIC_PAYMENT_SPLITTER_ADDRESS!,
      process.env.NEXT_PUBLIC_REWARD_CONTRACT_ADDRESS!,
      process.env.NEXT_PUBLIC_SDT_TOKEN_ADDRESS!
    ].filter(Boolean)

    const unsubscribe = eventStream.subscribe(contractIds, (newEvent) => {
      setEvents(prev => {
        if (prev.some(e => e.id === newEvent.id)) return prev
        const updated = [newEvent, ...prev].slice(0, 20)
        return updated
      })
    })

    return () => unsubscribe()
  }, [])

  const getColor = (type: string) => {
    switch (type) {
      case "INCREMENT": return "text-blue-400 bg-blue-400/10"
      case "SPLIT": return "text-purple-400 bg-purple-400/10"
      case "TRANSFER": return "text-green-400 bg-green-400/10"
      case "MINT": return "text-amber-400 bg-amber-400/10"
      default: return "text-slate-400 bg-slate-400/10"
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden flex flex-col h-[400px]">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/80 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-slate-400" />
          <h2 className="text-white font-medium">Live Activity Feed</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-xs text-slate-400">Listening...</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {events.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Listening for on-chain events...
          </div>
        ) : (
          events.map((event, i) => (
            <div 
              key={event.id}
              className="animate-in slide-in-from-top-2 fade-in duration-300 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col gap-2 md:flex-row md:items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-1 rounded w-fit ${getColor(event.type)}`}>
                  {event.type || "EVENT"}
                </span>
                <span className="text-sm text-slate-300 truncate max-w-[150px] md:max-w-none">
                  {event.contractId.slice(0, 6)}...{event.contractId.slice(-4)}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-slate-400 justify-between md:justify-end">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{event.timestamp.toLocaleTimeString()}</span>
                </div>
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden md:flex items-center gap-1 hover:text-blue-400 transition"
                >
                  {event.txHash.slice(0, 8)}...
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
