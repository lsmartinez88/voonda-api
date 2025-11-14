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
/**
 * @swagger
 * /api/vehiculos:
 *   get:
 *     summary: Obtener lista de vehículos
 *     description: Devuelve una lista paginada de vehículos con filtros opcionales
 *     tags: [Vehículos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 12
 *         description: Elementos por página
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [created_at, valor, vehiculo_ano, kilometros]
 *           default: created_at
 *         description: Campo para ordenamiento
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Dirección del ordenamiento
 *       - in: query
 *         name: estado_codigo
 *         schema:
 *           type: string
 *           enum: [salon, consignacion, pyc, preparacion, vendido, entregado]
 *         description: Filtrar por estado del vehículo
 *       - in: query
 *         name: yearFrom
 *         schema:
 *           type: integer
 *           minimum: 1950
 *         description: Año mínimo del vehículo
 *       - in: query
 *         name: yearTo
 *         schema:
 *           type: integer
 *           minimum: 1950
 *         description: Año máximo del vehículo
 *       - in: query
 *         name: priceFrom
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Precio mínimo del vehículo
 *       - in: query
 *         name: priceTo
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Precio máximo del vehículo
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Búsqueda en marca y modelo
 *     responses:
 *       200:
 *         description: Lista de vehículos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedVehiculos'
 *       400:
 *         description: Parámetros de consulta inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.get('/',
  authenticateToken,
  requirePermission('vehiculos', 'leer'),
  filterByEmpresa,
  validate(filterValidation.vehiculos, 'query'),
  asyncHandler(vehiculosController.getAll)
);

// GET /api/vehiculos/:id - Obtener un vehículo por ID
/**
 * @swagger
 * /api/vehiculos/{id}:
 *   get:
 *     summary: Obtener vehículo por ID
 *     description: Devuelve un vehículo específico con información completa
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del vehículo
 *     responses:
 *       200:
 *         description: Vehículo obtenido exitosamente
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
 *                   example: "Vehículo obtenido exitosamente"
 *                 vehiculo:
 *                   $ref: '#/components/schemas/Vehiculo'
 *       404:
 *         description: Vehículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.get('/:id',
  authenticateToken,
  requirePermission('vehiculos', 'leer'),
  filterByEmpresa,
  asyncHandler(vehiculosController.getById)
);

// POST /api/vehiculos - Crear nuevo vehículo
/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     summary: Crear nuevo vehículo
 *     description: Crea un nuevo vehículo en el sistema
 *     tags: [Vehículos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehiculoRequest'
 *           example:
 *             modelo_id: "81fe616b-efac-4b6c-8102-a790d9340ee2"
 *             vehiculo_ano: 2020
 *             estado_codigo: "salon"
 *             valor: 2500000
 *             kilometros: 25000
 *             patente: "ABC123"
 *             moneda: "ARS"
 *             publicacion_web: "false"
 *     responses:
 *       201:
 *         description: Vehículo creado exitosamente
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
 *                   example: "Vehículo creado exitosamente"
 *                 vehiculo:
 *                   $ref: '#/components/schemas/Vehiculo'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 *       429:
 *         description: Demasiadas creaciones de vehículos
 */
router.post('/',
  authenticateToken,
  requirePermission('vehiculos', 'crear'),
  createVehiculoLimiter,
  validate(vehiculoValidation.create),
  asyncHandler(vehiculosController.create)
);

// PUT /api/vehiculos/:id - Actualizar un vehículo
/**
 * @swagger
 * /api/vehiculos/{id}:
 *   put:
 *     summary: Actualizar vehículo
 *     description: Actualiza los datos de un vehículo existente
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del vehículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               modelo_id:
 *                 type: string
 *                 format: uuid
 *               vehiculo_ano:
 *                 type: integer
 *                 minimum: 1950
 *               estado_codigo:
 *                 type: string
 *                 enum: [salon, consignacion, pyc, preparacion, vendido, entregado]
 *               estado_id:
 *                 type: string
 *                 format: uuid
 *               patente:
 *                 type: string
 *                 maxLength: 15
 *               kilometros:
 *                 type: number
 *                 minimum: 0
 *               valor:
 *                 type: number
 *                 minimum: 0
 *               moneda:
 *                 type: string
 *                 maxLength: 10
 *               tipo_operacion:
 *                 type: string
 *               fecha_ingreso:
 *                 type: string
 *                 format: date-time
 *               observaciones:
 *                 type: string
 *                 maxLength: 1000
 *               pendientes_preparacion:
 *                 type: array
 *                 items:
 *                   type: string
 *               comentarios:
 *                 type: string
 *                 maxLength: 2000
 *               vendedor_id:
 *                 type: string
 *                 format: uuid
 *               comprador_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Vehículo actualizado exitosamente
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
 *                   example: "Vehículo actualizado exitosamente"
 *                 vehiculo:
 *                   $ref: '#/components/schemas/Vehiculo'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Vehículo no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.put('/:id',
  authenticateToken,
  requirePermission('vehiculos', 'editar'),
  filterByEmpresa,
  validate(vehiculoValidation.update),
  asyncHandler(vehiculosController.update)
);

// DELETE /api/vehiculos/:id - Eliminar un vehículo (soft delete)
/**
 * @swagger
 * /api/vehiculos/{id}:
 *   delete:
 *     summary: Eliminar vehículo
 *     description: Elimina un vehículo del sistema (soft delete)
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del vehículo
 *     responses:
 *       200:
 *         description: Vehículo eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Vehículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.delete('/:id',
  authenticateToken,
  requirePermission('vehiculos', 'eliminar'),
  filterByEmpresa,
  asyncHandler(vehiculosController.delete)
);

module.exports = router;