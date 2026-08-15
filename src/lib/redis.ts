import Redis from "ioredis";

export interface CacheStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  increment(key: string, ttlSeconds?: number): Promise<number>;
  del(key: string): Promise<void>;
}

class MemoryCache implements CacheStore {
  private readonly values = new Map<string, { value: string; expiresAt?: number }>();

  async get(key: string) {
    const entry = this.values.get(key);
    if (!entry || (entry.expiresAt && entry.expiresAt < Date.now())) {
      this.values.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    this.values.set(key, { value, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined });
  }

  async increment(key: string, ttlSeconds?: number) {
    const next = Number((await this.get(key)) ?? "0") + 1;
    await this.set(key, String(next), ttlSeconds);
    return next;
  }

  async del(key: string) {
    this.values.delete(key);
  }
}

class RedisCache implements CacheStore {
  constructor(private readonly client: Redis) {}
  async get(key: string) { return this.client.get(key); }
  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) await this.client.set(key, value, "EX", ttlSeconds);
    else await this.client.set(key, value);
  }
  async increment(key: string, ttlSeconds?: number) {
    const value = await this.client.incr(key);
    if (value === 1 && ttlSeconds) await this.client.expire(key, ttlSeconds);
    return value;
  }
  async del(key: string) { await this.client.del(key); }
}

const memoryCache = new MemoryCache();
let redisCache: RedisCache | undefined;

export function cache(): CacheStore {
  if (!process.env.REDIS_URL) return memoryCache;
  redisCache ??= new RedisCache(new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 2, lazyConnect: true }));
  return redisCache;
}

export async function enforceRateLimit(key: string, limit: number, windowSeconds: number) {
  const count = await cache().increment(`rate:${key}`, windowSeconds);
  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}
