import { NextRequest } from 'next/server';

const rateLimitMap = new Map();

export function rateLimit({
  windowMs = 15 * 60 * 1000, // 15 minutes
  maxRequests = 100,
}: {
  windowMs?: number;
  maxRequests?: number;
} = {}) {
  return function (req: NextRequest): { success: boolean; resetTime?: number } {
    // Get IP from various headers since req.ip doesn't exist in NextRequest
    const ip = req.headers.get('x-forwarded-for') || 
              req.headers.get('x-real-ip') || 
              req.headers.get('cf-connecting-ip') || 
              'unknown';
    const key = `${ip}:${req.nextUrl.pathname}`;
    const now = Date.now();
    
    if (!rateLimitMap.has(key)) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return { success: true };
    }
    
    const data = rateLimitMap.get(key);
    
    if (now > data.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return { success: true };
    }
    
    if (data.count >= maxRequests) {
      return { success: false, resetTime: data.resetTime };
    }
    
    data.count++;
    return { success: true };
  };
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitMap.entries()) {
    if (now > (data as any).resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);
