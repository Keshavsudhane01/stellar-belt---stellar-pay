export class WalletNotFoundError extends Error {
  constructor(walletName: string) {
    super(`${walletName} wallet extension not found. Please install it first.`)
    this.name = "WalletNotFoundError"
  }
}

export class UserRejectedError extends Error {
  constructor() {
    super("Transaction was rejected. You cancelled the signing request.")
    this.name = "UserRejectedError"
  }
}

export class InsufficientBalanceError extends Error {
  constructor(available: string, required: string) {
    super(`Insufficient balance. You have ${available} XLM but need ${required} XLM.`)
    this.name = "InsufficientBalanceError"
  }
}

export class NetworkError extends Error {
  constructor(detail: string) {
    super(`Network error: ${detail}`)
    this.name = "NetworkError"
  }
}

export function parseHorizonError(error: any): string {
  const codes = error?.response?.data?.extras?.result_codes
  if (!codes) return error?.message || "Unknown error occurred"
  if (codes.operations?.includes("op_underfunded")) {
    return "Insufficient balance for this transaction."
  }
  if (codes.operations?.includes("op_no_destination")) {
    return "Destination account does not exist on Stellar network."
  }
  if (codes.transaction === "tx_bad_auth") {
    return "Transaction authorization failed. Check your wallet."
  }
  if (codes.transaction === "tx_insufficient_fee") {
    return "Transaction fee too low. Please try again."
  }
  return `Transaction failed: ${JSON.stringify(codes)}`
}
