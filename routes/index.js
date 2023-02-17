const express = require('express');
const router = express.Router();

router.use('/dashboard', require('./dashboard'));
router.use('/g2', require('./g2'));
router.use('/g', require('./g'));
router.use('/login', require('./login'));

module.exports = router;