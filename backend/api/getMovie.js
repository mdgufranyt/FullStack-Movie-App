const { connectDB } = require("../lib/db");
const Movie = require("../lib/models/movie");
const User = require("../lib/models/user");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, msg: "Method not allowed" });
  try {
    await connectDB();
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { movieId, userId } = body || {};
    if (!movieId || !userId) return res.status(400).json({ success: false, msg: "Missing fields" });

    const user = await User.findById(userId);
    const movie = await Movie.findById(movieId);
    if (!movie) return res.json({ success: false, msg: "Movie not found" });

    const fullMovieData = [{
      username: user?.username || "",
      name: user?.name || "",
      moveId: movieId, // keep compatibility with your frontend
      title: movie.title,
      desc: movie.desc,
      img: movie.img,
      video: movie.video,
      date: movie.date,
      comments: movie.comments || []
    }];

    return res.json({ success: true, movie: fullMovieData });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};