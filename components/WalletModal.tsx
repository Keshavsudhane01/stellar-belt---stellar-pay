"use client"

import React, { useState } from "react"
import { FREIGHTER_ID } from "@creit.tech/stellar-wallets-kit/modules/freighter"
import { XBULL_ID } from "@creit.tech/stellar-wallets-kit/modules/xbull"
import { ALBEDO_ID } from "@creit.tech/stellar-wallets-kit/modules/albedo"
import { X, Wallet, Monitor, Globe } from "lucide-react"

interface WalletOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  type: string
}

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (walletId: string) => Promise<void>
}

const WALLETS: WalletOption[] = [
  {
    id: FREIGHTER_ID,
    name: "Freighter",
    description: "Browser Extension",
    icon: <div className="w-10 h-10 bg-orange-500/20 text-orange-500 rounded-lg flex items-center justify-center text-xl">⚓</div>,
    type: "Extension"
  },
  {
    id: XBULL_ID,
    name: "xBull",
    description: "Browser Extension",
    icon: <div className="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-lg flex items-center justify-center text-xl">🐂</div>,
    type: "Extension"
  },
  {
    id: ALBEDO_ID,
    name: "Albedo",
    description: "Web Wallet",
    icon: <div className="w-10 h-10 bg-purple-500/20 text-purple-500 rounded-lg flex items-center justify-center text-xl">🌌</div>,
    type: "Web"
  }
]

export default function WalletModal({ isOpen, onClose, onSelect }: WalletModalProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSelect = async (id: string) => {
    setLoadingId(id)
    try {
      await onSelect(id)
      onClose()
    } catch (error) {
      console.error("Wallet selection error:", error)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
            <p className="text-sm text-slate-400">Select your preferred Stellar wallet</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {WALLETS.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleSelect(wallet.id)}
              disabled={loadingId !== null}
              className="w-full group flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-blue-500/50 rounded-2xl transition-all duration-200 text-left disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                {wallet.icon}
                <div>
                  <h3 className="font-bold text-white group-hover:text-blue-400 transition">{wallet.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {wallet.type === "Extension" ? <Monitor className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                    {wallet.description}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {loadingId === wallet.id ? (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="px-4 py-1.5 bg-slate-700 group-hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition">
                    Connect
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="p-6 bg-slate-950/50 text-center">
          <p className="text-xs text-slate-500">
            By connecting a wallet, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
