const express = require('express');
const router = express.Router();
const examinerController = require('../controller/examinerController');
const examinerAuthMiddleware = require('../middleware/examinerAuthMiddleware');

router.get('/schedule' ,examinerAuthMiddleware, examinerController.schedule);
router.post('/filtered-scheduled-driver' , examinerAuthMiddleware,examinerController.filteredSchedule);
router.post('/scheduled-driver' ,examinerAuthMiddleware, examinerController.scheduledDriver);
router.post('/add-result' ,examinerAuthMiddleware, examinerController.addResult);

module.exports = router;
