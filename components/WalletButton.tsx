"use client"

import { useState } from "react"
import { useWallet } from "../context/WalletContext"
import { Wallet, LogOut, Copy, Check, ChevronDown } from "lucide-react"

export default function WalletButton() {
  const { publicKey, isConnected, isLoading, connect, disconnect } = useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const truncateAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (!isConnected || !publicKey) {
    return (
      <button 
        onClick={connect}
        disabled={isLoading}
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all duration-300 font-bold text-sm flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-600/20"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        Connect Wallet
      </button>
    )
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl border border-slate-700 transition-all duration-300 font-medium text-sm flex items-center gap-3"
      >
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        {truncateAddress(publicKey)}
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-72 bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-700 bg-slate-800/50">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-bold">Connected Address</p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-700/50">
                <p className="text-xs font-mono text-slate-200 break-all leading-relaxed">{publicKey}</p>
              </div>
            </div>
            <div className="p-2">
              <button 
                onClick={handleCopy}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-all duration-200"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                {copied ? "Address Copied!" : "Copy Address"}
              </button>
              <button 
                onClick={() => {
                  disconnect()
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 mt-1"
              >
                <LogOut className="w-4 h-4" />
                Disconnect Wallet
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
