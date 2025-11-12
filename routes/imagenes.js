/**
 * Rutas de Imágenes de Vehículos Multi-Empresa con Autorización
 * API REST para gestión de imágenes asociadas a vehículos
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { imagenVehiculoValidation, validate } = require('../utils/validations');
const { asyncHandler } = require('../middleware/errorHandler');
const { 
  authenticateToken, 
  requirePermission, 
  filterByEmpresa 
} = require('../middleware/auth');
const imagenesController = require('../controllers/imagenesController');

const router = express.Router();

// Rate limiting para operaciones de imágenes
const createImagenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 50, // máximo 50 subidas por IP por hora
  message: {
    success: false,
    error: 'Demasiadas subidas',
    message: 'Has excedido el límite de subida de imágenes. Inténtalo en 1 hora.'
  }
});

// ============================================================
// RUTAS DE IMÁGENES DE VEHÍCULOS CON AUTORIZACIÓN
// ============================================================

// GET /api/vehiculos/:vehiculo_id/imagenes - Obtener todas las imágenes de un vehículo
router.get('/vehiculos/:vehiculo_id/imagenes',
  authenticateToken,
  requirePermission('vehiculos', 'leer'),
  filterByEmpresa,
  asyncHandler(imagenesController.getByVehiculo)
);

// GET /api/imagenes/:id - Obtener una imagen específica
router.get('/:id',
  authenticateToken,
  requirePermission('vehiculos', 'leer'),
  filterByEmpresa,
  asyncHandler(imagenesController.getById)
);

// POST /api/vehiculos/:vehiculo_id/imagenes - Crear nueva imagen para un vehículo
router.post('/vehiculos/:vehiculo_id/imagenes',
  authenticateToken,
  requirePermission('vehiculos', 'crear'),
  filterByEmpresa,
  createImagenLimiter,
  validate(imagenVehiculoValidation.create),
  asyncHandler(imagenesController.create)
);

// PUT /api/imagenes/:id - Actualizar una imagen
router.put('/:id',
  authenticateToken,
  requirePermission('vehiculos', 'editar'),
  filterByEmpresa,
  validate(imagenVehiculoValidation.update),
  asyncHandler(imagenesController.update)
);

// DELETE /api/imagenes/:id - Eliminar una imagen (soft delete)
router.delete('/:id',
  authenticateToken,
  requirePermission('vehiculos', 'eliminar'),
  filterByEmpresa,
  asyncHandler(imagenesController.delete)
);

// PATCH /api/imagenes/:id/principal - Establecer imagen como principal
router.patch('/:id/principal',
  authenticateToken,
  requirePermission('vehiculos', 'editar'),
  filterByEmpresa,
  asyncHandler(imagenesController.setPrincipal)
);

module.exports = router;