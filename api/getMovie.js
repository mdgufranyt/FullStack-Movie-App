const mongoose = require("mongoose");

// MongoDB connection with caching for serverless
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Movie Schema
const MovieSchema = new mongoose.Schema(
  {
    title: String,
    desc: String,
    img: String,
    video: String,
  },
  { timestamps: true }
);

const Movie = mongoose.models.Movie || mongoose.model("Movie", MovieSchema);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, msg: "Method not allowed" });
  }

  try {
    await connectDB();

    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Movie ID is required" });
    }

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ success: false, msg: "Movie not found" });
    }

    return res.json({
      success: true,
      movie,
    });
  } catch (e) {
    console.error("GetMovie Error:", e);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
}
