const express = require("express");
const router = express.Router();
const { checkEmail, register,handleDocuments,getEventRegistrations } = require("../controllers/registerController");
const upload = require("../middleware/multer");
router.post("/check-email", checkEmail);
router.post("/new", register);
// 🔥 SINGLE DOCUMENT SYNC API
router.post(
  "/handle-documents",
  upload.any(),
  handleDocuments
);
router.get("/:eventId/registrations", getEventRegistrations);
module.exports = router;
