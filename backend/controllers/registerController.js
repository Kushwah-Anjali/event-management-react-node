const db = require("../config/db");

// ✅ Check if email already registered for event

exports.checkEmail = async (req, res) => {
  try {
    const { email, event_id } = req.body;

    if (!email || !event_id)
      return res
        .status(400)
        .json({ status: "error", message: "Missing email or event ID." });

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

    const documents = JSON.stringify({});

    const [result] = await db.query(
      "INSERT INTO registrations (event_id, name, email, documents) VALUES (?, ?, ?, ?)",
      [event_id, name, email, documents]
    );

    const [data] = await db.query("SELECT * FROM registrations WHERE id = ?", [
      result.insertId,
    ]);

    const user = data[0];
    res.json({
      status: "success",
      data: user,
    });
  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getUserDocuments = async (req, res) => {
  try {
    const { email, event_id } = req.query;
    const [rows] = await db.query(
      "SELECT documents FROM registrations WHERE email = ? AND event_id = ?",
      [email, event_id]
    );
    if (rows.length === 0)
      return res
        .status(404)
        .json({ status: "error", message: "No registration found" });

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

    if (!event_id || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing event_id or email",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No documents uploaded",
      });
    }

    const uploadedDocs = {};

    // 🔥 Store EXACT fieldname as key
    req.files.forEach((file) => {
      uploadedDocs[file.fieldname] = file.filename;
    });

    // 🔥 Load old documents
    const [existing] = await db.query(
      "SELECT documents FROM registrations WHERE email = ? AND event_id = ?",
      [email, event_id]
    );   

    let finalDocs = uploadedDocs;

    if (existing.length > 0) {
      const oldDocs = existing[0].documents
        ? JSON.parse(existing[0].documents)
        : {};

      // 🔥 Merge by exact same keys
      finalDocs = { ...oldDocs, ...uploadedDocs };

      await db.query(
        "UPDATE registrations SET documents = ? WHERE email = ? AND event_id = ?",
        [JSON.stringify(finalDocs), email, event_id]
      );
    } else {
      await db.query(
        "INSERT INTO registrations (email, event_id, documents) VALUES (?, ?, ?)",
        [email, event_id, JSON.stringify(finalDocs)]
      );
    }

    return res.status(200).json({
      success: true,
      message: "Documents uploaded successfully",
      data: finalDocs,
    });
  } catch (err) {
    console.error("❌ Document Upload Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const [rows] = await db.query(
      `SELECT id, name, email, registered_at, documents 
       FROM registrations 
       WHERE event_id = ?`,
      [eventId]
    );

    res.json({
      status: "success",
      users: rows, // <--- FIXED
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};
