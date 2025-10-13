export default function handler(req, res) {
  try {
    console.log("Test API called!");

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    res.status(200).json({
      success: true,
      message: "Test API working!",
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test API error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
