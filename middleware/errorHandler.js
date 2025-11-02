// Middleware de manejo de errores para Express
const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  // Error de validación de Joi
  if (error.isJoi) {
    return res.status(400).json({
      success: false,
      error: 'Datos inválidos',
      message: error.details[0].message,
      details: error.details.map(detail => ({
        field: detail.context.key,
        message: detail.message
      }))
    });
  }

  // Error de Supabase
  if (error.code) {
    switch (error.code) {
      case '23505': // Violación de restricción única
        return res.status(409).json({
          success: false,
          error: 'Conflicto de datos',
          message: 'El registro ya existe'
        });
      case 'PGRST116': // No rows found
        return res.status(404).json({
          success: false,
          error: 'Recurso no encontrado',
          message: 'El recurso solicitado no existe'
        });
      case '42P01': // Tabla no existe
        return res.status(500).json({
          success: false,
          error: 'Error de configuración',
          message: 'La tabla solicitada no existe en la base de datos'
        });
      default:
        return res.status(500).json({
          success: false,
          error: 'Error de base de datos',
          message: error.message || 'Error interno de la base de datos',
          code: error.code
        });
    }
  }

  // Error de JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token inválido',
      message: 'El token JWT proporcionado no es válido'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expirado',
      message: 'El token JWT ha expirado'
    });
  }

  // Error de sintaxis JSON
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      error: 'JSON inválido',
      message: 'El formato JSON de la solicitud es inválido'
    });
  }

  // Error genérico
  return res.status((error && error.status) || 500).json({
    success: false,
    error: (error && error.name) || 'Error interno del servidor',
    message: (error && error.message) || 'Ha ocurrido un error inesperado',
    ...(process.env.NODE_ENV === 'development' && { stack: error && error.stack })
  });
};

// Wrapper para manejar errores async en rutas
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Función helper para respuestas exitosas
const successResponse = (res, data = {}, message = 'Operación exitosa', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    ...data
  });
};

// Función helper para respuestas de error
const errorResponse = (res, message = 'Error interno del servidor', status = 500, error = null) => {
  const response = {
    success: false,
    error: message
  };

  if (error && process.env.NODE_ENV === 'development') {
    response.details = error.message;
    response.stack = error.stack;
  }

  return res.status(status).json(response);
};

module.exports = {
  errorHandler,
  asyncHandler,
  successResponse,
  errorResponse
};