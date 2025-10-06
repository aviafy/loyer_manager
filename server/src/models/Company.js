const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    // Company-specific settings
    settings: {
      maxUsers: {
        type: Number,
        default: 10,
      },
      maxCases: {
        type: Number,
        default: 1000,
      },
    },
    // Company status
    status: {
      type: String,
      enum: ["active", "suspended", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Index for fast lookups
CompanySchema.index({ email: 1 }, { unique: true });
CompanySchema.index({ status: 1 });

module.exports = mongoose.model("Company", CompanySchema);
