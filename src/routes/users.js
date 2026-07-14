const express = require('express');

const authenticate = require('../authenticate');
const userController = require('../controllers/userController');

const router = express.Router('');

router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, userController.getUsers);
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/me', authenticate.verifyUser, userController.getMe);
router.get('/checkJWTToken', authenticate.verifyUser, userController.checkJWTToken);

module.exports = router;
