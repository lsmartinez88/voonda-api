/**
 * Rutas de Vendedores Multi-Empresa con Autorización
 * API REST para gestión de vendedores (personas que venden vehículos a la empresa)
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { vendedorValidation, filterValidationGeneral, validate } = require('../utils/validations');
const { asyncHandler } = require('../middleware/errorHandler');
const { 
  authenticateToken, 
  requirePermission, 
  filterByEmpresa 
} = require('../middleware/auth');
const vendedoresController = require('../controllers/vendedoresController');

const router = express.Router();

// Rate limiting para operaciones de vendedores
const createVendedorLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // máximo 20 creaciones por IP por hora
  message: {
    success: false,
    error: 'Demasiadas creaciones',
    message: 'Has excedido el límite de creación de vendedores. Inténtalo en 1 hora.'
  }
});

// ============================================================
// RUTAS DE VENDEDORES CON AUTORIZACIÓN Y FILTROS DE EMPRESA
// ============================================================

// GET /api/vendedores - Obtener lista de vendedores con filtros y paginación
router.get('/',
  authenticateToken,
  requirePermission('vendedores', 'leer'),
  filterByEmpresa,
  validate(filterValidationGeneral.general, 'query'),
  asyncHandler(vendedoresController.getAll)
);

// GET /api/vendedores/:id - Obtener un vendedor por ID
router.get('/:id',
  authenticateToken,
  requirePermission('vendedores', 'leer'),
  filterByEmpresa,
  asyncHandler(vendedoresController.getById)
);

// POST /api/vendedores - Crear nuevo vendedor
router.post('/',
  authenticateToken,
  requirePermission('vendedores', 'crear'),
  createVendedorLimiter,
  validate(vendedorValidation.create),
  asyncHandler(vendedoresController.create)
);

// PUT /api/vendedores/:id - Actualizar un vendedor
router.put('/:id',
  authenticateToken,
  requirePermission('vendedores', 'editar'),
  filterByEmpresa,
  validate(vendedorValidation.update),
  asyncHandler(vendedoresController.update)
);

// DELETE /api/vendedores/:id - Eliminar un vendedor (soft delete)
router.delete('/:id',
  authenticateToken,
  requirePermission('vendedores', 'eliminar'),
  filterByEmpresa,
  asyncHandler(vendedoresController.delete)
);

module.exports = router;