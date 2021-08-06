const mongoose = require("mongoose");

const dateFormat = Date;
const fileSchema = new mongoose.Schema({
  articleTitle: String,
  author: String,
  publicationDate: dateFormat,
  journalTitle: String,
  volume: Number,
  issue: Number,
  pages: Number,
  description: String,
  fileName: String,
  file: String,
  uploaderID: String,
  uploaderName: String,
  downloadCount: Number,
});

module.exports = mongoose.model("file", fileSchema);
