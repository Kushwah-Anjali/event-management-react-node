const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer"); // file upload and to store 
const { addEvent, updateEvent, deleteEvent, getUserEvents, getHistory } = require("../controllers/eventsController");

// GET events of a specific user
router.get("/user/:userId", getUserEvents);

// ADD new event
router.post("/add", upload.single("image"), addEvent); // user_id will come from frontend

// UPDATE event by ID
router.put("/update/:id", upload.single("image"), updateEvent);

// DELETE event by ID
router.delete("/delete/:id", deleteEvent);

// GET all events + history
router.get("/history", getHistory);

module.exports = router;
