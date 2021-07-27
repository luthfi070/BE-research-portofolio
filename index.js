const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const cors = require("cors");
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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// router
app.use("/regate", require("./auth/login"));
app.use("/regate/user", require("./user/userAction"));

app.use("/", (req, res) => {
  res.json({ message: "api connected" });
});

app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log("app connected");
});
