import { Horizon, StrKey } from "@stellar/stellar-sdk"
import { Transaction } from "../types"
import { cachedFetch } from "./cache"

const HORIZON_URL = "https://horizon-testnet.stellar.org"
const server = new Horizon.Server(HORIZON_URL)

export async function getXLMBalance(publicKey: string): Promise<string> {
  return cachedFetch(`balance:${publicKey}`, async () => {
    try {
      const account = await server.loadAccount(publicKey)
      const nativeBalance = account.balances.find((b) => b.asset_type === "native")
      if (nativeBalance) {
        return parseFloat(nativeBalance.balance).toFixed(4)
      }
      return "0.0000"
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return "0.0000"
      }
      console.error("Error fetching balance:", error)
      return "0.0000"
    }
  }, 15_000)
}

export async function getRecentTransactions(publicKey: string, limit = 5): Promise<Transaction[]> {
  return cachedFetch(`txs:${publicKey}`, async () => {
    try {
      const records = await server.transactions().forAccount(publicKey).limit(limit).order("desc").call()
      
      return records.records.map((record: any) => ({
        id: record.id,
        type: "tx",
        amount: record.fee_charged, // fallback since transaction itself doesn't have an "amount" field like a payment does
        destination: record.source_account,
        createdAt: record.created_at,
        successful: record.successful
      }))
    } catch (error) {
      console.error("Error fetching transactions:", error)
      return []
    }
  }, 30_000)
}

export function isValidStellarAddress(address: string): boolean {
  if (!address) return false
  try {
    if (StrKey.isValidEd25519PublicKey(address)) return true
  } catch (e) {}
  // Fallback for environments where StrKey might fail (e.g. some test runners)
  return /^[G][A-Z2-7]{55}$/.test(address)
}

export async function fundTestnetAccount(publicKey: string): Promise<boolean> {
  try {
    const response = await fetch(`https://friendbot.stellar.org/?addr=${publicKey}`)
    return response.ok
  } catch (error) {
    console.error("Error funding account:", error)
    return false
  }
}
