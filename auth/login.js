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
    password: req.body.password,
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
          result: "no match",
        });
      }
    } else {
      res.json({
        result: "no match",
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

  return userModel.findOne({ email: req.body.email }).then((result) => {
    if (result) {
      res.json({
        msg: "Email already Existed",
      });
    } else {
      newUser.save((err, data) => {
        if (err) {
          console.log(error);
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
