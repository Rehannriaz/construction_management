"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import database config
const database_1 = require("./config/database");
// Import middleware
const security_1 = require("./middleware/security");
// Import routes
const auth_1 = require("./routes/auth");
// Import swagger
const swagger_1 = require("./config/swagger");
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);
// Security middleware
app.use(security_1.helmetConfig);
app.use(security_1.corsConfig);
// Request logging
if (process.env.NODE_ENV === 'development') {
    app.use(security_1.requestLogger);
}
// Rate limiting
app.use('/auth', security_1.authRateLimit); // Stricter rate limiting for auth routes
app.use(security_1.generalRateLimit); // General rate limiting for all other routes
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Site Tasker API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    });
});
// API routes
app.use('/auth', auth_1.authRoutes);
// Setup Swagger documentation
(0, swagger_1.setupSwagger)(app);
// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        availableEndpoints: {
            auth: '/auth/*',
            health: '/health',
            docs: '/api-docs'
        }
    });
});
// Global error handler (must be last)
app.use(security_1.errorHandler);
// Initialize database and start server
const startServer = async () => {
    try {
        // Initialize database connection
        await (0, database_1.initializeDatabase)();
        // Start server
        app.listen(PORT, () => {
            console.log(`
🚀 Site Tasker API Server Started Successfully!

📍 Server Details:
   • Port: ${PORT}
   • Environment: ${process.env.NODE_ENV || 'development'}
   • Database: Connected to PostgreSQL
   
🌐 Available Endpoints:
   • Health Check: http://localhost:${PORT}/health
   • API Docs: http://localhost:${PORT}/api-docs
   • Auth API: http://localhost:${PORT}/auth/*
   
🔧 Development URLs:
   • Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
   
⚡ Ready to handle requests!
      `);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔄 Shutting down gracefully...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log('\n🔄 Shutting down gracefully...');
    process.exit(0);
});
// Start the server
startServer();
