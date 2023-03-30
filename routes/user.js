const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.get('/sign-up', userController.signUp);
router.post('/create-user', userController.createUser);
router.post('/create-session' , userController.createSession);
router.get('/destroy-session' , userController.destroySession);
module.exports = router;
