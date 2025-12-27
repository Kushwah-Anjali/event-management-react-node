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

exports.handleDocuments = async (req, res) => {
  try {
    const { email, event_id } = req.body;

    if (!email || !event_id) {
      return res.status(400).json({
        success: false,
        message: "email and event_id required",
      });
    }

    // 1️⃣ Get existing docs
    const [rows] = await db.query(
      "SELECT documents FROM registrations WHERE email = ? AND event_id = ?",
      [email, event_id]
    );

    let oldDocs = rows.length
      ? JSON.parse(rows[0].documents || "{}")
      : {};

    // 2️⃣ If files exist → upload
    let newDocs = {};
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        newDocs[file.fieldname] = file.filename;
      });
    }

    // 3️⃣ Merge
    const finalDocs = { ...oldDocs, ...newDocs };

    // 4️⃣ Save only if new docs uploaded
    if (Object.keys(newDocs).length > 0) {
      if (rows.length) {
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
    }

    // 5️⃣ Always return status
    res.json({
      success: true,
      uploadedDocs: finalDocs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
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
