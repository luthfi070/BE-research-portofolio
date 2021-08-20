const express = require("express");
const router = express.Router();
const userModel = require("../Schema/userSchema");
const verifyToken = require("../auth/verifyToken");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const upload = require("../fileUpload/multerImage");
const fileSchema = require("../Schema/fileSchema");

/// Read User
router.post("/viewUser", cors(), verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      return userModel
        .findOne({ _id: req.body.id })
        .then((result, err) => {
          if (result) {
            return fileSchema.find(
              { uploaderID: req.body.id },
              (err, resultFile) => {
                if (resultFile) {
                  res.json({
                    dataUser: {
                      photoProfile: result.photoProfile,
                      fullname: result.fullName,
                      workStatus: result.workStatus,
                      fields: result.fields,
                      researches: result.researches,
                      readers: result.readers,
                      fieldsLength: result.fields.length,
                      bookmarksLength: result.bookmarks.length,
                    },
                    userResearch: resultFile,
                    iat: data.iat,
                  });
                }
              }
            );
          } else if (err) {
            res.json({
              msg: "User not found",
            });
          }
        })
        .catch((err) => {
          res.sendStatus(404);
        });
    }
  });
});

///Upload Foto
router.put(
  "/uploadProfile",
  cors(),
  verifyToken,
  upload.single("photoProfile"),
  (req, res) => {
    let payload = {
      photoProfile: `https://research-gate.herokuapp.com/uploads/photoProfile/${req.file.filename}`,
    };
    return userModel.findOneAndUpdate(
      { _id: req.body.id },
      payload,
      (err, result) => {
        if (err) {
          res.sendStatus(402);
        } else {
          res.json({
            msg: "image uploaded",
            linkImage: `https://research-gate.herokuapp.com/uploads/photoProfile/${req.file.filename}`,
          });
        }
      }
    );
  }
);

///Get User Research
router.post("/getUserResearch", cors(), verifyToken, (req, res) => {
  return fileSchema.find({ uploaderID: req.body.id }, (err, result) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.json({
        msg: result,
      });
    }
  });
});

router.post("/bookmarkResearch", cors(), verifyToken, (req, res) => {
  const data = {
    idUser: req.body.idUser,
    idResearch: req.body.idResearch,
  };

  return userModel.find({ _id: data.idUser }, (err, result) => {
    if (err) {
      res.sendStatus(404);
    } else {
      return fileSchema.find({ _id: data.idResearch }, (err, resultFile) => {
        if (err) {
          res.sendStatus(404);
        } else {
          if (result[0].bookmarks.length == 0) {
            result[0].bookmarks.push(resultFile[0]);

            const dataBookmarks = {
              bookmarks: result[0].bookmarks,
            };

            return userModel.findOneAndUpdate(
              { _id: data.idUser },
              dataBookmarks,
              (err, result) => {
                if (err) {
                  res.sendStatus(404);
                } else {
                  res.json({
                    msg: "bookmarked",
                    result,
                  });
                }
              }
            );
          } else {
            for (i = 0; i < result[0].bookmarks.length; i++) {
              if (result[0].bookmarks[i]._id == req.body.idResearch) {
                res.json({
                  msg: "Research already bookmarked",
                  result: result[0].bookmarks[i],
                });
                break;
              } else if (result[0].bookmarks.length > i) {
                result[0].bookmarks.push(resultFile[0]);
                const dataBookmarks = {
                  bookmarks: result[0].bookmarks,
                };
                return userModel.findOneAndUpdate(
                  { _id: data.idUser },
                  dataBookmarks,
                  (err, result) => {
                    if (err) {
                      res.sendStatus(404);
                    } else {
                      res.json({
                        msg: "bookmarked",
                      });
                    }
                  }
                );
                break;
              } else {
                continue;
              }
            }
          }
        }
      });
    }
  });
});

///Get Bookmarked Research
router.post("/getAllBookmark", cors(), verifyToken, (req, res) => {
  return userModel.find({ _id: req.body.id }, (err, result) => {
    res.json({
      bookmarkList: result[0].bookmarks,
    });
  });
});

///Delete Bookmarks
router.post("/deleteBookmarks", cors(), verifyToken, (req, res) => {
  return userModel.find({ _id: req.body.idUser }, (err, resultUser) => {
    if (err) {
      res.sendStatus(404);
    } else {
      for (i = 0; i < resultUser[0].bookmarks.length; i++) {
        if (resultUser[0].bookmarks[i]._id == req.body.idResearch) {
          let bookmark = {
            bookmarks: resultUser[0].bookmarks[i],
          };
          return userModel.findOneAndUpdate(
            { _id: req.body.idUser },
            bookmark,
            (err, resultUpdate) => {
              if (err) {
                res.sendStatus(404);
              } else {
                res.sendStatus(200);
              }
            }
          );
          break;
        } else if (i == resultUser[0].bookmarks.length) {
          res.sendStatus(404);
          break;
        } else {
          continue;
        }
      }
    }
  });
});

module.exports = router;
