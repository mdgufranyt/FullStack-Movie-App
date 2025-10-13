// Automatically detect environment and set API base URL
export const api_base_url =
  process.env.NODE_ENV === "development" ||
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000" // Local development
    : "/api"; // Production (Vercel)
