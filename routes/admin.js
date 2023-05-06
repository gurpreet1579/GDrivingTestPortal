const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

router.get('/appointment', adminAuthMiddleware ,adminController.appointment);
router.post('/createSlot', adminAuthMiddleware ,adminController.createSlot);
router.get('/get-potential-slot' ,adminAuthMiddleware,adminController.getPotentialSlot);
router.get('/result' ,adminAuthMiddleware,adminController.getTestResult);
module.exports = router;
