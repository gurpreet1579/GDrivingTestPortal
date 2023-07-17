const express = require("express");
const router = express.Router();

router.use("/home", require("./home"));
router.use("/g", require("./g"));
router.use("/user-detail", require("./user-detail"));

router.use("/login", require("./login"));

// routes for user related pages user signUp, userCreate
router.use("/user", require("./user"));

router.use("/admin", require("./admin"));
router.use("/examiner", require("./examiner"));

module.exports = router;
