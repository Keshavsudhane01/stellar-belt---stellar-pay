import { rpc as SorobanRpc } from "@stellar/stellar-sdk"

export interface StellarEvent {
  id: string
  contractId: string
  type: "INCREMENT" | "SPLIT" | "TRANSFER" | "MINT"
  value: any
  timestamp: Date
  txHash: string
}

export class EventStreamManager {
  private server = new SorobanRpc.Server(process.env.NEXT_PUBLIC_SOROBAN_RPC || "https://soroban-testnet.stellar.org")
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private lastLedger: number = 0

  subscribe(
    contractIds: string[],
    onEvent: (event: StellarEvent) => void,
    intervalMs = 5000
  ): () => void {
    const id = Math.random().toString(36).slice(2)

    const poll = async () => {
      try {
        const latestLedger = await this.server.getLatestLedger()
        const startLedger = this.lastLedger || latestLedger.sequence - 100
        const result = await this.server.getEvents({
          startLedger,
          filters: contractIds.map(contractId => ({
            type: "contract" as const,
            contractIds: [contractId]
          }))
        })
        this.lastLedger = latestLedger.sequence
        result.events.forEach(raw => {
          const event = this.parseEvent(raw)
          if (event) onEvent(event)
        })
      } catch (err) {
        console.warn("Event stream error:", err)
      }
    }

    poll() // immediate first call
    const interval = setInterval(poll, intervalMs)
    this.intervals.set(id, interval)
    return () => {
      clearInterval(interval)
      this.intervals.delete(id)
    }
  }

  private parseEvent(raw: any): StellarEvent | null {
    try {
      const topics = raw.topic.map((t: any) => t.value ? t.value() : t)
      return {
        id: raw.id,
        contractId: raw.contractId,
        type: topics[0]?.toString() as StellarEvent["type"],
        value: raw.value?.value ? raw.value.value() : raw.value,
        timestamp: new Date(),
        txHash: raw.txHash
      }
    } catch { return null }
  }

  stopAll(): void {
    this.intervals.forEach(i => clearInterval(i))
    this.intervals.clear()
  }
}

export const eventStream = new EventStreamManager()
