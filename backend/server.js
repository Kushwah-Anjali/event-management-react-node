const express = require('express');

// Serve static folders
// app.use("/uploads/events", express.static("uploads/events")); 
// app.use("/uploads/profiles", express.static("uploads/profiles"));
// app.use("/uploads/gallery", express.static("uploads/gallery")); 
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');

const eventRoutes = require('./routes/events');
const usersRoutes=require('./routes/users');
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users',usersRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
