const express = require("express");
const router = express.Router();
const { checkEmail, register ,getEventById,getRequiredDocs,getUserDocuments,uploadDocuments,getEventRegistrations } = require("../controllers/registerController");
const upload = require("../middleware/multer");
router.post("/check-email", checkEmail);
router.post("/new", register);
router.get("/event/:eventId", getEventById);
router.post("/upload-documents", upload.any(), uploadDocuments);
router.get("/getUserDocuments", getUserDocuments);
router.get("/required-docs/:event_id",getRequiredDocs);
router.get("/:eventId/registrations", getEventRegistrations);

module.exports = router;
