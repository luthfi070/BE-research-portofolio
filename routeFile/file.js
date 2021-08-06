const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const verifyToken = require("../auth/verifyToken");
const fs = require("fs");
const fileSchema = require("../Schema/fileSchema");
const upload = require("../fileUpload/multerFolder");

/// Create File
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
      fileName: req.file.filename,
      file: req.file.path,
      fileLink: `https://research-gate.herokuapp.com/uploads/researchFile/${req.file.filename}`,
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

//Read File
router.get("/research", cors(), verifyToken, (req, res) => {
  return fileSchema.find({}, (err, result) => {
    res.json({
      data: {
        id: result._id,
        uploaderName: result.uploaderName,
        uploaderID: resuklt.uploaderID,
        articleTitle: result.articleTitle,
        publicationDate: result.publicationDate,
        readsCount: result.downloadCount,
        fileName: result.fileName,
        fileLink: result.fileLink,
      },
    });
  });
});

//Download File
router.put("/download", cors(), verifyToken, (req, res) => {
  // return fileSchema.findOneAndUpdate({ _id: req.body.id }, (err, result) => {

  // })
  return fileSchema.find({ _id: req.body.id }, (err, result) => {
    let payload = {
      downloadCount: result[0].downloadCount + 1,
    };
    return fileSchema.findOneAndUpdate(
      { _id: req.body.id },
      payload,
      (err, result) => {
        if (err) {
          res.sendStatus(404);
        } else {
          res.json({
            msg: "updated",
            link: `https://research-gate.herokuapp.com/uploads/researchFile/${result.fileName}`,
          });
        }
      }
    );
  });
});

module.exports = router;
