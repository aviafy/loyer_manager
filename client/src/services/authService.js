import http from "@/lib/http";

/**
 * Login user
 */
export async function login(email, password) {
  const response = await http.post("/auth/login", { email, password });
  return response.data;
}

/**
 * Register new user
 */
export async function register(userData) {
  const response = await http.post("/auth/register", userData);
  return response.data;
}

/**
 * Logout user
 */
export async function logout() {
  const response = await http.post("/auth/logout");
  return response.data;
}

/**
 * Get current user info
 */
export async function getCurrentUser() {
  const response = await http.get("/auth/me");
  return response.data;
}

/**
 * Check if user is authenticated
 * Since we use HTTP-only cookies, we check by trying to get current user
 */
export async function checkAuth() {
  try {
    await getCurrentUser();
    return true;
  } catch (error) {
    return false;
  }
}
