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
/**
 * @swagger
 * /api/estados:
 *   get:
 *     summary: Obtener estados de vehículos
 *     description: Devuelve todos los estados disponibles para vehículos
 *     tags: [Estados]
 *     responses:
 *       200:
 *         description: Estados obtenidos exitosamente
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
 *                   example: "Estados obtenidos exitosamente"
 *                 estados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EstadoVehiculo'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.get('/',
  authenticateToken,
  requirePermission('vehiculos', 'leer'), // Solo necesita leer vehículos para ver estados
  asyncHandler(estadosController.getAll)
);

module.exports = router;