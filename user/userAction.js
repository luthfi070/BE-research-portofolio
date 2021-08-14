const express = require("express");
const router = express.Router();
const userModel = require("../Schema/userSchema");
const verifyToken = require("../auth/verifyToken");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const upload = require("../fileUpload/multerImage");

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
            res.json({
              dataUser: [
                {
                  fullname: result.fullName,
                  email: result.email,
                  workStatus: result.workStatus,
                },
              ],
              iat: data.iat,
            });
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

module.exports = router;
