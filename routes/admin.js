const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
// const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

router.get('/appointment' ,adminController.appointment);
router.post('/createSlot' ,adminController.createSlot);
router.get('/get-potential-slot' ,adminController.getPotentialSlot);
router.get('/result' ,adminController.getTestResult);
module.exports = router;
