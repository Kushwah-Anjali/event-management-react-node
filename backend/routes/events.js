const express = require('express');
const router = express.Router();

// temporary GET API
router.get('/', (req, res) => {
  res.json([{ id: 1, title: "Test Event", date: "2025-10-01" }]);
});

module.exports = router;
