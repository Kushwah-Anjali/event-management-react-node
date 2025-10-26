const db = require("../config/db");

// Add Event
exports.addEvent = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      date,
      author,
      venue,
      fees,
      contact,
      required_docs,
      user_id,
    } = req.body;

    // store full image path
    const image = req.file
      ? `uploads/events/${req.file.filename}`
      : req.body.image_url || null;
    const sql = `INSERT INTO events 
      (title, category, description, date, author, venue, fees, contact, image, required_documents, users) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.execute(sql, [
      title,
      category,
      description,
      date,
      author,
      venue,
      fees,
      contact,
      image, // store full path
      JSON.stringify(required_docs),
      user_id,
    ]);

    res.json({
      status: "success",
      event: {
        id: result.insertId,
        ...req.body,
        image,
      },
    });
  } catch (err) {
    console.error("Add Event Error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
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
      required_docs,
    } = req.body;

    const image = req.file
      ? `uploads/events/${req.file.filename}`
      : req.body.image_url || null;

    const sql = `UPDATE events 
      SET title=?, category=?, description=?, date=?, author=?, venue=?, fees=?, contact=?, image=?, required_documents=? 
      WHERE id=?`;

    await db.execute(sql, [
      title,
      category,
      description,
      date,
      author,
      venue,
      fees,
      contact,
      image,
      JSON.stringify(required_docs),
      eventId,
    ]);

    res.json({ status: "success", message: "Event updated successfully!" });
  } catch (err) {
    console.error("Update Event Error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const [result] = await db.execute("DELETE FROM events WHERE id = ?", [
      eventId,
    ]);

    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ status: "error", message: "Event not found" });

    res.json({ status: "success", message: "Event deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// Get user events
exports.getUserEvents = async (req, res) => {
  try {
    const userId = req.params.userId;
    const [rows] = await db.execute("SELECT * FROM events WHERE users = ?", [
      userId,
    ]);
    res.json({ status: "success", events: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// Get all events + history
exports.getHistory = async (req, res) => {
  try {
    const sql = `
      SELECT 
        e.id, e.title, e.category, e.description, e.date, e.author, e.venue, e.image, e.fees, e.contact,
        h.summary AS history_summary, h.highlights AS history_highlights, 
        h.attendees_count AS attendees, h.guests, h.budget_spent AS budget, 
        h.long_summary, h.lessons_learned AS lessons, h.media_links, h.created_at
      FROM events e
      LEFT JOIN history h ON e.id = h.event_id
      ORDER BY e.date DESC
    `;
    const [rows] = await db.execute(sql);
    res.json({ status: "success", events: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
