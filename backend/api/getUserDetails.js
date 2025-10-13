const { connectDB } = require("../lib/db");
const User = require("../lib/models/user");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, msg: "Method not allowed" });
  try {
    await connectDB();
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { userId } = body || {};
    if (!userId) return res.json({ success: false, msg: "Missing userId" });
    const user = await User.findById(userId).select("name username email _id");
    if (!user) return res.json({ success: false, msg: "User not found" });
    return res.json({ success: true, user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};