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
/**
 * @swagger
 * /api/vendedores:
 *   get:
 *     summary: Obtener lista de vendedores
 *     description: Devuelve una lista paginada de vendedores con filtros opcionales
 *     tags: [Vendedores]
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
 *         name: search
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Búsqueda en nombre, apellido, teléfono, email, DNI
 *     responses:
 *       200:
 *         description: Lista de vendedores obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedVendedores'
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
  requirePermission('vendedores', 'leer'),
  filterByEmpresa,
  validate(filterValidationGeneral.general, 'query'),
  asyncHandler(vendedoresController.getAll)
);

// GET /api/vendedores/:id - Obtener un vendedor por ID
/**
 * @swagger
 * /api/vendedores/{id}:
 *   get:
 *     summary: Obtener vendedor por ID
 *     description: Devuelve un vendedor específico con información detallada
 *     tags: [Vendedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del vendedor
 *     responses:
 *       200:
 *         description: Vendedor obtenido exitosamente
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
 *                   example: "Vendedor obtenido exitosamente"
 *                 vendedor:
 *                   $ref: '#/components/schemas/Vendedor'
 *       404:
 *         description: Vendedor no encontrado
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
  requirePermission('vendedores', 'leer'),
  filterByEmpresa,
  asyncHandler(vendedoresController.getById)
);

// POST /api/vendedores - Crear nuevo vendedor
/**
 * @swagger
 * /api/vendedores:
 *   post:
 *     summary: Crear nuevo vendedor
 *     description: Crea un nuevo vendedor en el sistema
 *     tags: [Vendedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 200
 *                 description: Nombre del vendedor
 *               apellido:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 200
 *                 description: Apellido del vendedor
 *               telefono:
 *                 type: string
 *                 maxLength: 20
 *                 description: Teléfono del vendedor
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 description: Email del vendedor
 *               dni:
 *                 type: string
 *                 maxLength: 20
 *                 description: DNI del vendedor
 *               direccion:
 *                 type: string
 *                 maxLength: 500
 *                 description: Dirección del vendedor
 *               ciudad:
 *                 type: string
 *                 maxLength: 100
 *                 description: Ciudad del vendedor
 *               provincia:
 *                 type: string
 *                 maxLength: 100
 *                 description: Provincia del vendedor
 *               codigo_postal:
 *                 type: string
 *                 maxLength: 10
 *                 description: Código postal
 *               origen:
 *                 type: string
 *                 maxLength: 100
 *                 description: Origen del vendedor
 *               comentarios:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Comentarios sobre el vendedor
 *           example:
 *             nombre: "Juan Carlos"
 *             apellido: "Pérez"
 *             telefono: "+54 11 1234-5678"
 *             email: "juan.perez@email.com"
 *             dni: "12345678"
 *             ciudad: "Buenos Aires"
 *             provincia: "Buenos Aires"
 *     responses:
 *       201:
 *         description: Vendedor creado exitosamente
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
 *                   example: "Vendedor creado exitosamente"
 *                 vendedor:
 *                   $ref: '#/components/schemas/Vendedor'
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
 *         description: Demasiadas creaciones de vendedores
 */
router.post('/',
  authenticateToken,
  requirePermission('vendedores', 'crear'),
  createVendedorLimiter,
  validate(vendedorValidation.create),
  asyncHandler(vendedoresController.create)
);

// PUT /api/vendedores/:id - Actualizar un vendedor
/**
 * @swagger
 * /api/vendedores/{id}:
 *   put:
 *     summary: Actualizar vendedor
 *     description: Actualiza los datos de un vendedor existente
 *     tags: [Vendedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del vendedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 200
 *               apellido:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 200
 *               telefono:
 *                 type: string
 *                 maxLength: 20
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *               dni:
 *                 type: string
 *                 maxLength: 20
 *               direccion:
 *                 type: string
 *                 maxLength: 500
 *               ciudad:
 *                 type: string
 *                 maxLength: 100
 *               provincia:
 *                 type: string
 *                 maxLength: 100
 *               codigo_postal:
 *                 type: string
 *                 maxLength: 10
 *               origen:
 *                 type: string
 *                 maxLength: 100
 *               comentarios:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       200:
 *         description: Vendedor actualizado exitosamente
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
 *                   example: "Vendedor actualizado exitosamente"
 *                 vendedor:
 *                   $ref: '#/components/schemas/Vendedor'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Vendedor no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.put('/:id',
  authenticateToken,
  requirePermission('vendedores', 'editar'),
  filterByEmpresa,
  validate(vendedorValidation.update),
  asyncHandler(vendedoresController.update)
);

// DELETE /api/vendedores/:id - Eliminar un vendedor (soft delete)
/**
 * @swagger
 * /api/vendedores/{id}:
 *   delete:
 *     summary: Eliminar vendedor
 *     description: Elimina un vendedor del sistema (soft delete)
 *     tags: [Vendedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del vendedor
 *     responses:
 *       200:
 *         description: Vendedor eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Vendedor no encontrado
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
  requirePermission('vendedores', 'eliminar'),
  filterByEmpresa,
  asyncHandler(vendedoresController.delete)
);

module.exports = router;