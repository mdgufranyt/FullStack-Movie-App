// Simplest possible test function
export default function handler(req, res) {
  console.log("Method:", req.method);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Always return success for any method
  res.status(200).json({
    success: true,
    message: "Working! Method was: " + req.method,
    timestamp: new Date().toISOString(),
    env_debug: {
      MONGODB_URI_exists: !!process.env.MONGODB_URI,
      MONGODB_URI_length: process.env.MONGODB_URI
        ? process.env.MONGODB_URI.length
        : 0,
      JWT_SECRET_exists: !!process.env.JWT_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    },
  });
}
