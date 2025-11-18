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
  // validate(filterValidation.vehiculos, 'query'), // Removido por problemas de paginación
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
 *     description: |
 *       Actualiza los datos de un vehículo existente con funcionalidad avanzada:
 *       - **Información de modelo**: Si se proporciona marca, modelo o versión, se creará/actualizará el modelo_auto correspondiente
 *       - **Información de vendedor**: Si se proporciona vendedor_email (y otros datos), se creará/actualizará el vendedor correspondiente
 *       - **Publicaciones**: Si se proporciona el array "publicaciones", se eliminarán todas las publicaciones existentes y se crearán las nuevas
 *       
 *       Todos los campos son opcionales. Solo se actualizarán los campos proporcionados.
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
 *               # Información del modelo del vehículo (para crear/actualizar modelo_auto)
 *               marca:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: "Nombre de la marca del vehículo"
 *                 example: "Toyota"
 *               modelo:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 description: "Nombre del modelo del vehículo"
 *                 example: "Corolla"
 *               version:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 description: "Versión específica del modelo"
 *                 example: "XEI"
 *                 
 *               # Información específica del vehículo
 *               vehiculo_ano:
 *                 type: integer
 *                 minimum: 1950
 *                 description: "Año de fabricación del vehículo"
 *                 example: 2023
 *                 
 *               # Información del vendedor (para crear/actualizar vendedor)
 *               vendedor_nombre:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: "Nombre del vendedor"
 *                 example: "Juan"
 *               vendedor_apellido:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 description: "Apellido del vendedor"
 *                 example: "Pérez"
 *               vendedor_telefono:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 20
 *                 description: "Teléfono del vendedor"
 *                 example: "+54 11 1234-5678"
 *               vendedor_email:
 *                 type: string
 *                 format: email
 *                 maxLength: 100
 *                 description: "Email del vendedor (clave para identificar/crear vendedor)"
 *                 example: "juan.perez@email.com"
 *               vendedor_dni:
 *                 type: string
 *                 maxLength: 20
 *                 description: "DNI del vendedor (opcional)"
 *                 example: "12345678"
 *               vendedor_direccion:
 *                 type: string
 *                 maxLength: 200
 *                 description: "Dirección del vendedor (opcional)"
 *                 example: "Av. Corrientes 1234, CABA"
 *               vendedor_observaciones:
 *                 type: string
 *                 maxLength: 500
 *                 description: "Observaciones sobre el vendedor (opcional)"
 *                 example: "Cliente frecuente"
 *                 
 *               # Array de publicaciones (reemplaza todas las existentes)
 *               publicaciones:
 *                 type: array
 *                 description: "Array de publicaciones que reemplazará todas las publicaciones existentes del vehículo"
 *                 items:
 *                   type: object
 *                   required: [plataforma, titulo]
 *                   properties:
 *                     plataforma:
 *                       type: string
 *                       enum: [facebook, web, mercadolibre, instagram, whatsapp, olx, autocosmos, otro]
 *                       description: "Plataforma donde se publicará"
 *                       example: "web"
 *                     titulo:
 *                       type: string
 *                       minLength: 1
 *                       maxLength: 200
 *                       description: "Título de la publicación"
 *                       example: "Toyota Corolla XEI 2023 - Impecable"
 *                     url_publicacion:
 *                       type: string
 *                       format: uri
 *                       description: "URL de la publicación (opcional)"
 *                       example: "https://ejemplo.com/vehiculo/123"
 *                     id_publicacion:
 *                       type: string
 *                       maxLength: 100
 *                       description: "ID interno de la publicación en la plataforma (opcional)"
 *                       example: "pub_123456"
 *                     ficha_breve:
 *                       type: string
 *                       maxLength: 1000
 *                       description: "Descripción breve de la publicación (opcional)"
 *                       example: "Vehículo en excelente estado, único dueño"
 *                     activo:
 *                       type: boolean
 *                       default: true
 *                       description: "Si la publicación está activa"
 *                 example:
 *                   - plataforma: "web"
 *                     titulo: "Toyota Corolla XEI 2023 - Impecable"
 *                     ficha_breve: "Vehículo en excelente estado, único dueño"
 *                   - plataforma: "facebook"
 *                     titulo: "Toyota Corolla XEI 2023"
 *                     url_publicacion: "https://facebook.com/marketplace/item/123"
 *                     id_publicacion: "fb_123456"
 *                     
 *               # Estado del vehículo
 *               estado_codigo:
 *                 type: string
 *                 enum: [disponible, salon, consignacion, pyc, preparacion, vendido, entregado]
 *                 description: "Estado actual del vehículo"
 *                 example: "disponible"
 *               estado_id:
 *                 type: string
 *                 format: uuid
 *                 description: "ID del estado (alternativo a estado_codigo)"
 *                 
 *               # Información comercial
 *               patente:
 *                 type: string
 *                 maxLength: 15
 *                 description: "Patente del vehículo"
 *                 example: "ABC123"
 *               kilometros:
 *                 type: number
 *                 minimum: 0
 *                 description: "Kilometraje del vehículo"
 *                 example: 50000
 *               valor:
 *                 type: number
 *                 minimum: 0
 *                 description: "Precio del vehículo"
 *                 example: 25000000
 *               moneda:
 *                 type: string
 *                 maxLength: 10
 *                 description: "Moneda del precio"
 *                 example: "ARS"
 *               tipo_operacion:
 *                 type: string
 *                 description: "Tipo de operación"
 *                 example: "venta"
 *               publicacion_web:
 *                 type: string
 *                 enum: ['true', 'false']
 *                 description: "Si se publica en web"
 *               publicacion_api_call:
 *                 type: string
 *                 enum: ['true', 'false']
 *                 description: "Si se publica via API call"
 *               fecha_ingreso:
 *                 type: string
 *                 format: date-time
 *                 description: "Fecha de ingreso del vehículo"
 *               observaciones:
 *                 type: string
 *                 maxLength: 1000
 *                 description: "Observaciones generales"
 *               pendientes_preparacion:
 *                 type: string
 *                 maxLength: 2000
 *                 description: "Lista de pendientes de preparación"
 *               comentarios:
 *                 type: string
 *                 maxLength: 2000
 *                 description: "Comentarios adicionales"
 *                 
 *               # IDs directos (para compatibilidad)
 *               modelo_id:
 *                 type: string
 *                 format: uuid
 *                 description: "ID directo del modelo (alternativo a marca/modelo/version)"
 *               vendedor_id:
 *                 type: string
 *                 format: uuid
 *                 description: "ID directo del vendedor (alternativo a datos de vendedor)"
 *               comprador_id:
 *                 type: string
 *                 format: uuid
 *                 description: "ID del comprador"
 *           examples:
 *             minimal:
 *               summary: "Actualización mínima"
 *               description: "Ejemplo de actualización con campos mínimos"
 *               value:
 *                 valor: 26000000
 *                 kilometros: 52000
 *             complete:
 *               summary: "Actualización completa con auto-creación"
 *               description: "Ejemplo completo que auto-crea vendedor, modelo y publicaciones"
 *               value:
 *                 marca: "Honda"
 *                 modelo: "Civic"
 *                 version: "EXL"
 *                 vehiculo_ano: 2024
 *                 vendedor_nombre: "María"
 *                 vendedor_apellido: "García"
 *                 vendedor_telefono: "+54 11 9876-5432"
 *                 vendedor_email: "maria.garcia@email.com"
 *                 vendedor_dni: "87654321"
 *                 valor: 30000000
 *                 moneda: "ARS"
 *                 kilometros: 15000
 *                 estado_codigo: "disponible"
 *                 publicaciones:
 *                   - plataforma: "web"
 *                     titulo: "Honda Civic EXL 2024 - Como Nuevo"
 *                     ficha_breve: "Vehículo prácticamente sin uso"
 *                   - plataforma: "mercadolibre"
 *                     titulo: "Honda Civic EXL 2024"
 *                     url_publicacion: "https://vehiculo.mercadolibre.com.ar/MLA-123"
 *                     id_publicacion: "MLA-123"
 *     responses:
 *       200:
 *         description: Vehículo actualizado exitosamente con información de cambios realizados
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
 *                 resumen:
 *                   type: object
 *                   description: "Detalle de los cambios realizados durante la actualización"
 *                   properties:
 *                     vehiculo_actualizado:
 *                       type: boolean
 *                       description: "Si se actualizaron datos del vehículo"
 *                     modelo_creado:
 *                       type: boolean
 *                       description: "Si se creó un nuevo modelo"
 *                     modelo_encontrado:
 *                       type: boolean
 *                       description: "Si se encontró el modelo existente"
 *                     vendedor_creado:
 *                       type: boolean
 *                       description: "Si se creó un nuevo vendedor"
 *                     vendedor_encontrado:
 *                       type: boolean
 *                       description: "Si se encontró el vendedor existente"
 *                     publicaciones_eliminadas:
 *                       type: number
 *                       description: "Cantidad de publicaciones eliminadas"
 *                     publicaciones_creadas:
 *                       type: number
 *                       description: "Cantidad de publicaciones creadas"
 *                   example:
 *                     vehiculo_actualizado: true
 *                     modelo_creado: true
 *                     modelo_encontrado: false
 *                     vendedor_creado: false
 *                     vendedor_encontrado: true
 *                     publicaciones_eliminadas: 2
 *                     publicaciones_creadas: 3
 *       400:
 *         description: Datos inválidos en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Vehículo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Sin permisos suficientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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

