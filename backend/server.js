const express = require("express"); // Import the Express library (a toolkit for building web servers in Node.js)
const app = express(); // Create a new Express app (our website/server)
// Import the CORS library to allow cross-origin requests (requests from other websites)
const cors = require("cors");
// Load environment variables from the .env file so we can use secret info safely
require("dotenv").config();
// Serve static folders
const path = require("path");

app.use(
  "/events",
  express.static("D:/Gallery-Event-Management/events") // full absolute path
);
app.use(
  "/documents",
  express.static("D:/Gallery-Event-Management/documents")
);

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const usersRoutes = require("./routes/users");
const userEventRoutes = require("./routes/userevents");
const contactRoutes = require("./routes/contact");
const registerRoutes = require("./routes/registerRoutes");
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
app.use("/api/register", registerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
