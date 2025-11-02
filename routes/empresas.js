/**
 * Rutas de Empresas - Sistema Multi-Tenant
 * Gestión de empresas con autenticación y autorización
 */

const express = require('express');
const router = express.Router();
const empresasController = require('../controllers/empresasController');
const { authenticateToken, requirePermission, isAdminGeneral } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// Middleware para verificar que es administrador general
const requireAdminGeneral = (req, res, next) => {
  if (!isAdminGeneral(req)) {
    return res.status(403).json({
      success: false,
      message: 'Solo los administradores generales pueden gestionar empresas'
    });
  }
  next();
};

// ============================================================
// RUTAS DE EMPRESAS (SOLO ADMINISTRADOR GENERAL)
// ============================================================

/**
 * GET /api/empresas
 * Obtener todas las empresas con paginación y filtros
 */
router.get('/', 
  authenticateToken,
  requireAdminGeneral,
  asyncHandler(empresasController.getAll)
);

/**
 * GET /api/empresas/:id
 * Obtener una empresa específica por ID
 */
router.get('/:id', 
  authenticateToken,
  requireAdminGeneral,
  asyncHandler(empresasController.getById)
);

/**
 * POST /api/empresas
 * Crear una nueva empresa
 */
router.post('/', 
  authenticateToken,
  requireAdminGeneral,
  asyncHandler(empresasController.create)
);

/**
 * PUT /api/empresas/:id
 * Actualizar una empresa completa
 */
router.put('/:id', 
  authenticateToken,
  requireAdminGeneral,
  asyncHandler(empresasController.update)
);

/**
 * PATCH /api/empresas/:id/toggle
 * Activar/Desactivar una empresa
 */
router.patch('/:id/toggle', 
  authenticateToken,
  requireAdminGeneral,
  asyncHandler(empresasController.toggleActive)
);

/**
 * DELETE /api/empresas/:id
 * Eliminar una empresa (solo si no tiene datos asociados)
 */
router.delete('/:id', 
  authenticateToken,
  requireAdminGeneral,
  asyncHandler(empresasController.delete)
);

/**
 * GET /api/empresas/:id/stats
 * Obtener estadísticas de una empresa
 */
router.get('/:id/stats', 
  authenticateToken,
  requireAdminGeneral,
  asyncHandler(empresasController.getStats)
);

module.exports = router;