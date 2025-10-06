import http from "@/lib/http";

/**
 * Check API health and demo mode
 */
export async function getHealth() {
  const response = await http.get("/health");
  return response.data;
}

/**
 * Check if app is in demo mode
 */
export async function isDemoMode() {
  try {
    const health = await getHealth();
    return !!(health && health.demo);
  } catch (error) {
    return false;
  }
}
