// Debug endpoint - Updated at 2025-10-14
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    mongodb_exists: !!process.env.MONGODB_URI,
    mongodb_length: process.env.MONGODB_URI
      ? process.env.MONGODB_URI.length
      : 0,
    jwt_exists: !!process.env.JWT_SECRET,
  });
}
