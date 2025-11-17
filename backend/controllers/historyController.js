// controllers/historyController.js
const db = require("../config/db");
const path = require("path");

const parseMedia = (rows0) => {
  try {
    if (!rows0) return [];
    const raw = rows0.media_links || "[]";
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
};

exports.addHistory = async (req, res) => {
  try {
    // Fields from form-data (note: frontend sends fields like "attendees", "guests", "budget", etc.)
    const {
      summary,
      highlights,
      attendees,
      guests,
      budget,
      long_summary,
      lessons,
    } = req.body;

    const eventId = req.params.eventId;

    // Prepare new files (if any)
    const newMedia = (req.files || []).map((file) => ({
      url: file.filename,
      type: file.mimetype && file.mimetype.startsWith("image") ? "image" : "video",
    }));

    // Check if history exists for this event
    const [rows] = await db.query("SELECT * FROM history WHERE event_id = ? ORDER BY id DESC LIMIT 1", [eventId]);

    if (rows.length > 0) {
      // Update existing record — merge media arrays (preserve old media)
      const existing = rows[0];
      const existingMedia = parseMedia(existing);

      // Merge: keep existing + new appended
      const mergedMedia = [...existingMedia, ...newMedia];
      const mediaLinksJSON = JSON.stringify(mergedMedia);

      const updateSql = `
        UPDATE history SET
          summary = ?,
          highlights = ?,
          attendees_count = ?,
          guests = ?,
          budget_spent = ?,
          long_summary = ?,
          lessons_learned = ?,
          media_links = ?
        WHERE event_id = ?
      `;

      await db.query(updateSql, [
        summary || existing.summary,
        highlights || existing.highlights,
        attendees || existing.attendees_count,
        guests || existing.guests,
        budget || existing.budget_spent,
        long_summary || existing.long_summary,
        lessons || existing.lessons_learned,
        mediaLinksJSON,
        eventId,
      ]);

      console.log(`🔁 Updated history for event ${eventId}`);
      return res.json({
        status: "success",
        action: "updated",
        message: "History updated successfully",
        history: {
          event_id: eventId,
          summary: summary || existing.summary,
          highlights: highlights || existing.highlights,
          attendees_count: attendees || existing.attendees_count,
          guests: guests || existing.guests,
          budget_spent: budget || existing.budget_spent,
          long_summary: long_summary || existing.long_summary,
          lessons_learned: lessons || existing.lessons_learned,
          media: mergedMedia,
        },
      });
    } else {
      // Insert new record
      const mediaLinksJSON = JSON.stringify(newMedia);

      const insertSql = `
        INSERT INTO history
          (event_id, summary, highlights, attendees_count, guests, budget_spent, long_summary, lessons_learned, media_links)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await db.query(insertSql, [
        eventId,
        summary || null,
        highlights || null,
        attendees || null,
        guests || null,
        budget || null,
        long_summary || null,
        lessons || null,
        mediaLinksJSON,
      ]);

      console.log(`➕ Inserted history for event ${eventId}`);
      return res.json({
        status: "success",
        action: "inserted",
        message: "History added successfully",
        history: {
          event_id: eventId,
          summary,
          highlights,
          attendees_count: attendees,
          guests,
          budget_spent: budget,
          long_summary,
          lessons_learned: lessons,
          media: newMedia,
        },
      });
    }
  } catch (error) {
    console.error("🔥 Error in addHistory:", error);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const sql = "SELECT * FROM history WHERE event_id = ?";
    const rows = await db.query(sql, [req.params.eventId]);

    if (!rows.length) {
      return res.json({ history: null });
    }

    const history = rows[0];
    history.media_links = JSON.parse(history.media_links || "[]");

    return res.json({ history });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
