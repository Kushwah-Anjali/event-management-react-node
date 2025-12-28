const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer"); // file upload and to store 
const {  getAllEvents, getEventHistory, deleteEvent,saveEvent, getUserEvents, getHistory,getEventById } = require("../controllers/eventsController");

// GET events of a specific user   
router.get("/", getAllEvents);
// to take only  history of a single event 
router.get("/history/:eventId", getEventHistory);
router.get("/user/:userId", getUserEvents);
router.post("/save-event", upload.single("image"), saveEvent);


router.delete("/delete/:id", deleteEvent);


// GET all events + history
router.get("/history", getHistory);
router.get("/event/:eventId", getEventById);

module.exports = router;
 