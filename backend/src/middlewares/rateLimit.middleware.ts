import rateLimit from 'express-rate-limit';

// Strict limiter for authentication & high-risk routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 attempts per window
  message: { 
    success: false, 
    message: 'Too many authentication attempts. Please try again in 15 minutes.' 
  },
  standardHeaders: true, 
  legacyHeaders: false,
});

// General limiter for the rest of the API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: { 
    success: false, 
    message: 'Too many requests from this IP, please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});
