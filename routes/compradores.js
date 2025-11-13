/**
 * Rutas de Compradores Multi-Empresa con Autorización
 * API REST para gestión de compradores (personas que compran vehículos de la empresa)
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { compradorValidation, filterValidationGeneral, validate } = require('../utils/validations');
const { asyncHandler } = require('../middleware/errorHandler');
const { 
  authenticateToken, 
  requirePermission, 
  filterByEmpresa 
} = require('../middleware/auth');
const compradoresController = require('../controllers/compradoresController');

const router = express.Router();

// Rate limiting para operaciones de compradores
const createCompradorLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // máximo 20 creaciones por IP por hora
  message: {
    success: false,
    error: 'Demasiadas creaciones',
    message: 'Has excedido el límite de creación de compradores. Inténtalo en 1 hora.'
  }
});

// ============================================================
// RUTAS DE COMPRADORES CON AUTORIZACIÓN Y FILTROS DE EMPRESA
// ============================================================

// GET /api/compradores - Obtener lista de compradores con filtros y paginación
/**
 * @swagger
 * /api/compradores:
 *   get:
 *     summary: Obtener lista de compradores
 *     description: Devuelve una lista paginada de compradores con filtros opcionales
 *     tags: [Compradores]
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
 *         description: Lista de compradores obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedCompradores'
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
  requirePermission('compradores', 'leer'),
  filterByEmpresa,
  validate(filterValidationGeneral.general, 'query'),
  asyncHandler(compradoresController.getAll)
);

// GET /api/compradores/:id - Obtener un comprador por ID
/**
 * @swagger
 * /api/compradores/{id}:
 *   get:
 *     summary: Obtener comprador por ID
 *     description: Devuelve un comprador específico con información detallada
 *     tags: [Compradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del comprador
 *     responses:
 *       200:
 *         description: Comprador obtenido exitosamente
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
 *                   example: "Comprador obtenido exitosamente"
 *                 comprador:
 *                   $ref: '#/components/schemas/Comprador'
 *       404:
 *         description: Comprador no encontrado
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
  requirePermission('compradores', 'leer'),
  filterByEmpresa,
  asyncHandler(compradoresController.getById)
);

// POST /api/compradores - Crear nuevo comprador
/**
 * @swagger
 * /api/compradores:
 *   post:
 *     summary: Crear nuevo comprador
 *     description: Crea un nuevo comprador en el sistema
 *     tags: [Compradores]
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
 *                 description: Nombre del comprador
 *               apellido:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 200
 *                 description: Apellido del comprador
 *               telefono:
 *                 type: string
 *                 maxLength: 20
 *                 description: Teléfono del comprador
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 description: Email del comprador
 *               dni:
 *                 type: string
 *                 maxLength: 20
 *                 description: DNI del comprador
 *               direccion:
 *                 type: string
 *                 maxLength: 500
 *                 description: Dirección del comprador
 *               ciudad:
 *                 type: string
 *                 maxLength: 100
 *                 description: Ciudad del comprador
 *               provincia:
 *                 type: string
 *                 maxLength: 100
 *                 description: Provincia del comprador
 *               codigo_postal:
 *                 type: string
 *                 maxLength: 10
 *                 description: Código postal
 *               origen:
 *                 type: string
 *                 maxLength: 100
 *                 description: Origen del comprador
 *               comentarios:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Comentarios sobre el comprador
 *           example:
 *             nombre: "María Elena"
 *             apellido: "González"
 *             telefono: "+54 11 9876-5432"
 *             email: "maria.gonzalez@email.com"
 *             dni: "87654321"
 *             ciudad: "Córdoba"
 *             provincia: "Córdoba"
 *     responses:
 *       201:
 *         description: Comprador creado exitosamente
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
 *                   example: "Comprador creado exitosamente"
 *                 comprador:
 *                   $ref: '#/components/schemas/Comprador'
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
 *         description: Demasiadas creaciones de compradores
 */
router.post('/',
  authenticateToken,
  requirePermission('compradores', 'crear'),
  createCompradorLimiter,
  validate(compradorValidation.create),
  asyncHandler(compradoresController.create)
);

// PUT /api/compradores/:id - Actualizar un comprador
/**
 * @swagger
 * /api/compradores/{id}:
 *   put:
 *     summary: Actualizar comprador
 *     description: Actualiza los datos de un comprador existente
 *     tags: [Compradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del comprador
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
 *         description: Comprador actualizado exitosamente
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
 *                   example: "Comprador actualizado exitosamente"
 *                 comprador:
 *                   $ref: '#/components/schemas/Comprador'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Comprador no encontrado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.put('/:id',
  authenticateToken,
  requirePermission('compradores', 'editar'),
  filterByEmpresa,
  validate(compradorValidation.update),
  asyncHandler(compradoresController.update)
);

// DELETE /api/compradores/:id - Eliminar un comprador (soft delete)
/**
 * @swagger
 * /api/compradores/{id}:
 *   delete:
 *     summary: Eliminar comprador
 *     description: Elimina un comprador del sistema (soft delete)
 *     tags: [Compradores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único del comprador
 *     responses:
 *       200:
 *         description: Comprador eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Comprador no encontrado
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
  requirePermission('compradores', 'eliminar'),
  filterByEmpresa,
  asyncHandler(compradoresController.delete)
);

module.exports = router;