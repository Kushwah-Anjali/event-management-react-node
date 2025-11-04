const db = require("../config/db");

// ✅ Check if email already registered for event
exports.checkEmail = (req, res) => {
  const { email, event_id } = req.body;

  if (!email || !event_id) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing email or event ID." });
  }

  const query = "SELECT * FROM registrations WHERE email = ? AND event_id = ?";
  db.query(query, [email, event_id], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: err.message });
    }

    if (results.length > 0) {
      res.json({ status: "found", data: results });
    } else {
      res.json({ status: "not_found" });
    }
  });
};

// ✅ Register a new user
exports.register = (req, res) => {
  const { name, email, event_id } = req.body;

  if (!name || !email || !event_id) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing required fields!" });
  }

  const documents = JSON.stringify([]);

  const insertQuery =
    "INSERT INTO registrations (event_id, name, email, documents) VALUES (?, ?, ?, ?)";
  db.query(insertQuery, [event_id, name, email, documents], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "error", message: err.message });
    }

    const insertedId = result.insertId;

    db.query("SELECT * FROM registrations WHERE id = ?", [insertedId], (err2, data) => {
      if (err2) {
        return res
          .status(500)
          .json({ status: "error", message: err2.message });
      }

      const user = data[0];
      res.json({
        status: "success",
        data: {
          name: user.name,
          email: user.email,
          registered_at: user.created_at,
          documents: JSON.parse(user.documents || "[]"),
        },
      });
    });
  });
};
