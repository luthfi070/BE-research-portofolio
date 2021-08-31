const express = require("express");
const router = express.Router();
const userModel = require("../Schema/userSchema");
const verifyToken = require("../auth/verifyToken");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const upload = require("../fileUpload/multerImage");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
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
                  return fileSchema.find(
                    { _id: { $in: result.bookmarks } },
                    (err, resultBookmark) => {
                      if (resultBookmark) {
                        res.json({
                          dataUser: {
                            photoProfile: result.photoProfile,
                            fullname: result.fullName,
                            role: result.role,
                            affiliation: result.affiliation,
                            fields: result.fields,
                            researches: result.researches,
                            readers: result.readers,
                            fieldsLength: result.fields.length,
                            bookmarksLength: resultBookmark.length,
                          },
                          userResearch: resultFile,
                          iat: data.iat,
                        });
                      }
                    }
                  );
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

router.post("/getUser", cors(), verifyToken, (req, res) => {
  return userModel.findOne({ _id: req.body.id }, (err, result) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.json({
        result,
      });
    }
  });
});

router.put("/editUser", cors(), verifyToken, (req, res) => {
  // fullname, position, affiliation, field, email, password, photo
  let payload = {
    fullName: req.body.fullname,
    role: req.body.role,
    affiliation: req.body.affiliation,
    fields: req.body.field,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt),
  };

  return userModel.findOneAndUpdate(
    { _id: req.body.id },
    payload,
    (err, resultUpdate) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.json({
          resultUpdate,
        });
      }
    }
  );
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

  const bookmark = () => {
    return userModel.findOne({ _id: data.idUser }, (err, resultUser) => {
      resultUser.bookmarks.push(data.idResearch);

      let newBookmark = {
        bookmarks: resultUser.bookmarks,
      };

      return userModel.findOneAndUpdate(
        { _id: data.idUser },
        newBookmark,
        (err, resultBookmark) => {
          if (err) {
            res.sendStatus(404);
          } else {
            return fileSchema.findOne(
              { _id: data.idResearch },
              (err, resultFile) => {
                if (err) {
                  res.sendStatus(404);
                } else {
                  resultFile.bookmarkedBy.push(data.idUser);

                  let newBookmarker = {
                    bookmarkedBy: resultFile.bookmarkedBy,
                  };

                  return fileSchema.findOneAndUpdate(
                    { _id: data.idResearch },
                    newBookmarker,
                    (err, newBookmarker) => {
                      if (err) {
                        res.sendStatus(400);
                      } else {
                        res.json({
                          msg: "Bookmarked",
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    });
  };

  return fileSchema.findOne(
    { _id: data.idResearch },
    (err, resultBookmarked) => {
      if (resultBookmarked.bookmarkedBy.length == 0) {
        bookmark();
      } else {
        for (i = 0; i < resultBookmarked.bookmarkedBy.length; i++) {
          if (resultBookmarked.bookmarkedBy[i] == data.idUser) {
            res.json({
              msg: "Research already Bookmarked",
            });
            break;
          } else if (resultBookmarked.bookmarkedBy.length > i) {
            bookmark();
            break;
          } else {
            continue;
          }
        }
      }
    }
  );
});

///Get Bookmarked Research
router.post("/getAllBookmark", cors(), verifyToken, (req, res) => {
  return userModel.findOne({ _id: req.body.id }, (err, result) => {
    let data = [];
    console.log(result);
    for (i = 0; i < result.bookmarks.length; i++) {
      data.push(result.bookmarks[i]);
    }

    return fileSchema.find({ _id: { $in: data } }, (err, resultFile) => {
      let fileData = resultFile;

      for (i = 0; i < resultFile.length; i++) {
        let research = fileData[i];

        if (result[i].bookmarkedBy == req.body.id) {
          research["status"] = true;
        } else {
          research["status"] = false;
        }
      }

      res.json({
        bookmarked: fileData,
      });
    });
  });
});

///Delete Bookmarks
router.post("/deleteBookmarks", cors(), verifyToken, (req, res) => {
  return userModel.findOne({ _id: req.body.idUser }, (err, resultUser) => {
    if (err) {
      res.sendStatus(404);
    } else {
      for (i = 0; i < resultUser.bookmarks.length; i++) {
        if (resultUser.bookmarks[i] == req.body.idResearch) {
          resultUser.bookmarks.splice(i, 1);

          let newBookmarkUser = {
            bookmarks: resultUser.bookmarks,
          };

          return userModel.findOneAndUpdate(
            { _id: req.body.idUser },
            newBookmarkUser,
            (err, resultUpdate) => {
              if (err) {
                res.sendStatus(404);
              } else {
                return fileSchema.findOne(
                  { _id: req.body.idResearch },
                  (err, resultFile) => {
                    if (err) {
                      res.sendStatus(404);
                    } else {
                      for (a = 0; a < resultFile.bookmarkedBy.length; a++) {
                        if (resultFile.bookmarkedBy[a] == req.body.idUser) {
                          console.log("asd");
                          resultFile.bookmarkedBy.splice(a, 1);

                          let newBookmarkFile = {
                            bookmarkedBy: resultFile.bookmarkedBy,
                          };

                          return fileSchema.findOneAndUpdate(
                            { _id: req.body.idResearch },
                            newBookmarkFile,
                            (err, resultUpdateFile) => {
                              if (err) {
                                res.sendStatus(404);
                              } else {
                                res.json({
                                  msg: "deleted",
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
                );
              }
            }
          );
          break;
        } else {
          continue;
        }
      }
    }
  });
});

module.exports = router;
