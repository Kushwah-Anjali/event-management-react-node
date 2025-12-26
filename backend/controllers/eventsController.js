const db = require("../config/db");
const path = require("path");
const fs = require("fs");

exports.getAllEvents = async (req, res) => {
  try {
    const [events] = await db.query("SELECT * FROM events");
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
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
      latitude,
      longitude,
    } = req.body;

    // Handle required_docs
    let docsArray = [];
    if (required_docs) {
      if (Array.isArray(required_docs)) docsArray = required_docs;
      else {
        try {
          docsArray = JSON.parse(required_docs);
        } catch {
          docsArray = required_docs
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
    }

    // Handle image
    let imagePath;
    if (req.file) {
      imagePath = req.file.filename;
    } else if (req.body.existingImage) {
      // keep the old image if provided
      imagePath = req.body.existingImage.replace(/^.*\/events\//, "");
    } else {
      imagePath = null;
    }

    // Insert query
    const sql = `
   INSERT INTO events 
(title, category, description, date, author, venue, fees, contact, image, required_documents, users, latitude, longitude)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

    `;

    const [result] = await db.execute(sql, [
      title,
      category,
      description,
      date,
      author,
      venue,
      fees,
      contact,
      imagePath,
      JSON.stringify(docsArray),
      user_id,
      latitude,
      longitude,
    ]);

    // ✅ Build full image URL for frontend
    const imageUrl = imagePath
      ? `${req.protocol}://${req.get("host")}/events/${imagePath}`
      : null;

    // Send response
    res.json({
      status: "success",
      event: {
        id: result.insertId,
        title,
        category,
        description,
        date,
        author,
        venue,
        fees,
        contact,
        required_documents: docsArray,
        image: imageUrl, // ✅ now full URL sent
        users: user_id,
        latitude,
        longitude,
      },
    });
  } catch (err) {
    console.error("Add Event Error:", err);
    res
      .status(500)
      .json({ status: "error", message: "Server error while adding event" });
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
      existingImage,
      latitude,
      longitude,
    } = req.body;

    let imagePath;

    if (req.file) {
      // ✅ New image uploaded
      imagePath = req.file.filename;
    } else if (existingImage) {
      // ✅ Keep old image path (remove any full URL)
      imagePath = existingImage.replace(/^.*\/events\//, "");
    } else {
      // ✅ No image at all
      imagePath = null;
    }

    const sql = `
     UPDATE events 
SET title=?, category=?, description=?, date=?, author=?, venue=?, fees=?, contact=?, image=?, required_documents=?, latitude=?, longitude=?
WHERE id=?
`;

  await db.execute(sql, [
  title,
  category,
  description,
  date,
  author,
  venue,
  fees,
  contact,
  imagePath,
  JSON.stringify(required_docs),
  latitude,     // correct
  longitude,    // correct
  eventId,      // correct
]);


    res.json({ status: "success", message: "Event updated successfully!" });
  } catch (err) {
    console.error("Update Event Error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Step 1️⃣ : Fetch event to get its image name
    const [rows] = await db.execute("SELECT image FROM events WHERE id = ?", [
      eventId,
    ]);
    const event = rows[0];

    if (!event) {
      return res
        .status(404)
        .json({ status: "error", message: "Event not found" });
    }

    // Step 2️⃣ : Delete the event record from DB
    const [result] = await db.execute("DELETE FROM events WHERE id = ?", [
      eventId,
    ]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Event not deleted" });
    }

    // Step 3️⃣ : Delete the image from disk
    if (event.image) {
      const imageFileName = path.basename(event.image); // e.g. 1761662100722.png
      const imagePath = path.join(
        "D:/Gallery-Event-Management/events",
        imageFileName
      ); // ✅ exact folder

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.warn("⚠️ Image not deleted (may not exist):", imagePath);
        } else {
          console.log("🧹 Image deleted successfully:", imagePath);
        }
      });
    }

    // Step 4️⃣ : Respond success
    res.json({
      status: "success",
      message: "Event and associated image deleted successfully!",
    });
  } catch (err) {
    console.error("❌ Delete Event Error:", err);
    res.status(500).json({
      status: "error",
      message: "Server error while deleting event",
    });
  }
};

// Get user events
exports.getUserEvents = async (req, res) => {
  try {
    const userId = req.params.userId;
    const [rows] = await db.execute("SELECT * FROM events WHERE users = ?", [
      userId,
    ]);

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
        ? `${req.protocol}://${req.get("host")}/events/${r.image}`
        : null;

   return { 
  ...r,
  required_documents: docs,
  image: imageUrl,
  latitude: r.latitude,
  longitude: r.longitude,
  venue: r.venue
};

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
exports.getEventWithHistory = async (req, res) => {
  try {
    const { eventId } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        e.*, 
        h.summary, h.highlights, h.attendees_count AS attendees,
        h.guests, h.budget_spent AS budget,
        h.long_summary, h.lessons_learned AS lessons,
        h.media_links, h.created_at
      FROM events e
      LEFT JOIN history h ON e.id = h.event_id
      WHERE e.id = ?
      LIMIT 1
      `,
      [eventId]
    );

    if (!rows.length) {
      return res.status(404).json({ status: "error", message: "Event not found" });
    }

    const row = rows[0];
    const { photos, videos } = parseMediaLinks(row.media_links, req);

    res.json({
  status: "success",
  event: {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    date: row.date,
    author: row.author,
    venue: row.venue,
    image: row.image
      ? `${req.protocol}://${req.get("host")}/events/${row.image}`
      : null,
    fees: row.fees,
    contact: row.contact,

    summary: row.summary,
    highlights: row.highlights,

    // MAP to frontend expected names
    attendees_count: row.attendees ?? 0,   // <- frontend expects this
    guests: row.guests ?? 0,
    budget_spent: row.budget ?? "N/A",     // <- frontend expects this

    long_summary: row.long_summary,
    lessons: row.lessons,

    photos,
    videos,
    created_at: row.created_at,
  },
});

  } catch (err) {
    console.error("❌ getEventWithHistory failed:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
function parseMediaLinks(media_links, req) {
  if (!media_links) return { photos: [], videos: [] };

  try {
    const media = JSON.parse(media_links);

    // If media is an array of objects with type & url
    if (Array.isArray(media)) {
      const photos = media
        .filter((m) => m.type === "photo")
        .map((m) => `${req.protocol}://${req.get("host")}/history/photos/${m.url}`);
      const videos = media
        .filter((m) => m.type === "video")
        .map((m) => `${req.protocol}://${req.get("host")}/history/videos/${m.url}`);
      return { photos, videos };
    }

    // If media is already object with photos & videos arrays
    return {
      photos: (media.photos || []).map(
        (f) => `${req.protocol}://${req.get("host")}/history/photos/${f}`
      ),
      videos: (media.videos || []).map(
        (f) => `${req.protocol}://${req.get("host")}/history/videos/${f}`
      ),
    };
  } catch (err) {
    console.error("⚠️ media_links parsing failed:", err);
    return { photos: [], videos: [] };
  }
}


exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [
      eventId,
    ]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Event not found" });
    }

    const event = rows[0];

    // Construct image URL if available
    const imageUrl = event.image
      ? `${req.protocol}://${req.get("host")}/events/${event.image}`
      : null;

    res.json({
      status: "success",
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        venue: event.venue,
        image: imageUrl,
        fees: event.fees,
        contact: event.contact,
        author: event.author,
        required_documents: event.required_documents
          ? JSON.parse(event.required_documents)
          : [],
      },
    });
  } catch (err) {
    console.error("❌ Error fetching event:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
};