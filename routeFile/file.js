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
    return userSchema.findOne(
      { _id: req.body.uploaderID },
      (err, resultUser) => {
        if (err) {
          res.sendStatus(404);
        } else {
          const payload = {
            articleTitle: req.body.name,
            author: req.body.author,
            publicationDate: req.body.publicationDate,
            status: false,
            journalTitle: req.body.journalTitle,
            volume: req.body.volume,
            issue: req.body.issue,
            pages: req.body.pages,
            description: req.body.description,
            fileName: req.file.filename,
            file: req.file.path,
            fileLink: `https://research-gate.herokuapp.com/uploads/researchFile/${req.file.filename}`,
            uploaderID: req.body.uploaderID,
            uploaderName: req.body.uploaderName,
            downloadCount: 0,
            bookmarkedBy: [],
            uploaderInfo: resultUser,
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
      }
    );
  }
);

//Read File
router.post("/research", cors(), (req, res) => {
  let newUser;
  return userSchema.find({}, (err, resultUser) => {
    newUser = resultUser;
    return fileSchema.find({}, (err, result) => {
      let fileData = result;
      for (i = 0; i < result.length; i++) {
        let research = fileData[i];

        if (result[i].bookmarkedBy.length > 0) {
          for (a = 0; a < result[i].bookmarkedBy.length; a++) {
            if (result[i].bookmarkedBy[a] == req.body.id) {
              research["status"] = true;
            } else {
              research["status"] = false;
            }
          }
        } else {
          research["status"] = false;
        }

        for (j = 0; j < newUser.length; j++) {
          if (newUser[j]._id == research["uploaderID"]) {
            research["uploaderInfo"] = newUser[j];
            break;
          } else {
            continue;
          }
        }
      }

      res.json({
        fileData,
      });
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
router.post("/deleteResearch", cors(), verifyToken, (req, res) => {
  return fileSchema.findOneAndRemove({ _id: req.body.id }, (err, result) => {
    if (err) {
      res.sendStatus(400);
    } else {
      return userSchema.findOne(
        { _id: result.uploaderID },
        (err, resultUser) => {
          if (err) {
            res.sendStatus(404);
          } else {
            let decrementResearchs = resultUser.researches - 1;

            let newResearches = {
              researches: decrementResearchs,
            };

            return userSchema.findOneAndUpdate(
              { _id: result.uploaderID },
              newResearches,
              (err, resultDelete) => {
                if (err) {
                  res.sendStatus(404);
                } else {
                  res.sendStatus(200);
                }
              }
            );
          }
        }
      );
    }
  });
});

//Get Research by ID
router.post("/getDetailResearch", cors(), verifyToken, (req, res) => {
  return fileSchema.findOne({ _id: req.body.id }, (err, result) => {
    return userSchema.findOne({ _id: result.uploaderID }, (err, resultUser) => {
      if (err) {
        res.sendStatus(404);
      } else {
        let research = result;

        if (result.bookmarkedBy.length > 0) {
          for (a = 0; a < result.bookmarkedBy.length; a++) {
            if (result.bookmarkedBy[a] == req.body.idUser) {
              research["status"] = true;
            } else {
              research["status"] = false;
            }
          }
        } else {
          research["status"] = false;
        }

        research["uploaderInfo"] = resultUser;

        res.json({
          result: result,
        });
      }
    });
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
          return userSchema.find(
            { _id: result.uploaderID },
            (err, resultUser) => {
              const readerCount = {
                readers: resultUser[0].readers + 1,
              };
              if (err) {
                res.sendStatus(402);
              } else {
                return userSchema.findOneAndUpdate(
                  { _id: result.uploaderID },
                  readerCount,
                  (err, resultUser) => {
                    res.json({
                      msg: "updated",
                      link: `https://research-gate.herokuapp.com/uploads/researchFile/${result.fileName}`,
                    });
                  }
                );
              }
            }
          );
        }
      }
    );
  });
});

// Most Read = -1, A - Z = 1, Z - A = -1, Newest, Oldest
router.post("/filterResearch", cors(), verifyToken, (req, res) => {
  let newUser;
  return userSchema.find({}, (err, resultUser) => {
    if (err) {
      res.sendStatus(404);
    } else {
      newUser = resultUser;
      fileSchema
        .find({})
        .sort(req.body.filter)
        .exec((err, result) => {
          for (i = 0; i < result.length; i++) {
            let research = result[i];

            if (result[i].bookmarkedBy.length > 0) {
              for (a = 0; a < result[i].bookmarkedBy.length; a++) {
                if (result[i].bookmarkedBy[a] == req.body.idUser) {
                  research["status"] = true;
                } else {
                  research["status"] = false;
                }
              }
            } else {
              research["status"] = false;
            }

            for (j = 0; j < newUser.length; j++) {
              if (newUser[j]._id == research["uploaderID"]) {
                research["uploaderInfo"] = newUser[j];
                break;
              } else {
                continue;
              }
            }
          }

          res.json({
            result,
          });
        });
    }
  });
});

module.exports = router;
