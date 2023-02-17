const express = require('express');
const router = express.Router();
const g2Controller = require('../controller/g2Controller');

router.get('/', g2Controller.g2);
router.post('/addG2Driver/', g2Controller.addG2Driver);
router.post('/updateG2Driver/:id', g2Controller.updateG2Driver);
module.exports = router;