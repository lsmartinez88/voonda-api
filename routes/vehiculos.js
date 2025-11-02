/**
 * Rutas de Vehículos Multi-Empresa con Autorización
 * API REST completa para gestión de vehículos con control de acceso por empresa
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { vehiculoValidation, filterValidation, validate } = require('../utils/validations');
const { asyncHandler } = require('../middleware/errorHandler');
const { 
  authenticateToken, 
  requirePermission, 
  filterByEmpresa 
} = require('../middleware/auth');
const vehiculosController = require('../controllers/vehiculosController');

const router = express.Router();

// Rate limiting para operaciones de vehículos
const createVehiculoLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 creaciones por IP por hora
  message: {
    success: false,
    error: 'Demasiadas creaciones',
    message: 'Has excedido el límite de creación de vehículos. Inténtalo en 1 hora.'
  }
});

// ============================================================
// RUTAS DE VEHÍCULOS CON AUTORIZACIÓN Y FILTROS DE EMPRESA
// ============================================================

// GET /api/vehiculos - Obtener lista de vehículos con filtros y paginación
router.get('/',
  authenticateToken,
  requirePermission('vehiculos', 'leer'),
  filterByEmpresa,
  validate(filterValidation.vehiculos, 'query'),
  asyncHandler(vehiculosController.getAll)
);

// GET /api/vehiculos/:id - Obtener un vehículo por ID
router.get('/:id',
  authenticateToken,
  requirePermission('vehiculos', 'leer'),
  filterByEmpresa,
  asyncHandler(vehiculosController.getById)
);

// POST /api/vehiculos - Crear nuevo vehículo
router.post('/',
  authenticateToken,
  requirePermission('vehiculos', 'crear'),
  createVehiculoLimiter,
  validate(vehiculoValidation.create),
  asyncHandler(vehiculosController.create)
);

// PUT /api/vehiculos/:id - Actualizar un vehículo
router.put('/:id',
  authenticateToken,
  requirePermission('vehiculos', 'editar'),
  filterByEmpresa,
  validate(vehiculoValidation.update),
  asyncHandler(vehiculosController.update)
);

// DELETE /api/vehiculos/:id - Eliminar un vehículo (soft delete)
router.delete('/:id',
  authenticateToken,
  requirePermission('vehiculos', 'eliminar'),
  filterByEmpresa,
  asyncHandler(vehiculosController.delete)
);

module.exports = router;