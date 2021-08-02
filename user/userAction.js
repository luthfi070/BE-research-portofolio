const express = require("express");
const router = express.Router();
const userModel = require("../Schema/userSchema");
const cors = require("cors");
const jwt = require("jsonwebtoken");

router.get("/viewUser", cors(), verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      return userModel.findOne({ _id: req.body.id }).then((result) => {
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
        } else {
          res.json({
            msg: "error not found",
          });
        }
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
    res.sendStatus(403);
  }
}

module.exports = router;
