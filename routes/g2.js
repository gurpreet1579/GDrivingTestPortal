const express = require('express');
const router = express.Router();
const g2Controller = require('../controller/g2Controller');
const driverAuthMiddleware = require('../middleware/driverAuthMiddleware');

// driverAuthMiddleware is used to protect g2 routes, accessible only to logged user with userType Driver
router.get('/', driverAuthMiddleware, g2Controller.g2);
router.post('/updateG2Driver/',driverAuthMiddleware, g2Controller.updateG2Driver);

module.exports = router;