const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all events
router.get("/", (req, res) => {
  db.query("SELECT * FROM events", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

module.exports = router;
