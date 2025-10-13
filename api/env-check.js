// Environment variables check endpoint
export default function handler(req, res) {
  console.log("Checking environment variables...");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const envCheck = {
    MONGODB_URI: {
      exists: !!process.env.MONGODB_URI,
      length: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
      firstChars: process.env.MONGODB_URI
        ? process.env.MONGODB_URI.substring(0, 20)
        : "N/A",
      lastChars: process.env.MONGODB_URI
        ? process.env.MONGODB_URI.substring(process.env.MONGODB_URI.length - 20)
        : "N/A",
    },
    JWT_SECRET: {
      exists: !!process.env.JWT_SECRET,
      length: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
    },
    CLOUDINARY_CLOUD_NAME: {
      exists: !!process.env.CLOUDINARY_CLOUD_NAME,
      length: process.env.CLOUDINARY_CLOUD_NAME
        ? process.env.CLOUDINARY_CLOUD_NAME.length
        : 0,
    },
  };

  res.status(200).json({
    success: true,
    message: "Environment variables check",
    environment: envCheck,
    timestamp: new Date().toISOString(),
  });
}
