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
 * @route   GET /api/operaciones
 * @desc    Obtener lista de operaciones con filtros y paginación
 * @access  Private (requiere autenticación)
 * @query   {string} tipo - Filtrar por tipo de operación (compra, venta, seña, etc.)
 * @query   {string} estado - Filtrar por estado (pendiente, completada, etc.)
 * @query   {string} fecha_desde - Fecha desde (YYYY-MM-DD)
 * @query   {string} fecha_hasta - Fecha hasta (YYYY-MM-DD)
 * @query   {string} vehiculo_id - ID del vehículo
 * @query   {string} vendedor_id - ID del vendedor
 * @query   {string} comprador_id - ID del comprador
 * @query   {string} search - Búsqueda en observaciones
 * @query   {number} page - Número de página (default: 1)
 * @query   {number} limit - Elementos por página (default: 12, max: 100)
 * @query   {string} orderBy - Campo para ordenar (fecha, monto, tipo, estado)
 * @query   {string} order - Dirección del orden (asc, desc)
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
 * @route   GET /api/operaciones/:id
 * @desc    Obtener operación por ID
 * @access  Private (requiere autenticación)
 * @param   {string} id - ID de la operación (UUID)
 */
router.get('/:id', operacionesController.getById);

/**
 * @route   POST /api/operaciones
 * @desc    Crear nueva operación
 * @access  Private (requiere autenticación)
 * @body    {object} operacion - Datos de la operación
 * @body    {string} operacion.tipo - Tipo de operación (compra, venta, seña, transferencia, ingreso, entrega, devolucion)
 * @body    {string} operacion.fecha - Fecha de la operación (ISO date)
 * @body    {number} operacion.monto - Monto de la operación
 * @body    {string} operacion.moneda - Moneda (ARS, USD, EUR, BRL)
 * @body    {string} operacion.estado - Estado (pendiente, en_proceso, completada, cancelada, suspendida)
 * @body    {string} operacion.vehiculo_id - ID del vehículo (UUID)
 * @body    {string} [operacion.vendedor_id] - ID del vendedor (UUID)
 * @body    {string} [operacion.comprador_id] - ID del comprador (UUID)
 * @body    {string} [operacion.observaciones] - Observaciones
 * @body    {object} [operacion.datos_especificos] - Datos específicos según tipo de operación
 */
router.post('/', validateCreateOperacion, operacionesController.create);

/**
 * @route   PUT /api/operaciones/:id
 * @desc    Actualizar operación
 * @access  Private (requiere autenticación)
 * @param   {string} id - ID de la operación (UUID)
 * @body    {object} operacion - Datos a actualizar (campos opcionales)
 */
router.put('/:id', validateUpdateOperacion, operacionesController.update);

/**
 * @route   DELETE /api/operaciones/:id
 * @desc    Eliminar operación
 * @access  Private (requiere autenticación)
 * @param   {string} id - ID de la operación (UUID)
 */
router.delete('/:id', operacionesController.delete);

module.exports = router;