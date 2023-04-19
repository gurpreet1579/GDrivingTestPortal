const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const driverAuthMiddleware = require('../middleware/driverAuthMiddleware');

router.get('/sign-up', userController.signUp);
router.post('/create-user', userController.createUser);
router.post('/create-session' , userController.createSession);
router.get('/destroy-session' , userController.destroySession);

router.get('/get-slot' ,driverAuthMiddleware, userController.getSlot);
router.post('/book-slot' ,driverAuthMiddleware, userController.addSlot);
module.exports = router;
