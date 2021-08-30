const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: Number,
  fullName: String,
  email: String,
  password: String,
  affiliation: String,
  role: String,
  workStatus: String,
  researches: Number,
  readers: Number,
  fields: Array,
  bookmarks: Array,
  photoProfile: String,
});

module.exports = mongoose.model("user", userSchema);
