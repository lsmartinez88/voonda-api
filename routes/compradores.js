/**
 * Rutas de Compradores Multi-Empresa con Autorización
 * API REST para gestión de compradores (personas que compran vehículos de la empresa)
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { compradorValidation, filterValidationGeneral, validate } = require('../utils/validations');
const { asyncHandler } = require('../middleware/errorHandler');
const { 
  authenticateToken, 
  requirePermission, 
  filterByEmpresa 
} = require('../middleware/auth');
const compradoresController = require('../controllers/compradoresController');

const router = express.Router();

// Rate limiting para operaciones de compradores
const createCompradorLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // máximo 20 creaciones por IP por hora
  message: {
    success: false,
    error: 'Demasiadas creaciones',
    message: 'Has excedido el límite de creación de compradores. Inténtalo en 1 hora.'
  }
});

// ============================================================
// RUTAS DE COMPRADORES CON AUTORIZACIÓN Y FILTROS DE EMPRESA
// ============================================================

// GET /api/compradores - Obtener lista de compradores con filtros y paginación
router.get('/',
  authenticateToken,
  requirePermission('compradores', 'leer'),
  filterByEmpresa,
  validate(filterValidationGeneral.general, 'query'),
  asyncHandler(compradoresController.getAll)
);

// GET /api/compradores/:id - Obtener un comprador por ID
router.get('/:id',
  authenticateToken,
  requirePermission('compradores', 'leer'),
  filterByEmpresa,
  asyncHandler(compradoresController.getById)
);

// POST /api/compradores - Crear nuevo comprador
router.post('/',
  authenticateToken,
  requirePermission('compradores', 'crear'),
  createCompradorLimiter,
  validate(compradorValidation.create),
  asyncHandler(compradoresController.create)
);

// PUT /api/compradores/:id - Actualizar un comprador
router.put('/:id',
  authenticateToken,
  requirePermission('compradores', 'editar'),
  filterByEmpresa,
  validate(compradorValidation.update),
  asyncHandler(compradoresController.update)
);

// DELETE /api/compradores/:id - Eliminar un comprador (soft delete)
router.delete('/:id',
  authenticateToken,
  requirePermission('compradores', 'eliminar'),
  filterByEmpresa,
  asyncHandler(compradoresController.delete)
);

module.exports = router;