const { connectDB } = require("../lib/db");
const User = require("../lib/models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, msg: "Method not allowed" });
  try {
    await connectDB();
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, msg: "Missing credentials" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, msg: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.json({ success: false, msg: "Invalid password" });

    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET || "change-me", { expiresIn: "7d" });
    return res.json({
      success: true,
      token,
      userId: user._id,
      name: user.name,
      username: user.username
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};