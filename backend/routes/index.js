var express = require("express");
var router = express.Router();
var userModel = require("../models/userModel");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("../config/cloudinary"); // NEW
var movieModel = require("../models/movieModel");

// Use env JWT secret (fallback only for local dev)
const secret = process.env.JWT_SECRET || "change-me";

// Home
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Sign up
router.post("/signUp", async (req, res) => {
  let { username, name, email, password } = req.body;
  let emailCon = await userModel.findOne({ email });
  if (emailCon) {
    return res.json({ success: false, msg: "Email already exists" });
  }
  bcrypt.genSalt(12, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      if (err) throw err;
      let user = await userModel.create({
        name,
        username,
        email,
        password: hash,
      });
      return res.json({
        success: true,
        msg: "User created successfully",
        userId: user._id,
      });
    });
  });
});

// Login
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) return res.json({ success: false, msg: "User not found" });

  bcrypt.compare(password, user.password, function (err, isMatch) {
    if (err) throw err;
    if (!isMatch) return res.json({ success: false, msg: "Invalid password" });

    // Sign with env secret
    var token = jwt.sign({ email: user.email, userId: user._id }, secret);
    return res.json({
      success: true,
      msg: "User logged in successfully",
      userId: user._id,
      token,
    });
  });
});

// Get user details (requires authentication)
router.get("/getUserDetails", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({ success: false, msg: "No token provided" });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = jwt.verify(token, secret);
    const user = await userModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }

    return res.json({ success: true, user: user });
  } catch (error) {
    console.error("Get user details error:", error);
    return res.json({ success: false, msg: "Invalid token" });
  }
});

// Check admin status and login admin user
router.post("/checkAdmin", async (req, res) => {
  try {
    const { email, password, adminKey, userId } = req.body;

    // If userId is provided (user already logged in), just check admin status
    if (userId) {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.json({ success: false, msg: "User not found" });
      }

      return res.json({
        success: true,
        isAdmin: user.isAdmin || false,
        msg: user.isAdmin ? "User is admin" : "User is not admin",
      });
    }

    // If credentials provided, authenticate admin user
    if (email && password) {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({ success: false, msg: "User not found" });
      }

      // Verify password
      const isMatch = await new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      if (!isMatch) {
        return res.json({ success: false, msg: "Invalid password" });
      }

      // Check if user is admin
      if (!user.isAdmin) {
        return res.json({ success: false, msg: "User is not an admin" });
      }

      // Verify admin key (you can set this in environment variables)
      const correctAdminKey = process.env.ADMIN_KEY || "admin123"; // Set this in your .env file
      if (adminKey !== correctAdminKey) {
        return res.json({ success: false, msg: "Invalid admin key" });
      }

      // Generate token for admin
      const token = jwt.sign({ email: user.email, userId: user._id }, secret);

      return res.json({
        success: true,
        isAdmin: true,
        userId: user._id,
        token: token,
        msg: "Admin login successful",
      });
    }

    return res.json({ success: false, msg: "Missing required fields" });
  } catch (error) {
    console.error("Check admin error:", error);
    return res.json({ success: false, msg: "Server error" });
  }
});

// Create admin user (for initial setup - you can remove this in production)
router.post("/createAdminUser", async (req, res) => {
  try {
    const { name, username, email, password, adminKey } = req.body;

    // Verify admin key
    const correctAdminKey = process.env.ADMIN_KEY || "admin123";
    if (adminKey !== correctAdminKey) {
      return res.json({ success: false, msg: "Invalid admin key" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      // Make existing user admin
      existingUser.isAdmin = true;
      await existingUser.save();
      return res.json({ success: true, msg: "User promoted to admin" });
    }

    // Create new admin user
    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) throw err;
        const adminUser = await userModel.create({
          name,
          username,
          email,
          password: hash,
          isAdmin: true,
        });
        return res.json({
          success: true,
          msg: "Admin user created successfully",
          userId: adminUser._id,
        });
      });
    });
  } catch (error) {
    console.error("Create admin user error:", error);
    return res.json({ success: false, msg: "Server error" });
  }
});

// Multer: memory storage (no disk)
const upload = multer({ storage: multer.memoryStorage() });

// Upload movie: send image to Cloudinary, save secure_url
router.post("/uploadMovie", upload.single("movieImg"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, msg: "No image file uploaded" });
    }

    // Upload buffer via upload_stream
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "movie-app-uploads", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });
    };

    const uploaded = await streamUpload(req.file.buffer);
    const imageUrl = uploaded.secure_url;

    const newMovie = await movieModel.create({
      title: req.body.title,
      desc: req.body.desc,
      img: imageUrl, // Store full Cloudinary URL
      video: req.body.video,
    });

    return res.json({
      success: true,
      msg: "Movie created successfully",
      movieId: newMovie._id,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, msg: "Upload failed" });
  }
});

// Get movies
router.get("/getMovies", async (req, res) => {
  const movies = await movieModel.find({});
  if (movies.length > 0) return res.json({ success: true, movies });
  return res.json({ success: false, msg: "No movies found" });
});

// Get single movie
router.post("/getMovie", async (req, res) => {
  let { movieId, userId } = req.body;
  let user = await userModel.findById(userId);
  const movie = await movieModel.findById(movieId);

  if (!movie) return res.json({ success: false, msg: "Movie not found" });

  let fullMovieData = [
    {
      username: user?.username,
      name: user?.name,
      moveId: movieId,
      title: movie.title,
      desc: movie.desc,
      img: movie.img,
      video: movie.video,
      date: movie.date,
      comments: movie.comments,
    },
  ];

  return res.json({ success: true, movie: fullMovieData });
});

// Create comment
router.post("/createComment", async (req, res) => {
  let { movieId, userId, comment } = req.body;
  let movie = await movieModel.findById(movieId);
  if (!movie) return res.json({ success: false, msg: "Movie not found" });

  let user = await userModel.findById(userId);
  if (!user) return res.json({ success: false, msg: "User not found" });

  movie.comments.push({ commentBy: userId, comment, username: user.name });
  await movie.save();

  return res.json({
    success: true,
    msg: "Comment added",
    comments: movie.comments,
  });
});

module.exports = router;
