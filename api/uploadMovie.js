const mongoose = require("mongoose");
const formidable = require("formidable");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "movie-app-uploads",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    fs.createReadStream(file.filepath).pipe(stream);
  });
}

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

    const { fields, files } = await parseForm(req);

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const desc = Array.isArray(fields.desc) ? fields.desc[0] : fields.desc;
    const video = Array.isArray(fields.video) ? fields.video[0] : fields.video;
    const imageFile = Array.isArray(files.movieImg)
      ? files.movieImg[0]
      : files.movieImg;

    if (!title || !desc || !video || !imageFile) {
      return res.status(400).json({ success: false, msg: "Missing fields" });
    }

    const uploaded = await uploadToCloudinary(imageFile);
    const imageUrl = uploaded.secure_url;

    const newMovie = await Movie.create({ title, desc, img: imageUrl, video });

    return res.json({
      success: true,
      msg: "Movie created successfully",
      movieId: newMovie._id,
    });
  } catch (e) {
    console.error("UploadMovie Error:", e);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
}
