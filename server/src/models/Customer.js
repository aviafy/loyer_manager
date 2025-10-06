const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
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
    // Additional customer information
    nationalId: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
    },
    // Track who created/modified
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Compound indexes for multi-tenant queries
CustomerSchema.index({ companyId: 1, name: 1 });
CustomerSchema.index({ companyId: 1, email: 1 });
CustomerSchema.index({ companyId: 1, createdAt: -1 });

// Text search index for autocomplete
CustomerSchema.index({
  name: "text",
  email: "text",
  phone: "text",
});

module.exports = mongoose.model("Customer", CustomerSchema);
