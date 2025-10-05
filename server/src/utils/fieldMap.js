/**
 * Map Georgian UI field names to database field names
 * This allows the frontend to use Georgian labels
 * while the backend uses English field names
 */
const FIELD_MAP = {
  "#": "_id",
  მოსარჩელე: "plaintiff",
  "საიდენთიფიკაციო ნომერი (მოს.)": "plaintiff_id",
  მოპასუხე: "defendant",
  "საიდენთიფიკაციო ნომერი (მოპ.)": "defendant_id",
  "მოთხოვნის ოდენობა": "amount",
  "განმხილველი ორგანო": "court",
  "საქმის ნომერი": "case_number",
  კომენტარი: "notes",
  "წარმოებში მიღების თარიღი": "initiation_date",
  "სხდომის თარიღი": "hearing_date",
};

module.exports = FIELD_MAP;

