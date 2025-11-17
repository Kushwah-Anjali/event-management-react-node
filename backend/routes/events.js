const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { getEventWithHistory }  = require("../controllers/eventsController");
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM events");
    res.json(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});
router.get("/history/:eventId",getEventWithHistory);

module.exports = router;
