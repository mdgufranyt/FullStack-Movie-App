// Automatically detect environment and set API base URL
export const api_base_url =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000" // Local development
    : import.meta.env.VITE_API_URL; // Production (Render backend URL)
