import http from "@/lib/http";

/**
 * Get all users in the company
 */
export async function getUsers(params = {}) {
  const response = await http.get("/users", { params });
  return response.data;
}

/**
 * Get user by ID
 */
export async function getUserById(id) {
  const response = await http.get(`/users/${id}`);
  return response.data;
}

/**
 * Create a new user
 */
export async function createUser(userData) {
  const response = await http.post("/users", userData);
  return response.data;
}

/**
 * Update user
 */
export async function updateUser(id, userData) {
  const response = await http.put(`/users/${id}`, userData);
  return response.data;
}

/**
 * Delete user
 */
export async function deleteUser(id) {
  const response = await http.delete(`/users/${id}`);
  return response.data;
}
