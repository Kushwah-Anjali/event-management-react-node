const db = require("../config/db");

// ✅ Check if email already registered for event

exports.checkEmail = async (req, res) => {
  try {
    const { email, event_id } = req.body;

    if (!email || !event_id)
      return res.status(400).json({ status: "error", message: "Missing email or event ID." });

    const [rows] = await db.query(
      "SELECT * FROM registrations WHERE email = ? AND event_id = ?",
      [email, event_id]
    );

    if (rows.length > 0)
      return res.json({
        status: "found",
        message: "User already registered for this event.",
        data: rows,
      });

    return res.json({
      status: "not_found",
      message: "User not registered for this event.",
      data: [],
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// ✅ Register a new user
// ✅ Register a new user (with try-catch)
exports.register = async (req, res) => {
  try {
    const { name, email, event_id } = req.body;

    // ✅ Validate input
    if (!name || !email || !event_id) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields!",
      });
    }

    const documents = JSON.stringify([]);

    // ✅ Insert new registration
    const [result] = await db.query(
      "INSERT INTO registrations (event_id, name, email, documents) VALUES (?, ?, ?, ?)",
      [event_id, name, email, documents]
    );

    // ✅ Fetch newly inserted user
    const [data] = await db.query(
      "SELECT * FROM registrations WHERE id = ?",
      [result.insertId]
    );

    const user = data[0];
    res.json({
      status: "success",
      data: {
        name: user.name,
        email: user.email,
        event_id: user.event_id,
        registered_at: user.created_at,
        documents: JSON.parse(user.documents || "[]"),
      },
    });

  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
// ✅ Get details of a single event
exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Query event from the database
    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [eventId]);

    if (rows.length === 0) {
      return res.status(404).json({ status: "error", message: "Event not found" });
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
        fees:event.fees,
        contact:event.contact,
               author:event.author,
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
// ✅ Upload documents for an event registration

// ✅ Get uploaded documents for a user & event


exports.getUserDocuments = async (req, res) => {
  try {
    const { email, event_id } = req.query;
    const [rows] = await db.query(
      "SELECT documents FROM registrations WHERE email = ? AND event_id = ?",
      [email, event_id]
    );
    if (rows.length === 0)
      return res.status(404).json({ status: "error", message: "No registration found" });

    res.json({
      status: "success",
      uploadedDocs: JSON.parse(rows[0].documents || "[]"),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.uploadDocuments = async (req, res) => {
  try {
    const { event_id, email } = req.body;


    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: "error", message: "No files uploaded!" });
    }

    // ✅ Get filenames
    const uploadedFiles = req.files.map((file) => file.filename);

    // ✅ Optional: Update database (save uploaded file names to the user's registration)
    await db.query(
      "UPDATE registrations SET documents = ? WHERE email = ? AND event_id = ?",
      [JSON.stringify(uploadedFiles), email, event_id]
    );

    res.json({
      status: "success",
      message: "Documents uploaded successfully!",
      files: uploadedFiles,
    });
  } catch (err) {
    console.error("❌ Document Upload Error:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
};
exports.getRequiredDocs = async (req, res) => {
  try {
    const { event_id } = req.params;
    console.log(event_id);
    const [rows] = await db.query(
      "SELECT required_documents FROM events WHERE id = ?",
      [event_id]
    );

    if (rows.length === 0)
      return res.status(404).json({ status: "error", message: "Event not found" });

    console.log("🧾 Raw DB value:", rows[0].required_documents);

    const docs =
      typeof rows[0].required_documents === "string"
        ? JSON.parse(rows[0].required_documents)
        : rows[0].required_documents || [];

    res.json({ status: "success", required_docs: docs });
  } catch (err) {
    console.error("❌ Error in getRequiredDocs:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
};
