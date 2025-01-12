const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.use(authMiddleware.verifyToken);
router.use(authMiddleware.requireAdmin);
router.get('/', userController.getAllUsers);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/:id/password', userController.updatePassword);

module.exports = router;
