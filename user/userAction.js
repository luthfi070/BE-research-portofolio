const express = require("express");
const router = express.Router();
const userModel = require("../Schema/userSchema");
const cors = require("cors");
const jwt = require("jsonwebtoken");

router.get("/viewUser", cors(), (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.json({
      auth: false,
      msg: "no token submitted",
    });
  }

  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err)
      return res.json({
        auth: false,
        msg: "failed to auth",
      });
  });

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

module.exports = router;
