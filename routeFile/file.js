const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const verifyToken = require("../auth/verifyToken");
const fs = require("fs");
const fileSchema = require("../Schema/fileSchema");
const upload = require("../fileUpload/multerFolder");
const userSchema = require("../Schema/userSchema");

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
            return userSchema.find(
              { _id: req.body.uploaderID },
              (err, result) => {
                const researchCount = {
                  researches: result[0].researches + 1,
                };
                if (err) {
                  res.sendStatus(404);
                } else {
                  return userSchema.findOneAndUpdate(
                    { _id: req.body.uploaderID },
                    researchCount,
                    (err, result) => {
                      if (err) {
                        res.json({
                          msg: result,
                        });
                      } else {
                        res.json({
                          msg: "file submited",
                          researchFileLink: `https://research-gate.herokuapp.com/uploads/researchFile/${req.file.filename}`,
                          researchCount: researchCount,
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    });
  }
);

//Read File
router.get("/research", cors(), (req, res) => {
  return fileSchema.find({}, (err, result) => {
    res.json({
      result: result,
    });
  });
});

//Edit File
router.put("/editResearch", cors(), verifyToken, (req, res) => {
  let payload = {
    articleTitle: req.body.name,
    author: req.body.author,
    publicationDate: req.body.publicationDate,
    journalTitle: req.body.journalTitle,
    volume: req.body.volume,
    issue: req.body.issue,
    pages: req.body.pages,
    description: req.body.description,
  };

  return fileSchema.findOneAndUpdate(
    { _id: req.body.id },
    payload,
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.json({
          msg: "success",
          result: result,
        });
      }
    }
  );
});

//Delete Research
router.delete("/deleteResearch", cors(), verifyToken, (req, res) => {
  return fileSchema.findOneAndRemove({ _id: req.body.id }, (err, result) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.json({
        msg: "Deleted",
      });
    }
  });
});

//Get Research by ID
router.get("/getDetailResearch", cors(), verifyToken, (req, res) => {
  return fileSchema.find({ _id: req.body.id }, (err, result) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.json({
        result: result,
      });
    }
  });
});

//Download File
router.put("/download", cors(), verifyToken, (req, res) => {
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
