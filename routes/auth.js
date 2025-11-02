/**
 * Rutas de Autenticación usando Prisma ORM
 * Sistema de autenticación JWT con ORM
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { authValidation, validate } = require('../utils/validations');
const { asyncHandler } = require('../middleware/errorHandler');
const { authenticateToken } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

// Rate limiting específico para autenticación
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por IP
  message: {
    success: false,
    error: 'Demasiados intentos de login',
    message: 'Has excedido el límite de intentos de login. Inténtalo en 15 minutos.'
  }
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 registros por IP
  message: {
    success: false,
    error: 'Demasiados registros',
    message: 'Has excedido el límite de registros. Inténtalo en 1 hora.'
  }
});

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', 
  registerLimiter,
  validate(authValidation.register),
  asyncHandler(authController.register)
);

// POST /api/auth/login - Iniciar sesión
router.post('/login',
  loginLimiter,
  validate(authValidation.login),
  asyncHandler(authController.login)
);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout',
  authenticateToken,
  asyncHandler(authController.logout)
);

// GET /api/auth/me - Obtener información del usuario autenticado
router.get('/me',
  authenticateToken,
  asyncHandler(authController.me)
);

module.exports = router;