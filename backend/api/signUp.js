const { connectDB } = require("../lib/db");
const User = require("../lib/models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, msg: "Method not allowed" });
  try {
    await connectDB();
    const { name, username, email, password } = req.body || {};
    if (!name || !username || !email || !password) {
      return res.status(400).json({ success: false, msg: "Missing fields" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.json({ success: false, msg: "Email already exists" });

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, username, email, password: hash });

    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET || "change-me", { expiresIn: "7d" });
    return res.json({ success: true, token, userId: user._id, name: user.name, username: user.username });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};