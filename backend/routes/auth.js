// routes/auth.js

// 1️⃣ We bring in 'express' — it’s a Node.js library that helps us create a web server easily.
const express = require("express");

// 2️⃣ We create a "router" object — think of it like a small bus that handles only 'auth' (login/signup) routes.
const router = express.Router();

// 3️⃣ We import the 'login' function from our controller file.
//    This function has the real logic for what to do when a user logs in.
const { login } = require("../controllers/authController");

// 4️⃣ We tell the router: "When someone sends a POST request to '/login', run the login function."
//    POST means the user is sending data (like email & password) to the server.
router.post("/login", login);

// 5️⃣ Finally, we export this router so it can be used in the main server file (like app.js or index.js).
//    Without this line, other files won’t know this route exists.
module.exports = router;
