const express = require("express");
const router = express.Router();
const { checkEmail, register } = require("../controllers/registerController");

router.post("/check-email", checkEmail);
router.post("/new", register);
module.exports = router;
