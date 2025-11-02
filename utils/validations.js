const Joi = require('joi');

// Esquemas de validación para autenticación
const authValidation = {
  // Validación para registro de usuario
  register: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'El email debe tener un formato válido',
        'any.required': 'El email es requerido'
      }),
    password: Joi.string()
      .min(6)
      .max(50)
      .required()
      .messages({
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'string.max': 'La contraseña no puede tener más de 50 caracteres',
        'any.required': 'La contraseña es requerida'
      }),
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 100 caracteres',
        'any.required': 'El nombre es requerido'
      })
  }),

  // Validación para inicio de sesión
  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'El email debe tener un formato válido',
        'any.required': 'El email es requerido'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'La contraseña es requerida'
      })
  })
};

// Esquemas de validación para vehículos
const vehiculoValidation = {
  // Validación para crear vehículo
  create: Joi.object({
    // Referencia al modelo (OBLIGATORIA)
    modelo_id: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.guid': 'El modelo_id debe ser un UUID válido',
        'any.required': 'El modelo_id es requerido'
      }),
    
    // Información específica del vehículo
    vehiculo_ano: Joi.number()
      .integer()
      .min(1950)
      .max(new Date().getFullYear() + 1)
      .required()
      .messages({
        'number.base': 'El año del vehículo debe ser un número',
        'number.integer': 'El año del vehículo debe ser un número entero',
        'number.min': 'El año del vehículo debe ser mayor a 1950',
        'number.max': 'El año del vehículo no puede ser mayor al próximo año',
        'any.required': 'El año del vehículo es requerido'
      }),
    
    // Estado del vehículo
    estado_codigo: Joi.string()
      .valid('salon', 'consignacion', 'pyc', 'preparacion', 'vendido', 'entregado')
      .optional()
      .messages({
        'any.only': 'El estado debe ser: salon, consignacion, pyc, preparacion, vendido, entregado'
      }),
    estado_id: Joi.string()
      .uuid()
      .optional()
      .messages({
        'string.guid': 'El estado_id debe ser un UUID válido'
      }),
    
    // Información comercial y específica
    patente: Joi.string()
      .max(15)
      .optional()
      .allow('')
      .messages({
        'string.max': 'La patente no puede tener más de 15 caracteres'
      }),
    kilometros: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .optional()
      .messages({
        'number.base': 'Los kilómetros deben ser un número',
        'number.integer': 'Los kilómetros deben ser un número entero',
        'number.min': 'Los kilómetros no pueden ser negativos'
      }),
    valor: Joi.number()
      .positive()
      .precision(2)
      .optional()
      .messages({
        'number.base': 'El valor debe ser un número',
        'number.positive': 'El valor debe ser mayor a 0'
      }),
    moneda: Joi.string()
      .max(10)
      .default('ARS')
      .optional()
      .messages({
        'string.max': 'La moneda no puede tener más de 10 caracteres'
      }),
    tipo_operacion: Joi.string()
      .optional()
      .allow(''),
    publicacion_web: Joi.string()
      .valid('true', 'false')
      .default('false')
      .optional()
      .messages({
        'any.only': 'publicacion_web debe ser "true" o "false"'
      }),
    publicacion_api_call: Joi.string()
      .valid('true', 'false')
      .default('false')
      .optional()
      .messages({
        'any.only': 'publicacion_api_call debe ser "true" o "false"'
      }),
    fecha_ingreso: Joi.date()
      .optional()
      .messages({
        'date.base': 'fecha_ingreso debe ser una fecha válida'
      }),
    observaciones: Joi.string()
      .max(1000)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Las observaciones no pueden tener más de 1000 caracteres'
      })
  }),

  // Validación para actualizar vehículo (todos los campos opcionales)
  update: Joi.object({
    // Referencia al modelo
    modelo_id: Joi.string()
      .uuid()
      .optional()
      .messages({
        'string.guid': 'El modelo_id debe ser un UUID válido'
      }),
    
    // Información específica del vehículo
    vehiculo_ano: Joi.number()
      .integer()
      .min(1950)
      .max(new Date().getFullYear() + 1)
      .optional()
      .messages({
        'number.base': 'El año del vehículo debe ser un número',
        'number.integer': 'El año del vehículo debe ser un número entero',
        'number.min': 'El año del vehículo debe ser mayor a 1950',
        'number.max': 'El año del vehículo no puede ser mayor al próximo año'
      }),
    
    // Estado del vehículo
    estado_codigo: Joi.string()
      .valid('salon', 'consignacion', 'pyc', 'preparacion', 'vendido', 'entregado')
      .optional()
      .messages({
        'any.only': 'El estado debe ser: salon, consignacion, pyc, preparacion, vendido, entregado'
      }),
    estado_id: Joi.string()
      .uuid()
      .optional()
      .messages({
        'string.guid': 'El estado_id debe ser un UUID válido'
      }),
    
    // Información comercial y específica
    patente: Joi.string()
      .max(15)
      .optional()
      .allow('')
      .messages({
        'string.max': 'La patente no puede tener más de 15 caracteres'
      }),
    kilometros: Joi.number()
      .integer()
      .min(0)
      .optional()
      .messages({
        'number.base': 'Los kilómetros deben ser un número',
        'number.integer': 'Los kilómetros deben ser un número entero',
        'number.min': 'Los kilómetros no pueden ser negativos'
      }),
    valor: Joi.number()
      .positive()
      .precision(2)
      .optional()
      .messages({
        'number.base': 'El valor debe ser un número',
        'number.positive': 'El valor debe ser mayor a 0'
      }),
    moneda: Joi.string()
      .max(10)
      .optional()
      .messages({
        'string.max': 'La moneda no puede tener más de 10 caracteres'
      }),
    tipo_operacion: Joi.string()
      .optional()
      .allow(''),
    publicacion_web: Joi.string()
      .valid('true', 'false')
      .optional()
      .messages({
        'any.only': 'publicacion_web debe ser "true" o "false"'
      }),
    publicacion_api_call: Joi.string()
      .valid('true', 'false')
      .optional()
      .messages({
        'any.only': 'publicacion_api_call debe ser "true" o "false"'
      }),
    fecha_ingreso: Joi.date()
      .optional()
      .messages({
        'date.base': 'fecha_ingreso debe ser una fecha válida'
      }),
    observaciones: Joi.string()
      .max(1000)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Las observaciones no pueden tener más de 1000 caracteres'
      })
  }).min(1).messages({
    'object.min': 'Debes proporcionar al menos un campo para actualizar'
  })
};

