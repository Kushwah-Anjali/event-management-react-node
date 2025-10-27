const db = require("../config/db");

// Add Event
const buildFileUrl = (req, filePath) => {
  if (!filePath) return null;
  return `${req.protocol}://${req.get("host")}/${filePath}`; // e.g. http://localhost:5000/uploads/events/123.png
};

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


      let docsArray = [];
    if (required_docs) {
      if (Array.isArray(required_docs)) docsArray = required_docs;
      else {
        // could be JSON string or comma-separated string
        try { docsArray = JSON.parse(required_docs); }
        catch { docsArray = required_docs.split(",").map(s => s.trim()).filter(Boolean); }
      }
    }

    const imagePath = req.file ? `uploads/events/${req.file.filename}` : (req.body.image_url || null);

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
      imagePath, // store full path
         JSON.stringify(docsArray), user_id,
    ]);

    res.json({
      status: "success",
      event: {
        id: result.insertId,
        ...req.body,
        image,},
    });
  } catch (err) {
    console.error("Add Event Error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, category, description, date, author, venue, fees, contact, required_docs } = req.body;

    const image = req.file ? `uploads/events/${req.file.filename}` : (req.body.image_url || null);

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
    const [rows] = await db.execute("SELECT * FROM events WHERE users = ?", [userId]);

    const normalized = rows.map((r) => {
      let docs = [];

      if (r.required_documents) {
        if (Array.isArray(r.required_documents)) {
          // already an array
          docs = r.required_documents;
        } else if (typeof r.required_documents === "string") {
          try {
            // try JSON parsing first
            const parsed = JSON.parse(r.required_documents);
            docs = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            // fallback: comma-separated string
            docs = r.required_documents
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          }
        }
      }

      const imageUrl = r.image
        ? `${req.protocol}://${req.get("host")}/${r.image}`
        : null;

      return { ...r, required_documents: docs, image: imageUrl };
    });

    res.json({ status: "success", events: normalized });
  } catch (err) {
    console.error("GetUserEvents Error:", err);
    res
      .status(500)
      .json({ status: "error", message: "Server error while fetching events" });
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
