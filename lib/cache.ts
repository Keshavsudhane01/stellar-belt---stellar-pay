interface CacheEntry<T> {
  data: T
  timestamp: number
  key: string
}

class StellarCache {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private defaultTTL = 30_000 // 30 seconds

  set<T>(key: string, data: T, ttl = this.defaultTTL): void {
    this.cache.set(key, { data, timestamp: Date.now(), key })
    setTimeout(() => this.cache.delete(key), ttl)
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    if (Date.now() - entry.timestamp > this.defaultTTL) {
      this.cache.delete(key)
      return null
    }
    return entry.data as T
  }

  invalidate(key: string): void { this.cache.delete(key) }
  invalidatePrefix(prefix: string): void {
    for (const key of Array.from(this.cache.keys())) {
      if (key.startsWith(prefix)) this.cache.delete(key)
    }
  }
  clear(): void { this.cache.clear() }
}

export const stellarCache = new StellarCache()

export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cached = stellarCache.get<T>(key)
  if (cached !== null) return cached
  const data = await fetcher()
  stellarCache.set(key, data, ttl)
  return data
}
