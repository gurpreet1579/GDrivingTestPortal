const express = require('express');
const router = express.Router();
const dashBoardController = require('../controller/dashboardController');
router.get('/', dashBoardController.dashBoard);
module.exports = router;