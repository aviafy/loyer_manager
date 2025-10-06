const mongoose = require("mongoose");
const crypto = require("crypto");

const ShareableLinkSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true,
    },
    // Unique token for the shareable link
    token: {
      type: String,
      unique: true,
      index: true,
    },
    // Optional: Limit who can access
    recipientEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    // Optional: Password protection
    password: {
      type: String,
    },
    // Expiration date
    expiresAt: {
      type: Date,
      index: true,
    },
    // Access tracking
    accessCount: {
      type: Number,
      default: 0,
    },
    lastAccessedAt: {
      type: Date,
    },
    // Status
    status: {
      type: String,
      enum: ["active", "revoked", "expired"],
      default: "active",
      index: true,
    },
    // Who created this link
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Generate unique token before saving
ShareableLinkSchema.pre("save", function (next) {
  if (!this.token) {
    this.token = crypto.randomBytes(32).toString("hex");
  }
  next();
});

// Method to check if link is valid
ShareableLinkSchema.methods.isValid = function () {
  if (this.status !== "active") return false;
  if (this.expiresAt && this.expiresAt < new Date()) {
    this.status = "expired";
    return false;
  }
  return true;
};

// Method to record access
ShareableLinkSchema.methods.recordAccess = async function () {
  this.accessCount += 1;
  this.lastAccessedAt = new Date();
  await this.save();
};

module.exports = mongoose.model("ShareableLink", ShareableLinkSchema);
