/**
 * Helper utilities para manejo de vehículos
 */

/**
 * Procesa el campo pendientes_preparacion para manejar diferentes formatos
 * @param {*} value - Valor que puede ser array, string, string con \n, null, undefined
 * @returns {Array} Array de strings con los pendientes
 */
const processPendientesPreparacion = (value) => {
  console.log('🔧 Procesando pendientes_preparacion:', { value, type: typeof value });

  // Si es undefined o null, retornar array vacío
  if (value === undefined || value === null) {
    return [];
  }

  // Si es string vacío, retornar array vacío
  if (value === '') {
    return [];
  }

  // Si ya es un array, filtrarlo y limpiarlo
  if (Array.isArray(value)) {
    const cleaned = value
      .map(item => item ? item.toString().trim() : '')
      .filter(item => item !== '');
    console.log('✅ Array procesado:', cleaned);
    return cleaned;
  }

  // Si es string, procesarlo
  if (typeof value === 'string') {
    const trimmed = value.trim();
    
    // Si es string vacío después del trim, retornar array vacío
    if (trimmed === '') {
      return [];
    }

    // Si contiene saltos de línea, dividir por \n
    if (trimmed.includes('\n')) {
      const items = trimmed
        .split('\n')
        .map(item => item.trim())
        .filter(item => item !== ''); // Filtrar líneas vacías
      
      console.log('✅ String con \\n procesado:', items);
      return items;
    }

    // Si es string simple, retornar como array de un elemento
    console.log('✅ String simple procesado:', [trimmed]);
    return [trimmed];
  }

  // Para cualquier otro tipo, convertir a string y procesar
  console.log('🔄 Convirtiendo tipo desconocido a string...');
  return processPendientesPreparacion(value.toString());
};

module.exports = {
  processPendientesPreparacion
};