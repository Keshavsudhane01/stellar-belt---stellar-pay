"use client"

import { X, LogOut, LayoutDashboard, History, Zap, Settings } from "lucide-react"
import { useWallet } from "../context/WalletContext"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { isConnected, disconnect } = useWallet()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-slate-900 border-l border-slate-800 p-6 shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-2">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-2xl transition group">
            <LayoutDashboard className="w-5 h-5 text-slate-500 group-hover:text-blue-400" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-2xl transition group">
            <History className="w-5 h-5 text-slate-500 group-hover:text-purple-400" />
            <span className="font-medium">Activity</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-2xl transition group">
            <Zap className="w-5 h-5 text-slate-500 group-hover:text-amber-400" />
            <span className="font-medium">Faucet</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-2xl transition group">
            <Settings className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        {isConnected && (
          <div className="mt-auto pt-10">
            <button 
              onClick={() => {
                disconnect()
                onClose()
              }}
              className="w-full flex items-center gap-4 px-4 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition border border-red-500/20"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-bold">Disconnect Wallet</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
