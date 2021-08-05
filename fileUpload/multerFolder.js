const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "researchFile/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    if (file.mimetype == "application/pdf") {
      callback(null, true);
    } else {
      console.log(file.mimetype);
      callback(null, false);
    }
  },
});

module.exports = upload;
