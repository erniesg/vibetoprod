export class CacheService {
  private kv: KVNamespace | undefined;
  private ttl: number = 3600; // 1 hour default

  constructor(kv?: KVNamespace) {
    this.kv = kv;
  }

  private generateCacheKey(input: any): string {
    // Create a deterministic cache key from input
    const keyData = {
      appDescription: input.appDescription?.toLowerCase().trim(),
      persona: input.persona,
      scale: input.scale,
      priorities: input.priorities?.sort(),
      competitor: input.competitor || input.competitors?.[0],
    };
    
    // Simple hash function
    const str = JSON.stringify(keyData);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return `arch_${Math.abs(hash)}`;
  }

  async get<T>(input: any): Promise<T | null> {
    if (!this.kv) return null;
    
    try {
      const key = this.generateCacheKey(input);
      const cached = await this.kv.get(key, 'json');
      if (cached) {
        console.log(`✅ Cache hit for key: ${key}`);
        return cached as T;
      }
    } catch (error) {
      console.error('Cache get error:', error);
    }
    
    return null;
  }

  async set(input: any, data: any): Promise<void> {
    if (!this.kv) return;
    
    try {
      const key = this.generateCacheKey(input);
      await this.kv.put(key, JSON.stringify(data), {
        expirationTtl: this.ttl
      });
      console.log(`💾 Cached result with key: ${key}`);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
}