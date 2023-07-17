const express = require("express");
const router = express.Router();
const userDetailController = require("../controller/userDetailController");
const driverAuthMiddleware = require("../middleware/driverAuthMiddleware");

// driverAuthMiddleware is used to protect g routes, accessible only to logged user with userType Driver
router.get("/", driverAuthMiddleware, userDetailController.user_detail);
router.post(
  "/user/",
  driverAuthMiddleware,
  userDetailController.getUserByLicense
);

module.exports = router;
