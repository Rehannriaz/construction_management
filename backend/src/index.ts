import "reflect-metadata";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Import database config
import { initializeDatabase } from "./config/database";

//test
// Import middleware
import {
  helmetConfig,
  corsConfig,
  generalRateLimit,
  authRateLimit,
  errorHandler,
  requestLogger,
} from "./middleware/security";

// Import routes
import { authRoutes } from "./routes/auth";

// Import swagger
import { setupSwagger } from "./config/swagger";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for accurate IP addresses
app.set("trust proxy", 1);

// Security middleware
app.use(helmetConfig);
app.use(corsConfig);

// Request logging
if (process.env.NODE_ENV === "development") {
  app.use(requestLogger);
}

// Rate limiting
app.use("/auth", authRateLimit); // Stricter rate limiting for auth routes
app.use(generalRateLimit); // General rate limiting for all other routes

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Site Tasker API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
  });
});

// API routes
app.use("/auth", authRoutes);

// Setup Swagger documentation
setupSwagger(app);

// Catch-all route for undefined endpoints
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      auth: "/auth/*",
      health: "/health",
      docs: "/api-docs",
    },
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`
🚀 Site Tasker API Server Started Successfully!

📍 Server Details:
   • Port: ${PORT}
   • Environment: ${process.env.NODE_ENV || "development"}
   • Database: Connected to PostgreSQL
   
🌐 Available Endpoints:
   • Health Check: http://localhost:${PORT}/health
   • API Docs: http://localhost:${PORT}/api-docs
   • Auth API: http://localhost:${PORT}/auth/*
   
🔧 Development URLs:
   • Frontend: ${process.env.FRONTEND_URL || "http://localhost:3000"}
   
⚡ Ready to handle requests!
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🔄 Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🔄 Shutting down gracefully...");
  process.exit(0);
});

// Start the server
startServer();
