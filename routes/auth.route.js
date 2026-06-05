const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');


router.post('/register', authController.signup);


router.post('/login', authController.login);

router.get('/me', authMiddleware, authController.getProfile);

router.post('/change-password', authMiddleware, authController.changePassword);

router.post('/logout', authMiddleware, authController.logout);

module.exports = router;