const express = require("express");
const router = express.Router();
const cors = require("cors");
const verifyToken = require("../auth/verifyToken");
const fileSchema = require("../Schema/fileSchema");

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
      } else if (result.status == "waiting") {
        res.json({
          result: `${result.articleTitle} has been published`,
        });
      }
    }
  );
});

router.put("/rejResearch", cors(), verifyToken, (req, res) => {
  const data = {
    status: "rejected",
  };

  return fileSchema.findOneAndUpdate(
    { _id: req.body.id },
    data,
    (err, result) => {
      res.json({
        result: `${result.articleTitle} has been rejected`,
      });
    }
  );
});

router.get("/waitResearch", cors(), verifyToken, (req, res) => {
  return fileSchema.find({ status: "waiting" }, (err, result) => {
    res.json({
      result: result,
    });
  });
});

module.exports = router;
