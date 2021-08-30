const mongoose = require("mongoose");

const dateFormat = Date;
const fileSchema = new mongoose.Schema({
  articleTitle: String,
  author: String,
  publicationDate: dateFormat,
  status: String,
  journalTitle: String,
  volume: Number,
  issue: Number,
  pages: Number,
  description: String,
  fileName: String,
  file: String,
  fileLink: String,
  uploaderID: String,
  uploaderName: String,
  uploaderInfo: Object,
  downloadCount: Number,
  bookmarkedBy: Array,
});

module.exports = mongoose.model("file", fileSchema);
