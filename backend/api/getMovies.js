const { connectDB } = require("../lib/db");
const Movie = require("../lib/models/movie");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ success: false, msg: "Method not allowed" });
  try {
    await connectDB();
    const movies = await Movie.find({});
    if (!movies || movies.length === 0) return res.json({ success: false, msg: "No movies found" });
    return res.json({ success: true, movies });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};