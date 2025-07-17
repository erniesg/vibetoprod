export class RateLimiter {
  private kv: KVNamespace | undefined;
  private maxRequests: number;
  private windowMs: number;

  constructor(kv?: KVNamespace, maxRequests = 10, windowMs = 60000) {
    this.kv = kv;
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async checkLimit(identifier: string): Promise<{ allowed: boolean; remaining: number }> {
    if (!this.kv) {
      // If no KV, allow all requests
      return { allowed: true, remaining: this.maxRequests };
    }

    const key = `rate_limit_${identifier}`;
    const now = Date.now();
    const windowStart = now - this.windowMs;

    try {
      // Get current request timestamps
      const data = await this.kv.get(key, 'json') as number[] || [];
      
      // Filter out old requests outside the window
      const recentRequests = data.filter(timestamp => timestamp > windowStart);
      
      if (recentRequests.length >= this.maxRequests) {
        return { allowed: false, remaining: 0 };
      }

      // Add current request
      recentRequests.push(now);
      
      // Store updated list with TTL
      await this.kv.put(key, JSON.stringify(recentRequests), {
        expirationTtl: Math.ceil(this.windowMs / 1000)
      });

      return { 
        allowed: true, 
        remaining: this.maxRequests - recentRequests.length 
      };
    } catch (error) {
      console.error('Rate limiter error:', error);
      // On error, allow the request
      return { allowed: true, remaining: this.maxRequests };
    }
  }
}