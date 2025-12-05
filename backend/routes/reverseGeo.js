const express = require("express");
const router = express.Router();
const fetch = require("node-fetch"); // If using Node < 18

router.get("/", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: {
          "User-Agent": "eventManagement/1.0 (bansalantra21@gmail.com)"
        }
      }
    );

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error("Nominatim error:", error);
    return res.status(500).json({ error: "Failed to fetch address" });
  }
});

module.exports = router;
