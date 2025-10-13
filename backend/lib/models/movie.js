const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    commentBy: String,
    comment: String,
    username: String,
    date: { type: Date, default: Date.now }
  },
  { _id: false }
);

const MovieSchema = new mongoose.Schema(
  {
    title: String,
    desc: String,
    img: String, // full Cloudinary URL
    video: String,
    comments: [CommentSchema],
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Movie || mongoose.model("Movie", MovieSchema);