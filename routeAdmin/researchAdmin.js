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
      if (result.status == "accepted") {
        res.json({
          result: `${result.articleTitle} has already been published`,
        });
      } else if (result.status == "rejected") {
        res.json({
          result: `${result.articleTitle} has already been rejected`,
        });
      } else if (result.status == "accepted") {
        res.json({
          result: `${result.articleTitle} has been published`,
        });
      }
    }
  );
});

module.exports = router;
