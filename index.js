const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI || 3000, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((client) => {
    console.log("database connected");
  })
  .catch((err) => console.error("error", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// router
app.use("/regate", require("./auth/login"));

app.use("/", (req, res) => {
  res.json({ message: "api connected" });
});

app.listen(3000, () => {
  console.log("app connecsted");
});
