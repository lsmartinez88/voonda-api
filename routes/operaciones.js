/**
 * Rutas para operaciones - Sistema genérico unificado
 * Reemplaza las rutas separadas de operacionesVenta y operacionesCompra
 */

const express = require('express');
const router = express.Router();

// Importar controller y validaciones
const operacionesController = require('../controllers/operacionesController');
const { 
  validateCreateOperacion, 
  validateUpdateOperacion, 
  validateFiltrosOperacion 
} = require('../validations/operacionValidations');

// Middleware de autenticación y empresa
const { authenticateToken } = require('../middleware/auth');
const { addEmpresaFilter } = require('../middleware/empresaFilter');

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateToken);
router.use(addEmpresaFilter);

/**
 * @swagger
 * /api/operaciones:
 *   get:
 *     summary: Obtener lista de operaciones
 *     description: Devuelve una lista paginada de operaciones (compras y ventas) con filtros opcionales
 *     tags: [Operaciones]
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
 *           enum: [created_at, fecha_operacion, precio]
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
 *         name: tipo_operacion
 *         schema:
 *           type: string
 *           enum: [compra, venta]
 *         description: Filtrar por tipo de operación
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, completada, cancelada]
 *         description: Filtrar por estado
 *       - in: query
 *         name: fechaFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha desde (YYYY-MM-DD)
 *       - in: query
 *         name: fechaTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha hasta (YYYY-MM-DD)
 *       - in: query
 *         name: vendedor_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por vendedor
 *       - in: query
 *         name: comprador_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por comprador
 *       - in: query
 *         name: vehiculo_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por vehículo
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Búsqueda en observaciones y método de pago
 *     responses:
 *       200:
 *         description: Lista de operaciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedOperaciones'
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
router.get('/', validateFiltrosOperacion, operacionesController.getAll);

/**
 * @route   GET /api/operaciones/resumen
 * @desc    Obtener resumen de operaciones por tipo
 * @access  Private (requiere autenticación)
 * @query   {string} fecha_desde - Fecha desde para el resumen
 * @query   {string} fecha_hasta - Fecha hasta para el resumen
 */
router.get('/resumen', operacionesController.getResumenPorTipo);

/**
 * @swagger
 * /api/operaciones/{id}:
 *   get:
 *     summary: Obtener operación por ID
 *     description: Devuelve una operación específica con información detallada
 *     tags: [Operaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único de la operación
 *     responses:
 *       200:
 *         description: Operación obtenida exitosamente
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
 *                   example: "Operación obtenida exitosamente"
 *                 operacion:
 *                   $ref: '#/components/schemas/Operacion'
 *       404:
 *         description: Operación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.get('/:id', operacionesController.getById);

/**
 * @swagger
 * /api/operaciones:
 *   post:
 *     summary: Crear nueva operación
 *     description: Crea una nueva operación (compra o venta) en el sistema
 *     tags: [Operaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vehiculo_id, tipo_operacion, precio, fecha_operacion]
 *             properties:
 *               vehiculo_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID del vehículo
 *               tipo_operacion:
 *                 type: string
 *                 enum: [compra, venta]
 *                 description: Tipo de operación
 *               vendedor_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID del vendedor (requerido si tipo_operacion = "compra")
 *               comprador_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID del comprador (requerido si tipo_operacion = "venta")
 *               precio:
 *                 type: number
 *                 minimum: 0
 *                 description: Precio de la operación
 *               moneda:
 *                 type: string
 *                 default: ARS
 *                 description: Moneda de la operación
 *               fecha_operacion:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la operación
 *               estado:
 *                 type: string
 *                 enum: [pendiente, completada, cancelada]
 *                 default: pendiente
 *                 description: Estado de la operación
 *               metodo_pago:
 *                 type: string
 *                 description: Método de pago utilizado
 *               observaciones:
 *                 type: string
 *                 maxLength: 2000
 *                 description: Observaciones de la operación
 *               documentos_pendientes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de documentos pendientes
 *           examples:
 *             operacion_compra:
 *               summary: Ejemplo de operación de compra
 *               value:
 *                 vehiculo_id: "81fe616b-efac-4b6c-8102-a790d9340ee2"
 *                 tipo_operacion: "compra"
 *                 vendedor_id: "12345678-1234-1234-1234-123456789abc"
 *                 precio: 2500000
 *                 moneda: "ARS"
 *                 fecha_operacion: "2024-11-13"
 *                 metodo_pago: "Transferencia bancaria"
 *                 observaciones: "Compra directa, documentación al día"
 *             operacion_venta:
 *               summary: Ejemplo de operación de venta
 *               value:
 *                 vehiculo_id: "81fe616b-efac-4b6c-8102-a790d9340ee2"
 *                 tipo_operacion: "venta"
 *                 comprador_id: "87654321-4321-4321-4321-123456789abc"
 *                 precio: 2800000
 *                 moneda: "ARS"
 *                 fecha_operacion: "2024-11-13"
 *                 metodo_pago: "Financiado 50%"
 *                 documentos_pendientes: ["Transferencia", "Seguro"]
 *     responses:
 *       201:
 *         description: Operación creada exitosamente
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
 *                   example: "Operación creada exitosamente"
 *                 operacion:
 *                   $ref: '#/components/schemas/Operacion'
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
 */
router.post('/', validateCreateOperacion, operacionesController.create);

/**
 * @swagger
 * /api/operaciones/{id}:
 *   put:
 *     summary: Actualizar operación
 *     description: Actualiza los datos de una operación existente
 *     tags: [Operaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único de la operación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               precio:
 *                 type: number
 *                 minimum: 0
 *               moneda:
 *                 type: string
 *               fecha_operacion:
 *                 type: string
 *                 format: date
 *               estado:
 *                 type: string
 *                 enum: [pendiente, completada, cancelada]
 *               metodo_pago:
 *                 type: string
 *               observaciones:
 *                 type: string
 *                 maxLength: 2000
 *               documentos_pendientes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Operación actualizada exitosamente
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
 *                   example: "Operación actualizada exitosamente"
 *                 operacion:
 *                   $ref: '#/components/schemas/Operacion'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Operación no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.put('/:id', validateUpdateOperacion, operacionesController.update);

/**
 * @swagger
 * /api/operaciones/{id}:
 *   delete:
 *     summary: Eliminar operación
 *     description: Elimina una operación del sistema (soft delete)
 *     tags: [Operaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID único de la operación
 *     responses:
 *       200:
 *         description: Operación eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Operación no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Sin permisos suficientes
 */
router.delete('/:id', operacionesController.delete);

module.exports = router;