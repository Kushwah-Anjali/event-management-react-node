const express = require("express");
const { checkEmail, register } = require("../controllers/registerController");

const router = express.Router();

router.post("/check-email", checkEmail);
router.post("/new", register);

module.exports = router;
