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

// Comment Schema
const CommentSchema = new mongoose.Schema(
  {
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: String,
    username: String,
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

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

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, msg: "Method not allowed" });
  }

  try {
    await connectDB();

    const { movieId, userId, comment, username } = req.body;

    if (!movieId || !userId || !comment || !username) {
      return res.status(400).json({ success: false, msg: "Missing fields" });
    }

    const newComment = await Comment.create({
      movieId,
      userId,
      comment,
      username,
    });

    return res.json({
      success: true,
      msg: "Comment created successfully",
      commentId: newComment._id,
    });
  } catch (e) {
    console.error("CreateComment Error:", e);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
}
