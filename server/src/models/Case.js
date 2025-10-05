const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema(
  {
    plaintiff: String,
    plaintiff_id: String,
    defendant: String,
    defendant_id: String,
    court: String,
    judge: String,
    case_number: String,
    initiation_date: String, // YYYY-MM-DD
    hearing_date: String, // YYYY-MM-DD
    notes: String,
    amount: String,
  },
  { timestamps: true }
);

CaseSchema.index({
  plaintiff: "text",
  defendant: "text",
  court: "text",
  case_number: "text",
  notes: "text",
});

module.exports = mongoose.model("Case", CaseSchema);
