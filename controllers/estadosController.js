/**
 * Controller de Estados de Vehículos
 * Manejo de estados disponibles para vehículos
 */

const { getEstados } = require('../utils/estadoVehiculo');
const { successResponse } = require('../middleware/errorHandler');

/**
 * Obtener todos los estados de vehículos disponibles
 */
exports.getAll = async function (req, res) {
  try {
    const estados = await getEstados();
    
    return successResponse(res, { estados }, 'Estados obtenidos exitosamente');
  } catch (error) {
    throw error;
  }
};