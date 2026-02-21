// Automatically detect environment and set API base URL
const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

if (!isLocal && !import.meta.env.VITE_API_URL) {
  console.error(
    "VITE_API_URL is not set. Add it to your Vercel frontend environment variables.",
  );
}

export const api_base_url = isLocal
  ? "http://localhost:3000" // Local development
  : import.meta.env.VITE_API_URL; // Production (Vercel backend URL)
