// Simple login function without MongoDB dependencies for testing
export default async function handler(req, res) {
  try {
    console.log("Simple login API called with method:", req.method);

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        msg: "Method not allowed",
      });
    }

    // Mock login for testing
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Email and password are required",
      });
    }

    // Mock successful login
    res.status(200).json({
      success: true,
      message: "Mock login successful",
      token: "mock-jwt-token",
      userId: "mock-user-id",
      user: {
        id: "mock-user-id",
        name: "Test User",
        email: email,
        isAdmin: false,
      },
    });
  } catch (error) {
    console.error("Simple login error:", error);
    res.status(500).json({
      success: false,
      msg: "Function error",
      error: error.message,
    });
  }
}
