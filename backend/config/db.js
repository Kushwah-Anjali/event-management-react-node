// config/db.js
const mysql = require("mysql2");

// Create a connection and enable promise wrapper
const db = mysql
  .createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "event_management",
  })
  .promise(); // <-- this line is key 🔥

module.exports = db;
