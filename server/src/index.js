const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const config = require("./config");
const { connectMongo } = require("./db/mongoose");
const demoMiddleware = require("./middleware/demo");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const casesRouter = require("./routes/cases");

// Initialize Express app
const app = express();

// Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging (only in development)
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    demo: config.isDemoMode,
    version: config.appVersion,
    environment: config.nodeEnv,
  });
});

// Demo mode middleware
app.use(demoMiddleware);

// API Routes
app.use("/api/cases", casesRouter);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectMongo();
    console.log("✓ Connected to MongoDB");

    // Start listening
    app.listen(config.port, () => {
      console.log(`✓ ${config.appName} v${config.appVersion}`);
      console.log(`✓ Environment: ${config.nodeEnv}`);
      console.log(`✓ Server listening on port ${config.port}`);
      console.log(`✓ Demo mode: ${config.isDemoMode ? "ENABLED" : "DISABLED"}`);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\nSIGINT received. Shutting down gracefully...");
  process.exit(0);
});

// Start the server
startServer();
