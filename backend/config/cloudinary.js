const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // required
  api_key: process.env.CLOUDINARY_API_KEY,        // required
  api_secret: process.env.CLOUDINARY_API_SECRET   // required
});

module.exports = cloudinary;