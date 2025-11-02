/**
 * Utilities para manejo de estados de vehículos
 * Convierte códigos de estado a IDs y viceversa
 */

const { prisma } = require('./prisma');

/**
 * Cache en memoria para los estados (mejora performance)
 */
let estadosCache = null;
let lastCacheUpdate = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Obtener todos los estados con cache
 */
async function getEstados() {
  const now = new Date().getTime();
  
  // Si el cache es válido, usarlo
  if (estadosCache && lastCacheUpdate && (now - lastCacheUpdate) < CACHE_DURATION) {
    return estadosCache;
  }
  
  // Recargar cache
  estadosCache = await prisma.estadoVehiculo.findMany({
    orderBy: { codigo: 'asc' }
  });
  
  lastCacheUpdate = now;
  return estadosCache;
}

/**
 * Obtener estado por código
 */
async function getEstadoPorCodigo(codigo) {
  const estados = await getEstados();
  return estados.find(estado => estado.codigo === codigo);
}

/**
 * Obtener estado por ID
 */
async function getEstadoPorId(id) {
  const estados = await getEstados();
  return estados.find(estado => estado.id === id);
}

/**
 * Resolver estado_id desde estado_codigo o estado_id
 * Prioridad: estado_id > estado_codigo
 */
async function resolverEstadoId(estado_codigo, estado_id) {
  // Si se proporciona estado_id directamente, validar que existe
  if (estado_id) {
    const estado = await getEstadoPorId(estado_id);
    if (!estado) {
      throw new Error(`Estado con ID ${estado_id} no encontrado`);
    }
    return estado_id;
  }
  
  // Si se proporciona estado_codigo, convertir a ID
  if (estado_codigo) {
    const estado = await getEstadoPorCodigo(estado_codigo);
    if (!estado) {
      throw new Error(`Estado con código '${estado_codigo}' no encontrado`);
    }
    return estado.id;
  }
  
  // Si no se proporciona ninguno, devolver null (opcional)
  return null;
}

/**
 * Obtener estado por defecto (salon)
 */
async function getEstadoDefecto() {
  const estado = await getEstadoPorCodigo('salon');
  if (!estado) {
    throw new Error('Estado por defecto (salon) no encontrado en la base de datos');
  }
  return estado;
}

/**
 * Validar que un código de estado es válido
 */
async function validarCodigoEstado(codigo) {
  const estados = await getEstados();
  const codigosValidos = estados.map(e => e.codigo);
  return codigosValidos.includes(codigo);
}

/**
 * Invalidar cache (útil para tests o cuando se modifican estados)
 */
function invalidarCache() {
  estadosCache = null;
  lastCacheUpdate = null;
}

module.exports = {
  getEstados,
  getEstadoPorCodigo,
  getEstadoPorId,
  resolverEstadoId,
  getEstadoDefecto,
  validarCodigoEstado,
  invalidarCache
};