const mongoose = require("mongoose");
const config = require("../config");

let memoryServer = null;

/**
 * Connect to MongoDB
 * Falls back to in-memory database if MongoDB is unavailable (development only)
 */
async function connectMongo(uri) {
  const mongoUri = uri || config.mongoUri;

  // Already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });

    // Connection event handlers
    mongoose.connection.on("connected", () => {
      console.log(`Mongoose connected to ${mongoUri}`);
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });

    return mongoose.connection;
  } catch (err) {
    // Fallback to in-memory server (development only)
    if (config.nodeEnv === "development") {
      console.warn("MongoDB connection failed. Using in-memory database...");
      const { MongoMemoryServer } = require("mongodb-memory-server");
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      await mongoose.connect(memUri, { autoIndex: true });
      console.log("Connected to in-memory MongoDB");
      return mongoose.connection;
    } else {
      throw err;
    }
  }
}

/**
 * Disconnect from MongoDB
 * Also stops in-memory server if it was used
 */
async function disconnectMongo() {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

module.exports = { connectMongo, disconnectMongo };
