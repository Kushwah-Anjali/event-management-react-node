const express = require("express"); // Import the Express library (a toolkit for building web servers in Node.js)
const app = express(); // Create a new Express app (our website/server)
// Import the CORS library to allow cross-origin requests (requests from other websites)
const cors = require("cors");
// Load environment variables from the .env file so we can use secret info safely
require("dotenv").config();
// Serve static folders
app.use("/uploads/events", express.static("uploads/events"));

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/gallery", express.static("uploads/gallery"));

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const usersRoutes = require("./routes/users");
const userEventRoutes = require("./routes/userevents"); 
const contactRoutes = require("./routes/contact");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/userevents", userEventRoutes);
app.use("/api/contact", contactRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
