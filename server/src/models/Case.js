const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    // Party references
    plaintiffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    defendantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    // Who is the lawyer's client
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    clientRole: {
      type: String,
      enum: ["plaintiff", "defendant"],
      required: true,
    },
    court: String,
    judge: String,
    case_number: String,
    initiation_date: String, // YYYY-MM-DD
    hearing_date: String, // YYYY-MM-DD
    hearing_dates: [
      {
        date: String, // YYYY-MM-DD
        notes: String,
        status: {
          type: String,
          enum: ["scheduled", "completed", "cancelled", "postponed"],
          default: "scheduled",
        },
      },
    ],
    notes: String,
    amount: String,
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
CaseSchema.index({ companyId: 1, createdAt: -1 });
CaseSchema.index({ companyId: 1, case_number: 1 });

// Text search index (scoped by company in queries)
CaseSchema.index({
  court: "text",
  case_number: "text",
  notes: "text",
});

module.exports = mongoose.model("Case", CaseSchema);
