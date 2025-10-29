const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ⚙️ Use absolute path to outside folder
const uploadDir = "D:/Gallery-Event-Management/events"; // 👈 replace with your real path

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("✅ Created folder:", uploadDir);
    }
    console.log("📂 Upload path:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;
