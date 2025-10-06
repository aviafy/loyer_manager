import http from "@/lib/http";
import { API_ENDPOINTS } from "@/constants";

/**
 * Fetch all cases with optional search and filters
 */
export async function getCases(params = {}) {
  const response = await http.get("/cases", { params });
  return response.data;
}

/**
 * Get a single case by ID
 */
export async function getCaseById(id) {
  const response = await http.get(`/cases/${id}`);
  return response.data;
}

/**
 * Create a new case
 */
export async function createCase(data) {
  const response = await http.post("/cases", data);
  return response.data;
}

/**
 * Update an existing case
 */
export async function updateCase(id, data) {
  const response = await http.put(`/cases/${id}`, data);
  return response.data;
}

/**
 * Delete a case
 */
export async function deleteCase(id) {
  const response = await http.delete(`/cases/${id}`);
  return response.data;
}

/**
 * Export cases to Excel
 */
export async function exportCases(params = {}) {
  const response = await http.get("/cases/export", {
    params,
    responseType: "blob",
  });
  return response.data;
}

/**
 * Download exported cases as Excel file
 */
export function downloadExcel(blob, filename = `cases_${Date.now()}.xlsx`) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
