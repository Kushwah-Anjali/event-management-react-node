// controllers/authController.js
const db = require("../config/db"); 
const bcrypt = require("bcrypt"); // used to compare password
const jwt = require("jsonwebtoken");// used to create token

// Secret key for JWT (in production, store in .env file)
const JWT_SECRET = "your_super_secret_key";

// POST /login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "error", message: "Email & password are required" });
    }

    // Step 2: Query user from database
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }

    const user = rows[0];

    // Step 3: Compare password with hashed password
    const hash = user.password.replace(/^\$2y\$/, "$2a$");
    const isMatch = await bcrypt.compare(password, hash);

    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }

    // Step 4: Create JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" } // token expires in 1 hour
    );
    
    // Step 5: Return success with token
    return res.json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

module.exports = { login };
