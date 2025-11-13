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
 * @swagger
 * /api/empresas:
 *   get:
 *     summary: Obtener lista de empresas
 *     description: Devuelve una lista de todas las empresas (solo para admin general)
 *     tags: [Empresas]
 *     responses:
 *       200:
 *         description: Empresas obtenidas exitosamente
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
 *                   example: "Empresas obtenidas exitosamente"
 *                 empresas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Empresa'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo administradores generales pueden gestionar empresas
 */
router.get('/', 
  authenticateToken,
  requireAdminGeneral,
  asyncHandler(empresasController.getAll)
);

/**
 * @swagger
 * /api/empresas/{id}:
 *   get:
 *     summary: Obtener empresa por ID
 *     description: Devuelve una empresa específica por ID (solo para admin general)
 *     tags: [Empresas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único de la empresa
 *     responses:
 *       200:
 *         description: Empresa obtenida exitosamente
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
 *                   example: "Empresa obtenida exitosamente"
 *                 empresa:
 *                   $ref: '#/components/schemas/Empresa'
 *       404:
 *         description: Empresa no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo administradores generales pueden gestionar empresas
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