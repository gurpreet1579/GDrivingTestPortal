const express = require('express');
const router = express.Router();
const loginController = require('../controller/loginController');
const loginAccessMiddleware = require('../middleware/loginAccessMiddleware');

// here loginAccessMiddleware is used to protect login page when user is already logged in
router.get('/', loginAccessMiddleware, loginController.login);
module.exports = router;