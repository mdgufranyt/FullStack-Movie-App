const { connectDB } = require("../lib/db");
const User = require("../lib/models/user");
const bcrypt = require("bcryptjs");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, msg: "Method not allowed" });
  try {
    await connectDB();
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { email, password, key, userId } = body || {};
    if (!email || !password || !key || !userId) return res.status(400).json({ success: false, msg: "Missing fields" });

    if (key !== process.env.ADMIN_KEY) return res.json({ success: false, msg: "Invalid admin key" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, msg: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.json({ success: false, msg: "Invalid password" });

    if (String(user._id) !== String(userId)) return res.json({ success: false, msg: "User mismatch" });

    return res.json({ success: true, msg: "Admin verified" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};