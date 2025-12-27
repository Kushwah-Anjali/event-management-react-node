const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer"); // file upload and to store 
const {  getAllEvents, getEventHistory,addEvent, updateEvent, deleteEvent, getUserEvents, getHistory,getEventById } = require("../controllers/eventsController");

// GET events of a specific user   
router.get("/", getAllEvents);
// to take only  history of a single event 
router.get("/history/:eventId", getEventHistory);
router.get("/user/:userId", getUserEvents);

// ADD new event
router.post("/add", upload.single("image"), addEvent); // user_id will come from frontend

// UPDATE event by ID
router.put("/update/:id", upload.single("image"), updateEvent);

// DELETE event by ID
router.delete("/delete/:id", deleteEvent);

// GET all events + history
router.get("/history", getHistory);
router.get("/event/:eventId", getEventById);

module.exports = router;
 