const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../Schema/userSchema");
const cors = require("cors");
const salt = bcrypt.genSaltSync(10);

router.post("/login", cors(), (req, res) => {
  const userPayload = {
    email: req.body.email,
  };

  return userModel.findOne({ email: req.body.email }).then((result) => {
    if (result) {
      if (bcrypt.compareSync(req.body.password, result.password)) {
        jwt.sign({ userPayload }, "secretkey", (err, token) => {
          res.json({
            result: "Logged In",
            payload: [
              {
                id: result._id,
                fullname: result.fullName,
                email: result.email,
              },
            ],
            token: token,
          });
        });
      } else {
        res.json({
          msg: "wrong password",
        });
      }
    } else {
      res.json({
        msg: "wrong email",
      });
    }
  });
});

router.post("/register", cors(), (req, res) => {
  const newUser = new userModel();
  newUser.id = req.body.userId;
  newUser.fullName = req.body.fullName;
  newUser.email = req.body.email;
  newUser.password = bcrypt.hashSync(req.body.password, salt);
  newUser.role = req.body.role;
  newUser.workStatus = "";
  newUser.researches = 0;
  newUser.readers = 0;
  newUser.fields = 0;
  newUser.bookmarks = [];
  newUser.photoProfile = "";

  return userModel.findOne({ email: req.body.email }).then((result) => {
    if (result) {
      res.json({
        msg: "Email already Existed",
      });
    } else {
      newUser.save((err, data) => {
        if (err) {
          res.json({
            msg: err,
          });
        } else {
          res.json({
            msg: "User Registered",
            payload: [
              {
                id: data._id,
                fullname: data.fullName,
              },
            ],
          });
        }
      });
    }
  });
});

module.exports = router;
