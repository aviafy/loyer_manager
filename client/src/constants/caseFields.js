export const CASE_FIELDS = {
  PLAINTIFF: {
    name: "plaintiff",
    label: "მოსარჩელე",
    placeholder: "შეიყვანეთ მოსარჩელის სახელი",
    required: true,
  },
  PLAINTIFF_ID: {
    name: "plaintiff_id",
    label: "საიდენთიფიკაციო ნომერი (მოს.)",
    placeholder: "მაგ: 01001234567",
    required: false,
  },
  DEFENDANT: {
    name: "defendant",
    label: "მოპასუხე",
    placeholder: "შეიყვანეთ მოპასუხის სახელი",
    required: true,
  },
  DEFENDANT_ID: {
    name: "defendant_id",
    label: "საიდენთიფიკაციო ნომერი (მოპ.)",
    placeholder: "მაგ: 01001234567",
    required: false,
  },
  CASE_NUMBER: {
    name: "case_number",
    label: "საქმის ნომერი",
    placeholder: "მაგ: 2/1234-23",
    required: false,
  },
  AMOUNT: {
    name: "amount",
    label: "მოთხოვნის ოდენობა",
    placeholder: "მაგ: 5000 ₾",
    required: false,
  },
  COURT: {
    name: "court",
    label: "განმხილველი ორგანო",
    placeholder: "მაგ: თბილისის საქალაქო სასამართლო",
    required: false,
  },
  INITIATION_DATE: {
    name: "initiation_date",
    label: "წარმოებაში მიღების თარიღი",
    required: false,
  },
  HEARING_DATE: {
    name: "hearing_date",
    label: "სხდომის თარიღი",
    required: false,
  },
  NOTES: {
    name: "notes",
    label: "კომენტარი",
    placeholder: "დამატებითი ინფორმაცია...",
    required: false,
  },
};

export const CASE_SECTIONS = {
  PARTIES: {
    title: "მხარეები",
    fields: ["plaintiff", "plaintiff_id", "defendant", "defendant_id"],
  },
  CASE_INFO: {
    title: "საქმის ინფორმაცია",
    fields: ["case_number", "amount", "court", "initiation_date", "hearing_date"],
  },
  NOTES: {
    title: "კომენტარი",
    fields: ["notes"],
  },
};
