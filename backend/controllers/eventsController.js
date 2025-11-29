const db = require("../config/db");
const path = require("path");
const fs = require("fs");

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

    const sql = `
      SELECT 
        e.id, e.title, e.category, e.description, e.date, e.author,
        e.venue, e.image, e.fees, e.contact,
        h.summary,
        h.highlights,
        h.attendees_count AS attendees,
        h.guests,
        h.budget_spent AS budget,
        h.long_summary AS long_summary,
        h.lessons_learned AS lessons,
        h.media_links,
        h.created_at
      FROM events e
      LEFT JOIN history h ON e.id = h.event_id
      WHERE e.id = ?
      LIMIT 1
    `;

    const [rows] = await db.query(sql, [eventId]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    const event = rows[0];

    // Convert event image path → URL
    const imageUrl = event.image
      ? `${req.protocol}://${req.get("host")}/events/${event.image}`
      : null;

    // Parse media_links JSON
    let photos = [];
    let videos = [];

    if (event.media_links) {
      try {
        const media = JSON.parse(event.media_links);

        photos = (media.photos || []).map(
          (file) =>
            `${req.protocol}://${req.get("host")}/history/photos/${file}`
        );

        videos = (media.videos || []).map(
          (file) =>
            `${req.protocol}://${req.get("host")}/history/videos/${file}`
        );
      } catch (err) {
        console.error("⚠️ media_links parsing failed", err);
      }
    }

    res.json({
      status: "success",
      event: {
        id: event.id,
        title: event.title,
        category: event.category,
        description: event.description,
        date: event.date,
        author: event.author,
        venue: event.venue,
        image: imageUrl,
        fees: event.fees,
        contact: event.contact,

        // History fields
        summary: event.summary,
        highlights: event.highlights,
        attendees: event.attendees,
        guests: event.guests,
        budget: event.budget,
        long_summary: event.long_summary,
        lessons: event.lessons,

        photos,
        videos,
        created_at: event.created_at,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching event + history:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
