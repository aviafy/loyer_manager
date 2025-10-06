import http from "@/lib/http";
import { API_ENDPOINTS } from "@/constants";

/**
 * Search customers for autocomplete
 */
export async function search(query) {
  const response = await http.get(`${API_ENDPOINTS.CUSTOMERS}/search`, {
    params: { q: query },
  });
  return response.data || [];
}

/**
 * Get all customers
 */
export async function getCustomers({ search = "", page = 1, limit = 50 } = {}) {
  const response = await http.get(API_ENDPOINTS.CUSTOMERS, {
    params: { search, page, limit },
  });
  return response.data;
}

/**
 * Get customer by ID
 */
export async function getCustomerById(id) {
  const response = await http.get(`${API_ENDPOINTS.CUSTOMERS}/${id}`);
  return response.data;
}

/**
 * Create new customer
 */
export async function createCustomer(data) {
  const response = await http.post(API_ENDPOINTS.CUSTOMERS, data);
  return response.data;
}

/**
 * Update customer
 */
export async function updateCustomer(id, data) {
  const response = await http.put(`${API_ENDPOINTS.CUSTOMERS}/${id}`, data);
  return response.data;
}

/**
 * Delete customer
 */
export async function deleteCustomer(id) {
  const response = await http.delete(`${API_ENDPOINTS.CUSTOMERS}/${id}`);
  return response.data;
}

export const customerService = {
  search,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
