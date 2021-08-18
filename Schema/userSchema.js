const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: Number,
  fullName: String,
  email: String,
  password: String,
  role: String,
  workStatus: String,
  researches: Number,
  readers: Number,
  fields: [Array],
  bookmarks: [Object],
  photoProfile: String,
});

module.exports = mongoose.model("user", userSchema);
