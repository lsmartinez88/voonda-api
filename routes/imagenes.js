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
/**
 * @swagger
 * /api/vehiculos/{vehiculo_id}/imagenes:
 *   get:
 *     summary: Obtener imágenes de un vehículo
 *     description: Devuelve todas las imágenes asociadas a un vehículo específico
 *     tags: [Imágenes]
 *     parameters:
 *       - in: path
 *         name: vehiculo_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del vehículo
 *     responses:
 *       200:
 *         description: Imágenes obtenidas exitosamente
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
 *                   example: "Imágenes obtenidas exitosamente"
 *                 imagenes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ImagenVehiculo'
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
router.get('/vehiculos/:vehiculo_id/imagenes',
  authenticateToken,
  requirePermission('vehiculos', 'leer'),
  filterByEmpresa,
  asyncHandler(imagenesController.getByVehiculo)
);

// GET /api/imagenes/:id - Obtener una imagen específica
/**
 * @swagger
 * /api/imagenes/{id}:
 *   get:
 *     summary: Obtener imagen por ID
 *     description: Devuelve una imagen específica con información detallada
 *     tags: [Imágenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único de la imagen
 *     responses:
 *       200:
 *         description: Imagen obtenida exitosamente
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
 *                   example: "Imagen obtenida exitosamente"
 *                 imagen:
 *                   $ref: '#/components/schemas/ImagenVehiculo'
 *       404:
 *         description: Imagen no encontrada
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
  asyncHandler(imagenesController.getById)
);

// POST /api/vehiculos/:vehiculo_id/imagenes - Crear nueva imagen para un vehículo
/**
 * @swagger
 * /api/vehiculos/{vehiculo_id}/imagenes:
 *   post:
 *     summary: Agregar imagen a vehículo
 *     description: Crea una nueva imagen asociada a un vehículo específico
 *     tags: [Imágenes]
 *     parameters:
 *       - in: path
 *         name: vehiculo_id
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
 *             required: [url]
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: URL de la imagen
 *               descripcion:
 *                 type: string
 *                 maxLength: 500
 *                 description: Descripción de la imagen
 *               orden:
 *                 type: integer
 *                 minimum: 1
 *                 description: Orden de la imagen (se calcula automáticamente si no se especifica)
 *               es_principal:
 *                 type: boolean
 *                 default: false
 *                 description: Si es la imagen principal del vehículo
 *           example:
 *             url: "https://example.com/vehiculo-imagen.jpg"
 *             descripcion: "Vista frontal del vehículo"
 *             orden: 1
 *             es_principal: true
 *     responses:
 *       201:
 *         description: Imagen creada exitosamente
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
 *                   example: "Imagen creada exitosamente"
 *                 imagen:
 *                   $ref: '#/components/schemas/ImagenVehiculo'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Vehículo no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 *       429:
 *         description: Demasiadas subidas de imágenes
 */
router.post('/vehiculos/:vehiculo_id/imagenes',
  authenticateToken,
  requirePermission('vehiculos', 'crear'),
  filterByEmpresa,
  createImagenLimiter,
  validate(imagenVehiculoValidation.create),
  asyncHandler(imagenesController.create)
);

// PUT /api/imagenes/:id - Actualizar una imagen
/**
 * @swagger
 * /api/imagenes/{id}:
 *   put:
 *     summary: Actualizar imagen
 *     description: Actualiza los datos de una imagen existente
 *     tags: [Imágenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único de la imagen
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *               descripcion:
 *                 type: string
 *                 maxLength: 500
 *               orden:
 *                 type: integer
 *                 minimum: 1
 *               es_principal:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Imagen actualizada exitosamente
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
 *                   example: "Imagen actualizada exitosamente"
 *                 imagen:
 *                   $ref: '#/components/schemas/ImagenVehiculo'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Imagen no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.put('/:id',
  authenticateToken,
  requirePermission('vehiculos', 'editar'),
  filterByEmpresa,
  validate(imagenVehiculoValidation.update),
  asyncHandler(imagenesController.update)
);

// DELETE /api/imagenes/:id - Eliminar una imagen (soft delete)
/**
 * @swagger
 * /api/imagenes/{id}:
 *   delete:
 *     summary: Eliminar imagen
 *     description: Elimina una imagen del sistema (soft delete)
 *     tags: [Imágenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único de la imagen
 *     responses:
 *       200:
 *         description: Imagen eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Imagen no encontrada
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
  asyncHandler(imagenesController.delete)
);

// PATCH /api/imagenes/:id/principal - Establecer imagen como principal
/**
 * @swagger
 * /api/imagenes/{id}/principal:
 *   patch:
 *     summary: Establecer imagen como principal
 *     description: Marca una imagen como principal y desmarca las demás del mismo vehículo
 *     tags: [Imágenes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único de la imagen
 *     responses:
 *       200:
 *         description: Imagen establecida como principal exitosamente
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
 *                   example: "Imagen establecida como principal exitosamente"
 *                 imagen:
 *                   $ref: '#/components/schemas/ImagenVehiculo'
 *       404:
 *         description: Imagen no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.patch('/:id/principal',
  authenticateToken,
  requirePermission('vehiculos', 'editar'),
  filterByEmpresa,
  asyncHandler(imagenesController.setPrincipal)
);

module.exports = router;