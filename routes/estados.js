/**
 * Rutas de Estados de Vehículos
 * API para obtener estados disponibles
 */

const express = require('express');
const { asyncHandler } = require('../middleware/errorHandler');
const { 
  authenticateToken, 
  requirePermission
} = require('../middleware/auth');
const estadosController = require('../controllers/estadosController');

const router = express.Router();

// GET /api/estados - Obtener todos los estados disponibles
router.get('/',
  authenticateToken,
  requirePermission('vehiculos', 'leer'), // Solo necesita leer vehículos para ver estados
  asyncHandler(estadosController.getAll)
);

module.exports = router;