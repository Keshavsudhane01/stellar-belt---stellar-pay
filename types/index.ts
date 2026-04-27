export interface WalletState {
  publicKey: string | null
  isConnected: boolean
  isLoading: boolean
  balance: string
  network: string
}

export interface Transaction {
  id: string
  type: string
  amount: string
  destination: string
  createdAt: string
  successful: boolean
}

export interface SendPaymentForm {
  destination: string
  amount: string
  memo: string
}

export interface TransactionResult {
  success: boolean
  hash: string | null
  error: string | null
}
