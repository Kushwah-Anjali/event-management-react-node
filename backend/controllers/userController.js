// backend/controllers/userController.js
const pool = require("../config/db");

const bcrypt = require("bcrypt");

const ROOT_EMAIL = "anjalikushwah3333@gmail.com";

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role, created_at FROM users"
    );
    if (rows.length === 0) {
      return res.json({ status: "error", message: "No users found." });
    }
    // remove root user(s)
    const filtered = rows.filter(
      (u) => !(u.role === "root" || u.email === ROOT_EMAIL)
    );
    res.json({
      status: "success",
      message: "Users fetched successfully!",
      result: filtered,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Database error." });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.json({ status: "error", message: "All fields are required!" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashed, role || "admin"]
    );
    res.json({
      status: "success",
      message: "User added successfully!",
      id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "error", message: "Database error: " + err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id, name, email, password } = req.body;
    if (!id || !name || !email) {
      return res.json({
        status: "error",
        message: "Name and Email are required!",
      });
    }

    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);
      await pool.query(
        "UPDATE users SET name=?, email=?, password=? WHERE id=? AND role!='root'",
        [name, email, hashed, id]
      );
      res.json({
        status: "success",
        message: "User updated successfully (Password changed).",
      });
    } else {
      await pool.query(
        "UPDATE users SET name=?, email=? WHERE id=? AND role!='root'",
        [name, email, id]
      );
      res.json({
        status: "success",
        message: "User updated successfully (Password unchanged).",
      });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "error", message: "Database error: " + err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.json({ status: "error", message: "Missing id" });
    await pool.query("DELETE FROM users WHERE id=? AND role!='root'", [id]);
    res.json({ status: "success", message: "User deleted successfully!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "error", message: "Database error: " + err.message });
  }
};

// Optional simulated session user endpoint
exports.getCurrentUser = async (req, res) => {
  // Simple example: in a real app use JWT/sessions
  // We're returning error if not set; this preserves your old function's behavior
  if (req.headers["x-sim-user-id"]) {
    // you could fetch from DB; for now return basic mock
    return res.json({
      status: "success",
      id: req.headers["x-sim-user-id"],
      name: req.headers["x-sim-user-name"],
      email: req.headers["x-sim-user-email"],
    });
  }
  res.json({ status: "error", message: "Not logged in" });
};
