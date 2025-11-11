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
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     description: Crea una nueva cuenta de usuario en el sistema
 *     tags: [Autenticación]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - nombre
 *               - apellido
 *               - empresa_id
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@empresa.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "mipassword123"
 *               nombre:
 *                 type: string
 *                 example: "Juan"
 *               apellido:
 *                 type: string
 *                 example: "Pérez"
 *               telefono:
 *                 type: string
 *                 example: "+54 9 11 1234-5678"
 *               empresa_id:
 *                 type: string
 *                 format: uuid
 *                 example: "9c4195f8-ddd9-4e27-93e0-e949aa2ef63d"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuario registrado exitosamente"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Usuario ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Demasiados intentos de registro
 */
router.post('/register', 
  registerLimiter,
  validate(authValidation.register),
  asyncHandler(authController.register)
);

// POST /api/auth/login - Iniciar sesión
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica un usuario y devuelve un token JWT
 *     tags: [Autenticación]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "admin.empresa@voonda.com"
 *             password: "admin123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Demasiados intentos de login
 */
router.post('/login',
  loginLimiter,
  validate(authValidation.login),
  asyncHandler(authController.login)
);

// POST /api/auth/logout - Cerrar sesión
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: Invalida el token JWT del usuario
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: Token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/logout',
  authenticateToken,
  asyncHandler(authController.logout)
);

// GET /api/auth/me - Obtener información del usuario autenticado
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener perfil del usuario
 *     description: Devuelve la información completa del usuario autenticado
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Información del usuario obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Información del usuario obtenida exitosamente"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me',
  authenticateToken,
  asyncHandler(authController.me)
);

module.exports = router;