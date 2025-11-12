// multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Base directory for all uploads
const baseDir = "D:/Gallery-Event-Management";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "events"; // default folder

    // 🧩 Detect route type to decide destination
    if (req.baseUrl.includes("register")) {
      folder = "documents";
    }

    const uploadPath = path.join(baseDir, folder);

    // Create folder if it doesn’t exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      console.log("✅ Created folder:", uploadPath);
    }

    console.log(`📂 Upload path selected: ${uploadPath}`);
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
