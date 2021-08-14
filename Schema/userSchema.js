const mongoose = require("mongoose");

const bookmarksSchema = new mongoose.Schema({ research: String });
const userSchema = new mongoose.Schema({
  id: Number,
  fullName: String,
  email: String,
  password: String,
  workStatus: String,
  researches: Number,
  readers: Number,
  fields: Number,
  bookmarks: [bookmarksSchema],
  photoProfile: String,
});

module.exports = mongoose.model("user", userSchema);
