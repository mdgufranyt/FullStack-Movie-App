const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    username: String,
    email: { type: String, unique: true },
    password: String
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);