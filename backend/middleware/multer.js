const multer = require("multer");
const path = require("path");

// Folder for uploaded event images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/events"); // ye folder exist hona chahiye
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

module.exports = upload;
