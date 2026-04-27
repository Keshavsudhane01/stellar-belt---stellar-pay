"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { WalletState } from "../types"
import { kit, disconnectKit } from "../lib/wallet"
import { getXLMBalance } from "../lib/stellar"
import WalletModal from "../components/WalletModal"

interface WalletContextType extends WalletState {
  connect: () => void
  disconnect: () => void
  refreshBalance: () => Promise<void>
  setOptimisticBalance: (balance: string | null) => void
  optimisticBalance: string | null
  optimisticTxs: any[]
  addOptimisticTx: (tx: any) => void
  removeOptimisticTx: (id: string) => void
}

const initialState: WalletState = {
  publicKey: null,
  isConnected: false,
  isLoading: false,
  balance: "0.0000",
  network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || "TESTNET"
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(initialState)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [optimisticBalance, setOptimisticBalance] = useState<string | null>(null)
  const [optimisticTxs, setOptimisticTxs] = useState<any[]>([])

  const addOptimisticTx = (tx: any) => setOptimisticTxs(prev => [tx, ...prev])
  const removeOptimisticTx = (id: string) => setOptimisticTxs(prev => prev.filter(t => t.id !== id))

  const refreshBalance = async () => {
    if (!state.publicKey) return
    setState(prev => ({ ...prev, isLoading: true }))
    const balance = await getXLMBalance(state.publicKey)
    setState(prev => ({ ...prev, balance, isLoading: false }))
  }

  const handleWalletSelect = async (walletId: string) => {
    try {
      kit.setWallet(walletId)
      const { address } = await kit.fetchAddress()
      
      localStorage.setItem("stellar_wallet_id", walletId)
      localStorage.setItem("stellar_wallet_pk", address)
      
      const balance = await getXLMBalance(address)
      setState({
        ...initialState,
        publicKey: address,
        isConnected: true,
        isLoading: false,
        balance
      })
      setIsModalOpen(false)
    } catch (error) {
      console.error("Wallet connection failed:", error)
      throw error
    }
  }

  const connect = () => {
    setIsModalOpen(true)
  }

  const disconnect = () => {
    disconnectKit()
    setState(initialState)
  }

  useEffect(() => {
    const pk = localStorage.getItem("stellar_wallet_pk")
    const walletId = localStorage.getItem("stellar_wallet_id")
    if (pk && walletId) {
      try {
        kit.setWallet(walletId)
        setState(prev => ({ ...prev, publicKey: pk, isConnected: true }))
        getXLMBalance(pk).then(balance => {
          setState(prev => ({ ...prev, balance }))
        })
      } catch (e) {
        console.error("Auto-reconnect failed:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (state.isConnected && state.publicKey) {
      const interval = setInterval(() => {
        refreshBalance()
      }, 15000)
      return () => clearInterval(interval)
    }
  }, [state.isConnected, state.publicKey])

  return (
    <WalletContext.Provider value={{ 
      ...state, 
      connect, 
      disconnect, 
      refreshBalance,
      optimisticBalance,
      setOptimisticBalance,
      optimisticTxs,
      addOptimisticTx,
      removeOptimisticTx
    }}>
      {children}
      <WalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleWalletSelect}
      />
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
