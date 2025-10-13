const { connectDB } = require("../lib/db");
const Movie = require("../lib/models/movie");
const User = require("../lib/models/user");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, msg: "Method not allowed" });
  try {
    await connectDB();
    const { movieId, userId, comment } = req.body || {};
    if (!movieId || !userId || !comment) return res.status(400).json({ success: false, msg: "Missing fields" });

    const movie = await Movie.findById(movieId);
    if (!movie) return res.json({ success: false, msg: "Movie not found" });

    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, msg: "User not found" });

    movie.comments.push({
      commentBy: String(user._id),
      comment,
      username: user.name
    });

    await movie.save();

    return res.json({ success: true, msg: "Comment added", comments: movie.comments });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};