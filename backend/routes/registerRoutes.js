const express = require("express");
const router = express.Router();
const { checkEmail, register ,getEventById } = require("../controllers/registerController");

router.post("/check-email", checkEmail);
router.post("/new", register);
router.get("/event/:eventId", getEventById);
module.exports = router;
