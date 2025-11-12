const express = require("express");
const router = express.Router();
const { checkEmail, register ,getEventById,getRequiredDocs,getUserDocuments } = require("../controllers/registerController");
const upload = require("../middleware/multer");
router.post("/check-email", checkEmail);
router.post("/new", register);
router.get("/event/:eventId", getEventById);
router.post("/upload-documents", upload.array("files"), async (req, res) => {
  try {
    const { event_id, email } = req.body;

    // Save filenames to database logic (optional)
    const uploadedFiles = req.files.map(f => f.filename);

    console.log("📁 Files uploaded for event:", event_id, "by:", email);

    res.json({
      status: "success",
      message: "Files uploaded successfully!",
      files: uploadedFiles,
    });
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});
router.get("/required-docs/:event_id",getRequiredDocs);
module.exports = router;
router.get("/getUserDocuments", getUserDocuments);