// Validación para query parameters de filtros
const filterValidation = {
  vehiculos: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .optional(),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(12)
      .optional(),
    marca: Joi.string()
      .max(50)
      .optional()
      .allow(''),
    modelo: Joi.string()
      .max(50)
      .optional()
      .allow(''),
    estado_codigo: Joi.string()
      .valid('salon', 'consignacion', 'pyc', 'preparacion', 'vendido', 'entregado')
      .optional()
      .allow(''),
    yearFrom: Joi.number()
      .integer()
      .min(1950)
      .max(new Date().getFullYear() + 1)
      .optional(),
    yearTo: Joi.number()
      .integer()
      .min(1950)
      .max(new Date().getFullYear() + 1)
      .optional(),
    priceFrom: Joi.number()
      .positive()
      .optional(),
    priceTo: Joi.number()
      .positive()
      .optional(),
    search: Joi.string()
      .max(100)
      .optional()
      .allow(''),
    orderBy: Joi.string()
      .valid('created_at', 'valor', 'vehiculo_ano', 'kilometros', 'marca', 'modelo')
      .default('created_at')
      .optional(),
    order: Joi.string()
      .valid('asc', 'desc')
      .default('desc')
      .optional()
  }).custom((value, helpers) => {
    // Validar que yearFrom no sea mayor que yearTo
    if (value.yearFrom && value.yearTo && value.yearFrom > value.yearTo) {
      return helpers.error('any.invalid', { message: 'El año inicial no puede ser mayor al año final' });
    }
    
    // Validar que priceFrom no sea mayor que priceTo
    if (value.priceFrom && value.priceTo && value.priceFrom > value.priceTo) {
      return helpers.error('any.invalid', { message: 'El precio inicial no puede ser mayor al precio final' });
    }
    
    return value;
  })
};

// Función helper para validar datos
function validateData(schema, data) {
  const { error, value } = schema.validate(data, { 
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });
  
  if (error) {
    throw error;
  }
  
  return value;
}

// Función para validar ID de parámetros de ruta
function validateId(id) {
  const schema = Joi.string().uuid().required().messages({
    'string.guid': 'El ID debe ser un UUID válido',
    'any.required': 'El ID es requerido'
  });
  
  return validateData(schema, id);
}

// Middleware de validación para Express
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[property];
      const validatedData = validateData(schema, dataToValidate);
      req[property] = validatedData;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  authValidation,
  vehiculoValidation,
  filterValidation,
  validateData,
  validateId,
  validate
};