const express = require("express");
const router = express.Router();
const userModel = require("../Schema/userSchema");
const cors = require("cors");
const jwt = require("jsonwebtoken");

router.get("/viewUser", cors(), verifyToken, (req, res, next) => {
  return userModel.findOne({ _id: req.body.id }).then((result) => {
    if (result) {
      res.json({
        data: [result],
      });
    } else {
      res.json({
        msg: "error not found",
      });
    }
  });
});

function verifyToken(req, res, next) {
  let token = req.headers["authorization"];

  if (token) {
    const bearer = token.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.json({
      msg: "no token submitted",
      result: req.headers["Authorization"],
    });
  }
}

module.exports = router;
