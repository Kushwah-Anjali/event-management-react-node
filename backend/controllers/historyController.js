// controllers/historyController.js
const db = require("../config/db");
const API_URL = process.env.SERVER_BASE_URL;

// Helper: Map filenames to frontend-ready URLs
const mapMediaUrls = (mediaArray) => {
  if (!Array.isArray(mediaArray)) return [];
  return mediaArray
    .filter((m) => m?.url)
    .map((m) => ({
      ...m,
      src: `${API_URL}/history/${m.url}`,
    }));
};

// Helper: Parse media JSON from DB safely
const parseMedia = (dbRow) => {
  if (!dbRow) return [];
  try {
    const raw = dbRow.media_links || "[]";
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
};

// ADD / UPDATE history
exports.addHistory = async (req, res) => {
  try {
    const {
      summary,
      highlights,
      attendees_count,
      guests,
      budget_spent,
      long_summary,
      lessons_learned,
    } = req.body;

    const eventId = req.params.eventId;

    // Prepare new uploaded media
    const newMedia = (req.files || []).map((file) => ({
      url: file.filename,
      type: file.mimetype?.startsWith("image") ? "image" : "video",
    }));

    // Check if history exists
    const [rows] = await db.query(
      "SELECT * FROM history WHERE event_id = ? ORDER BY id DESC LIMIT 1",
      [eventId]
    );

    let finalMedia = [];

    if (rows.length > 0) {
      const existing = rows[0];
      const existingMedia = parseMedia(existing);
      finalMedia = [...existingMedia, ...newMedia];
      const mediaLinksJSON = JSON.stringify(finalMedia);

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
        attendees_count || existing.attendees_count,
        guests || existing.guests,
        budget_spent || existing.budget_spent,
        long_summary || existing.long_summary,
        lessons_learned || existing.lessons_learned,
        mediaLinksJSON,
        eventId,
      ]);

      return res.json({
        status: "success",
        action: "updated",
        message: "History updated successfully",
        history: {
          event_id: eventId,
          summary: summary || existing.summary,
          highlights: highlights || existing.highlights,
          attendees_count: attendees_count || existing.attendees_count,
          guests: guests || existing.guests,
          budget_spent: budget_spent || existing.budget_spent,
          long_summary: long_summary || existing.long_summary,
          lessons_learned: lessons_learned || existing.lessons_learned,
          media: mapMediaUrls(finalMedia),
        },
      });
    } else {
      // INSERT
      finalMedia = [...newMedia];
      const mediaLinksJSON = JSON.stringify(finalMedia);

      const insertSql = `
        INSERT INTO history
          (event_id, summary, highlights, attendees_count, guests, budget_spent, long_summary, lessons_learned, media_links)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await db.query(insertSql, [
        eventId,
        summary || null,
        highlights || null,
        attendees_count || null,
        guests || null,
        budget_spent || null,
        long_summary || null,
        lessons_learned || null,
        mediaLinksJSON,
      ]);

      return res.json({
        status: "success",
        action: "inserted",
        message: "History added successfully",
        history: {
          event_id: eventId,
          summary,
          highlights,
          attendees_count,
          guests,
          budget_spent,
          long_summary,
          lessons_learned,
          media: mapMediaUrls(finalMedia), // URLs for frontend
        },
      });
    }
  } catch (error) {
    console.error("🔥 Error in addHistory:", error);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

// GET history
exports.getHistory = async (req, res) => {
  try {
    const sql =
      "SELECT * FROM history WHERE event_id = ? ORDER BY id DESC LIMIT 1";
    const [rows] = await db.query(sql, [req.params.eventId]);

    if (!rows.length) return res.json({ exists: false, history: null });

    const historyRow = rows[0];
    const media = mapMediaUrls(parseMedia(historyRow));
    delete historyRow.media_links;

    return res.json({
      exists: true,
      history: { ...historyRow, media },
    });
  } catch (err) {
    console.error("🔥 getHistory Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
