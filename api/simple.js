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
  });
}
