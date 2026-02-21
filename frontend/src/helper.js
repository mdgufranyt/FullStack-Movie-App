// Automatically detect environment and set API base URL
const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const api_base_url = isLocal
  ? "http://localhost:3000"
  : import.meta.env.VITE_API_URL;

console.log("API base URL:", api_base_url);
