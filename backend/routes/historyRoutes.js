// routes/historyRoutes.js

const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const historyController = require("../controllers/historyController");

router.post(
  "/:eventId",
  upload.array("media", 20),  // handles photos + videos
  historyController.addHistory
);
router.get("/:eventId", historyController.getHistory);

module.exports = router;
