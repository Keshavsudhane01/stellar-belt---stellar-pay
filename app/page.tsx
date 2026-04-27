"use client"

import { useWallet } from "../context/WalletContext"
import { useState, Component, ErrorInfo, ReactNode } from "react"
import WalletButton from "../components/WalletButton"
import BalanceCard from "../components/BalanceCard"
import FaucetButton from "../components/FaucetButton"
import SendPayment from "../components/SendPayment"
import TransactionList from "../components/TransactionList"
import ContractInteraction from "../components/ContractInteraction"
import PaymentSplitter from "../components/PaymentSplitter"
import ActivityFeed from "../components/ActivityFeed"
import MobileMenu from "../components/MobileMenu"
import { Rocket, Shield, Zap, AlertTriangle, Menu } from "lucide-react"

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-900">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-slate-400 mb-6">We encountered an unexpected error. Please refresh the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
          >
            Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default function Home() {
  const { isConnected, publicKey, connect } = useWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <ErrorBoundary>
      <main className="min-h-screen flex flex-col">
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center transform rotate-12">
                <span className="text-white font-bold text-xl -rotate-12">S</span>
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                StellarPay
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-6 mr-6">
                <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition">Dashboard</a>
                <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition">Contracts</a>
                <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition">Docs</a>
              </div>
              <WalletButton />
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          {!isConnected || !publicKey ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
              <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                Send XLM <span className="text-blue-500">Instantly</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                Connect your preferred Stellar wallet to get started on Testnet. Fast, secure, and multi-wallet supported.
              </p>
              
              <button 
                onClick={connect}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition shadow-xl shadow-blue-600/20 mb-20"
              >
                Connect Wallet
              </button>

              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto w-full text-left">
                <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
                  <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Fast</h3>
                  <p className="text-slate-400">Transactions settle in seconds on the Stellar network.</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
                  <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Secure</h3>
                  <p className="text-slate-400">Connect securely with Freighter, xBull, or Albedo.</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-sm">
                  <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-4">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Soroban</h3>
                  <p className="text-slate-400">Interact with high-performance smart contracts on Stellar.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              <div className="space-y-4">
                <BalanceCard />
                <FaucetButton />
                <SendPayment />
              </div>
              <div className="space-y-4">
                <PaymentSplitter />
                <ContractInteraction />
              </div>
              <div className="space-y-4">
                <ActivityFeed />
                <TransactionList />
              </div>
            </div>
          )}
        </div>

        <footer className="border-t border-slate-800 py-8 mt-auto">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
            <p>© 2026 StellarPay | Built on Stellar Testnet</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Docs</a>
            </div>
          </div>
        </footer>
      </main>
    </ErrorBoundary>
  )
}
