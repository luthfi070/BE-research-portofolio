const express = require("express");
const router = express.Router();
const userModel = require("../Schema/userSchema");
const cors = require("cors");

router.get("/viewUser", cors(), (req, res) => {
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