// ============================================================
// RUTAS PARA FILTROS Y COMBOS
// ============================================================

// GET /api/vehiculos/filtros/marcas - Obtener marcas que tienen vehículos
/**
 * @swagger
 * /api/vehiculos/filtros/marcas:
 *   get:
 *     summary: Obtener marcas que tienen vehículos disponibles
 *     description: Devuelve una lista de marcas únicas que tienen al menos un vehículo en el inventario
 *     tags: [Vehículos]
 *     responses:
 *       200:
 *         description: Marcas disponibles obtenidas exitosamente
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
 *                   example: "Marcas disponibles obtenidas exitosamente"
 *                 marcas:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Toyota", "Honda", "Ford", "Chevrolet"]
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.get('/filtros/marcas',
  authenticateToken,
  requirePermission('vehiculos', 'leer'),
  filterByEmpresa,
  asyncHandler(vehiculosController.getMarcas)
);

// GET /api/vehiculos/filtros/modelos - Obtener modelos filtrados por marca
/**
 * @swagger
 * /api/vehiculos/filtros/modelos:
 *   get:
 *     summary: Obtener modelos disponibles, opcionalmente filtrados por marca
 *     description: Devuelve modelos que tienen vehículos disponibles, con opción de filtrar por marca específica
 *     tags: [Vehículos]
 *     parameters:
 *       - in: query
 *         name: marcaId
 *         schema:
 *           type: string
 *         description: Filtrar modelos por marca específica
 *         example: "Toyota"
 *     responses:
 *       200:
 *         description: Modelos disponibles obtenidos exitosamente
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
 *                   example: "Modelos disponibles obtenidos exitosamente"
 *                 modelos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       nombre:
 *                         type: string
 *                         example: "Corolla"
 *                       marca:
 *                         type: string
 *                         example: "Toyota"
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.get('/filtros/modelos',
  authenticateToken,
  requirePermission('vehiculos', 'leer'),
  filterByEmpresa,
  asyncHandler(vehiculosController.getModelosByMarca)
);

// GET /api/vehiculos/filtros/marcas-modelos - Obtener marcas con modelos y versiones
/**
 * @swagger
 * /api/vehiculos/filtros/marcas-modelos:
 *   get:
 *     summary: Obtener marcas con modelos y versiones para filtros
 *     description: Devuelve una estructura jerárquica de marcas -> modelos -> versiones disponibles en el inventario
 *     tags: [Vehículos]
 *     responses:
 *       200:
 *         description: Marcas y modelos obtenidos exitosamente
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
 *                   example: "Marcas y modelos obtenidos exitosamente"
 *                 marcas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       marca:
 *                         type: string
 *                         example: "Toyota"
 *                       modelos:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             modelo:
 *                               type: string
 *                               example: "Corolla"
 *                             versiones:
 *                               type: array
 *                               items:
 *                                 type: string
 *                               example: ["XEI", "XLI", "SEG"]
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.get('/filtros/marcas-modelos',
  authenticateToken,
  requirePermission('vehiculos', 'leer'),
  filterByEmpresa,
  asyncHandler(vehiculosController.getMarcasModelos)
);

// GET /api/vehiculos/filtros/años - Obtener años únicos para filtros
/**
 * @swagger
 * /api/vehiculos/filtros/años:
 *   get:
 *     summary: Obtener años únicos de vehículos para filtros
 *     description: Devuelve una lista de años únicos disponibles en el inventario, ordenados de mayor a menor
 *     tags: [Vehículos]
 *     responses:
 *       200:
 *         description: Años disponibles obtenidos exitosamente
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
 *                   example: "Años disponibles obtenidos exitosamente"
 *                 años:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [2024, 2023, 2022, 2021, 2020]
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.get('/filtros/años',
  authenticateToken,
  requirePermission('vehiculos', 'leer'),
  filterByEmpresa,
  asyncHandler(vehiculosController.getAños)
);

// GET /api/vehiculos/filtros/estados - Obtener estados para filtros
/**
 * @swagger
 * /api/vehiculos/filtros/estados:
 *   get:
 *     summary: Obtener estados de vehículos para filtros
 *     description: Devuelve una lista de todos los estados disponibles para vehículos
 *     tags: [Vehículos]
 *     responses:
 *       200:
 *         description: Estados disponibles obtenidos exitosamente
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
 *                   example: "Estados disponibles obtenidos exitosamente"
 *                 estados:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       codigo:
 *                         type: string
 *                         example: "salon"
 *                       nombre:
 *                         type: string
 *                         example: "En Salón"
 *                       descripcion:
 *                         type: string
 *                         example: "Vehículo disponible para la venta en salón"
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.get('/filtros/estados',
  authenticateToken,
  requirePermission('vehiculos', 'leer'),
  asyncHandler(vehiculosController.getEstados)
);

module.exports = router;