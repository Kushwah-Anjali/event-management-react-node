// ==================== IMPORTS ====================
const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection
const multer = require("multer");
const path = require("path");

// ==================== MULTER SETUP ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/events"); // folder for event images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // timestamped filename
  },
});
const upload = multer({ storage });

// ==================== ROUTES ====================

// 🟢 1️⃣ GET events of a specific user
router.get("/user/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT * FROM events WHERE users = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ status: "error", message: err.message });
    res.json({ status: "success", events: result });
  });
});

// 🟢 2️⃣ ADD a new event
router.post("/add", upload.single("image"), (req, res) => {
  const {
    title,
    category,
    description,
    date,
    author,
    venue,
    fees,
    contact,
    image_url,
    required_docs,
    user_id,
  } = req.body;

  const imageName = image_url || (req.file ? req.file.filename : null);
  const docs = required_docs ? JSON.stringify(required_docs) : "[]";

  const sql = `
    INSERT INTO events 
      (title, category, description, date, author, venue, fees, contact, image, required_documents, users)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, category, description, date, author, venue, fees, contact, imageName, docs, user_id],
    (err, result) => {
      if (err) return res.status(500).json({ status: "error", message: err.message });
      res.json({ status: "success", message: "Event added successfully!", event: { id: result.insertId, ...req.body, image: imageName, required_documents: docs } });
    }
  );
});

// 🟢 3️⃣ UPDATE an event by ID
router.put("/update/:id", upload.single("image"), (req, res) => {
  const eventId = req.params.id;
  const {
    title,
    category,
    description,
    date,
    author,
    venue,
    fees,
    contact,
    image_url,
    required_docs,
  } = req.body;

  const imageName = image_url || (req.file ? req.file.filename : null);
  const docs = required_docs ? JSON.stringify(required_docs) : "[]";

  const sql = `
    UPDATE events 
    SET title=?, category=?, description=?, date=?, author=?, venue=?, fees=?, contact=?, image=?, required_documents=?
    WHERE id=?
  `;

  db.query(
    sql,
    [title, category, description, date, author, venue, fees, contact, imageName, docs, eventId],
    (err) => {
      if (err) return res.status(500).json({ status: "error", message: err.message });
      res.json({ status: "success", message: "Event updated successfully!" });
    }
  );
});

// 🟢 4️⃣ DELETE an event
router.delete("/delete/:id", (req, res) => {
  const eventId = req.params.id;
  const sql = "DELETE FROM events WHERE id = ?";
  db.query(sql, [eventId], (err) => {
    if (err) return res.status(500).json({ status: "error", message: err.message });
    res.json({ status: "success", message: "Event deleted successfully!" });
  });
});

// 🟢 5️⃣ Optional: GET all events + history
router.get("/history", (req, res) => {
  const sql = `
    SELECT 
      e.id, e.title, e.category, e.description, e.date, e.author, e.venue, e.image, e.fees, e.contact,
      h.summary, h.highlights, h.attendees_count AS attendees, 
      h.guests, h.budget_spent AS budget, h.long_summary, 
      h.lessons_learned AS lessons, h.media_links, h.created_at
    FROM events e
    LEFT JOIN history h ON e.id = h.event_id
    ORDER BY e.date DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ status: "error", message: err.message });
    res.json({ status: "success", events: result });
  });
});

// ==================== EXPORT ROUTER ====================
module.exports = router;
