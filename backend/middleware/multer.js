// multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const baseDir = "D:/Gallery-Event-Management";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "events"; // default

    if (req.baseUrl.includes("register")) {
      folder = "documents";
    }

    if (req.baseUrl.includes("history")) {
      folder = "history";
    }

    const uploadPath = path.join(baseDir, folder);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log("📁 Created folder:", uploadPath);
    }

    console.log("➡ Upload path:", uploadPath);
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
