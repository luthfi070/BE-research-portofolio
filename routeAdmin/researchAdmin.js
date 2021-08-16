const express = require("express");
const router = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const verifyToken = require("../auth/verifyToken");
const fs = require("fs");
const fileSchema = require("../Schema/fileSchema");
const upload = require("../fileUpload/multerFolder");
const userSchema = require("../Schema/userSchema");

router.put("/accResearch", cors(), verifyToken, (req, res) => {
  const data = {
    status: "accepted",
  };

  return fileSchema.findOneAndUpdate(
    { _id: req.body.id },
    data,
    (err, result) => {
      res.json({
        msg: result,
      });
    }
  );
});

module.exports = router;
