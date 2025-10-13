let mongoose, bcrypt, jwt;

try {
  mongoose = require("mongoose");
  bcrypt = require("bcryptjs");
  jwt = require("jsonwebtoken");
} catch (importError) {
  console.error("Failed to import dependencies:", importError);
}

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create User model
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Connect to MongoDB Atlas
const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    console.log("Attempting MongoDB connection...");
    console.log("MongoDB URI exists:", !!process.env.MONGODB_URI);
    console.log(
      "MongoDB URI length:",
      process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0
    );

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    if (process.env.MONGODB_URI.length < 50) {
      throw new Error("MONGODB_URI appears to be incomplete (too short)");
    }

    if (!process.env.MONGODB_URI.startsWith("mongodb")) {
      throw new Error(
        "MONGODB_URI does not appear to be a valid MongoDB connection string"
      );
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

module.exports = async function handler(req, res) {
  try {
    console.log("Login API called with method:", req.method);
    console.log("Login API URL:", req.url);

    // Check if dependencies are loaded
    if (!mongoose || !bcrypt || !jwt) {
      console.error("Dependencies not loaded properly");
      return res.status(500).json({
        success: false,
        msg: "Server configuration error - dependencies missing",
      });
    }

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        msg: "Method not allowed. Use POST with email and password in body.",
      });
    }

    try {
      console.log("About to connect to DB...");
      await connectDB();
      console.log("DB connection successful");

      console.log("Request body:", JSON.stringify(req.body));
      const { email, password } = req.body;
      console.log(
        "Extracted email:",
        email,
        "password length:",
        password?.length
      );

      // Validate input
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, msg: "Email and password are required" });
      }

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, msg: "Invalid credentials" });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ success: false, msg: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "7d" }
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        userId: user._id,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        msg: "Internal server error",
        error: error.message,
      });
    }
  } catch (functionError) {
    console.error("Function level error:", functionError);
    try {
      res.status(500).json({
        success: false,
        msg: "Function crashed",
        error: functionError.message,
      });
    } catch (responseError) {
      console.error("Could not send error response:", responseError);
    }
  }
};
