const express = require("express");
const router = express.Router();
const gController = require("../controller/gController");
const driverAuthMiddleware = require("../middleware/driverAuthMiddleware");

// driverAuthMiddleware is used to protect g2 routes, accessible only to logged user with userType Driver
router.get("/", driverAuthMiddleware, gController.g);
// router.post("/updateGDriver/", driverAuthMiddleware, gController.updateGDriver);

module.exports = router;
