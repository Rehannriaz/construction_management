import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import { Request, Response, NextFunction } from "express";

// Rate limiting configuration
export const createRateLimitMiddleware = (
  windowMs: number = 15 * 60 * 1000,
  max: number = 100
) => {
  return rateLimit({
    windowMs, // 15 minutes by default
    max, // Limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Auth rate limiting - stricter for auth endpoints
export const authRateLimit = createRateLimitMiddleware(15 * 60 * 1000, 2000); // 5 attempts per 15 minutes

// General rate limiting
export const generalRateLimit = createRateLimitMiddleware(
  parseInt(process.env.RATE_LIMIT_WINDOW || "15") * 60 * 1000,
  parseInt(process.env.RATE_LIMIT_MAX || "100")
);

// Helmet configuration for security headers
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// CORS configuration
export const corsConfig = cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:3000",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://site-tasker.vercel.app", // Add production frontend URL
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200,
});

// Error handling middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", error);

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
    return;
  }

  if (error.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "Token expired",
    });
    return;
  }

  // CORS errors
  if (error.message === "Not allowed by CORS") {
    res.status(403).json({
      success: false,
      message: "CORS error: Origin not allowed",
    });
    return;
  }

  // Default error
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
  });
};

// Request logging middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("User-Agent")?.substring(0, 100) || "unknown",
    };

    if (process.env.NODE_ENV === "development") {
      console.log(JSON.stringify(logData, null, 2));
    } else {
      console.log(JSON.stringify(logData));
    }
  });

  next();
};
