const ExcelJS = require("exceljs");

/**
 * Generate Excel file from case data
 */
async function generateCasesExcel(cases) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("საქმეები");

  // Headers
  const headers = [
    "#",
    "მოსარჩელე",
    "საიდენთიფიკაციო ნომერი (მოს.)",
    "მოპასუხე",
    "საიდენთიფიკაციო ნომერი (მოპ.)",
    "მოთხოვნის ოდენობა",
    "განმხილველი ორგანო",
    "საქმის ნომერი",
    "კომენტარი",
  ];

  sheet.addRow(headers);

  // Style header row
  sheet.getRow(1).font = {
    bold: true,
    name: "Noto Sans Georgian",
  };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD9F2D9" },
  };

  // Add data rows
  cases.forEach((caseData, idx) => {
    sheet.addRow([
      idx + 1,
      caseData.plaintiff || "",
      caseData.plaintiff_id || "",
      caseData.defendant || "",
      caseData.defendant_id || "",
      caseData.amount || "",
      caseData.court || "",
      caseData.case_number || "",
      caseData.notes || "",
    ]);
  });

  // Set column widths
  const widths = [6, 22, 24, 22, 24, 20, 24, 20, 40];
  widths.forEach((width, index) => {
    sheet.getColumn(index + 1).width = width;
  });

  return workbook;
}

module.exports = { generateCasesExcel };

