const { connectDB } = require("../lib/db");
const Movie = require("../lib/models/movie");
const formidable = require("formidable");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

module.exports.config = {
  api: { bodyParser: false }
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function parseForm(req) {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
  });
}

function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "movie-app-uploads", resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    fs.createReadStream(file.filepath).pipe(stream);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ success: false, msg: "Method not allowed" });
  try {
    await connectDB();
    const { fields, files } = await parseForm(req);

    const title = fields.title?.toString();
    const desc = fields.desc?.toString();
    const video = fields.video?.toString();
    const imageFile = Array.isArray(files.movieImg) ? files.movieImg[0] : files.movieImg;

    if (!title || !desc || !video || !imageFile) {
      return res.status(400).json({ success: false, msg: "Missing fields" });
    }

    const uploaded = await uploadToCloudinary(imageFile);
    const imageUrl = uploaded.secure_url;

    const newMovie = await Movie.create({ title, desc, img: imageUrl, video });
    return res.json({ success: true, msg: "Movie created successfully", movieId: newMovie._id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};