const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../Schema/userSchema");

const salt = bcrypt.genSaltSync(10);

router.post("/login", (req, res) => {
  const userPayload = {
    username: req.body.username,
    password: req.body.password,
  };
  return userModel
    .findOne({ username: req.body.username }, { password: 1 })
    .then((result) => {
      if (result) {
        if (bcrypt.compareSync(req.body.password, result.password)) {
          jwt.sign({ userPayload }, "secretkey", (err, token) => {
            res.json({
              result: "matched",
              matchResult: bcrypt.compareSync(
                req.body.password,
                result.password
              ),
              token: token,
            });
          });
        } else {
          res.json({
            result: "no match",
            matchResult: bcrypt.compareSync(req.body.password, result.password),
          });
        }
      } else {
        res.json({
          result: "no match",
          matchResult: bcrypt.compareSync(req.body.password, result.password),
        });
      }
    });
});

router.post("/register", (req, res) => {
  const newUser = new userModel();
  newUser.id = req.body.userId;
  newUser.fullName = req.body.fullName;
  newUser.email = req.body.email;
  newUser.username = req.body.username;
  newUser.password = bcrypt.hashSync(req.body.password, salt);
  newUser.workStatus = req.body.workStatus;

  newUser.save((err, data) => {
    if (err) {
      console.log(error);
    } else {
      res.json({
        msg: "DataInsered",
        payload: data,
      });
    }
  });
});

module.exports = router;
