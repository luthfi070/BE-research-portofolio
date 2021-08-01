const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: Number,
  fullName: String,
  email: String,
  password: String,
  workStatus: String,
});

module.exports = mongoose.model("user", userSchema);
