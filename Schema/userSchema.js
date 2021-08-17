const mongoose = require("mongoose");

const bookmarksSchema = new mongoose.Schema({
  Object,
});
const fieldSchema = new mongoose.Schema({ research: String });
const userSchema = new mongoose.Schema({
  id: Number,
  fullName: String,
  email: String,
  password: String,
  role: String,
  workStatus: String,
  researches: Number,
  readers: Number,
  fields: [fieldSchema],
  bookmarks: [Object],
  photoProfile: String,
});

module.exports = mongoose.model("user", userSchema);
