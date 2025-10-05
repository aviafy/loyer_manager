require("dotenv").config();

module.exports = {
  // Server
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  isDemoMode: process.env.DEMO_MODE === "1",

  // Database
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/court_cases",

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "*",

  // App
  appName: "Case Manager API",
  appVersion: "1.0.0",
};

