const express = require('express');
const router = express.Router();
const gController = require('../controller/gController');
router.get('/', gController.g);
router.post('/user/', gController.getUserByLicense);
module.exports = router;