const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const verifyToken = require("../auth/verifyToken");
const fs = require("fs");
const fileSchema = require("../Schema/fileSchema");
const upload = require("../fileUpload/multerFolder");

router.post(
  "/createFile",
  cors(),
  verifyToken,
  upload.single("file"),
  (req, res) => {
    const payload = {
      articleTitle: req.body.name,
      author: req.body.author,
      publicationDate: req.body.publicationDate,
      journalTitle: req.body.journalTitle,
      volume: req.body.volume,
      issue: req.body.issue,
      pages: req.body.pages,
      description: req.body.description,
      file: req.file.path,
      uploaderID: req.body.id,
      uploaderName: req.body.uploaderName,
      downloadCount: 0,
    };
    fileSchema.create(payload, (err, data) => {
      if (err) {
        res.json({
          result: err,
        });
      } else {
        data.save((err, result) => {
          if (err) {
            res.json({
              data: result,
            });
          } else {
            res.json({
              msg: "file submitted",
              researchFileLink: `https://research-gate.herokuapp.com/uploads/researchFile/${req.file.filename}`,
            });
          }
        });
      }
    });
  }
);

module.exports = router;

const mongoose = require("mongoose");
