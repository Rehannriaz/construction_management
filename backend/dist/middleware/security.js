"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.errorHandler = exports.corsConfig = exports.helmetConfig = exports.generalRateLimit = exports.authRateLimit = exports.createRateLimitMiddleware = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
// Rate limiting configuration
const createRateLimitMiddleware = (windowMs = 15 * 60 * 1000, max = 100) => {
    return (0, express_rate_limit_1.default)({
        windowMs, // 15 minutes by default
        max, // Limit each IP to 100 requests per windowMs
        message: {
            success: false,
            message: 'Too many requests from this IP, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};
exports.createRateLimitMiddleware = createRateLimitMiddleware;
// Auth rate limiting - stricter for auth endpoints
exports.authRateLimit = (0, exports.createRateLimitMiddleware)(15 * 60 * 1000, 5); // 5 attempts per 15 minutes
// General rate limiting
exports.generalRateLimit = (0, exports.createRateLimitMiddleware)(parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000, parseInt(process.env.RATE_LIMIT_MAX || '100'));
// Helmet configuration for security headers
exports.helmetConfig = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false
});
// CORS configuration
exports.corsConfig = (0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin)
            return callback(null, true);
        const allowedOrigins = [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            'http://localhost:3000',
            'http://localhost:3001',
            'https://site-tasker.vercel.app' // Add production frontend URL
        ];
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies
    optionsSuccessStatus: 200
});
// Error handling middleware
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
        return;
    }
    if (error.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            message: 'Token expired'
        });
        return;
    }
    // CORS errors
    if (error.message === 'Not allowed by CORS') {
        res.status(403).json({
            success: false,
            message: 'CORS error: Origin not allowed'
        });
        return;
    }
    // Default error
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
};
exports.errorHandler = errorHandler;
// Request logging middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent')?.substring(0, 100) || 'unknown'
        };
        if (process.env.NODE_ENV === 'development') {
            console.log(JSON.stringify(logData, null, 2));
        }
        else {
            console.log(JSON.stringify(logData));
        }
    });
    next();
};
exports.requestLogger = requestLogger;
