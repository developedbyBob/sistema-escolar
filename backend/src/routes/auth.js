// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middlewares/auth');

// Rotas públicas
router.post('/login', authController.login);
router.post('/create-admin', authController.createAdmin); // Rota para criar o primeiro admin (desenvolvimento)

// Rotas protegidas
router.get('/profile', authenticate, authController.getProfile);
router.post('/update-password', authenticate, authController.updatePassword);

// Rota para criar usuários (apenas admin)
router.post('/register', authenticate, authorize('admin'), authController.register);

module.exports = router;