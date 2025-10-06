const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  ME: `${API_BASE_URL}/api/auth/me`,

  // Cases
  CASES: `${API_BASE_URL}/api/cases`,
  CASE_BY_ID: (id) => `${API_BASE_URL}/api/cases/${id}`,
  CASE_EXPORT: `${API_BASE_URL}/api/cases/export`,

  // Users
  USERS: `${API_BASE_URL}/api/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,

  // Customers
  CUSTOMERS: `${API_BASE_URL}/api/customers`,
  CUSTOMER_BY_ID: (id) => `${API_BASE_URL}/api/customers/${id}`,

  // Shareable Links
  SHAREABLE_LINKS: `${API_BASE_URL}/api/shareable-links`,
  SHAREABLE_LINK_BY_TOKEN: (token) => `${API_BASE_URL}/api/shareable-links/${token}`,
};

export default API_ENDPOINTS;
