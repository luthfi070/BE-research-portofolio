const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  articleTitle: String,
  author: String,
  publicationDate: Date,
  journalTitle: String,
  volume: Number,
  issue: Number,
  pages: Number,
  description: String,
  file: String,
  uploaderID: String,
  uploaderName: String,
});

module.exports = mongoose.model("file", fileSchema);
