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
      }),
    
    // Nuevos campos agregados
    pendientes_preparacion: Joi.string()
      .max(2000)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Los pendientes de preparación no pueden tener más de 2000 caracteres'
      }),
    comentarios: Joi.string()
      .max(2000)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Los comentarios no pueden tener más de 2000 caracteres'
      }),
    vendedor_id: Joi.string()
      .uuid()
      .optional()
      .messages({
        'string.guid': 'El vendedor_id debe ser un UUID válido'
      }),
    comprador_id: Joi.string()
      .uuid()
      .optional()
      .messages({
        'string.guid': 'El comprador_id debe ser un UUID válido'
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
      }),
    
    // Nuevos campos agregados
    pendientes_preparacion: Joi.string()
      .max(2000)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Los pendientes de preparación no pueden tener más de 2000 caracteres'
      }),
    comentarios: Joi.string()
      .max(2000)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Los comentarios no pueden tener más de 2000 caracteres'
      }),
    vendedor_id: Joi.string()
      .uuid()
      .optional()
      .allow(null)
      .messages({
        'string.guid': 'El vendedor_id debe ser un UUID válido'
      }),
    comprador_id: Joi.string()
      .uuid()
      .optional()
      .allow(null)
      .messages({
        'string.guid': 'El comprador_id debe ser un UUID válido'
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
      .optional(),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
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
      .optional(),
    order: Joi.string()
      .valid('asc', 'desc')
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
  })
};

// Esquemas de validación para vendedores
const vendedorValidation = {
  // Validación para crear vendedor
  create: Joi.object({
    nombre: Joi.string()
      .min(2)
      .max(200)
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 200 caracteres',
        'any.required': 'El nombre es requerido'
      }),
    apellido: Joi.string()
      .min(2)
      .max(200)
      .allow('')
      .optional()
      .messages({
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido no puede tener más de 200 caracteres'
      }),
    telefono: Joi.string()
      .pattern(/^[+0-9\s\-()]+$/)
      .max(20)
      .allow('')
      .optional()
      .messages({
        'string.pattern.base': 'El teléfono debe contener solo números y caracteres válidos',
        'string.max': 'El teléfono no puede tener más de 20 caracteres'
      }),
    email: Joi.string()
      .email()
      .allow('')
      .optional()
      .messages({
        'string.email': 'El email debe tener un formato válido'
      }),
    dni: Joi.string()
      .max(20)
      .allow('')
      .optional()
      .messages({
        'string.max': 'El DNI no puede tener más de 20 caracteres'
      }),
    direccion: Joi.string()
      .max(500)
      .allow('')
      .optional()
      .messages({
        'string.max': 'La dirección no puede tener más de 500 caracteres'
      }),
    ciudad: Joi.string()
      .max(100)
      .allow('')
      .optional()
      .messages({
        'string.max': 'La ciudad no puede tener más de 100 caracteres'
      }),
    provincia: Joi.string()
      .max(100)
      .allow('')
      .optional()
      .messages({
        'string.max': 'La provincia no puede tener más de 100 caracteres'
      }),
    codigo_postal: Joi.string()
      .max(10)
      .allow('')
      .optional()
      .messages({
        'string.max': 'El código postal no puede tener más de 10 caracteres'
      }),
    origen: Joi.string()
      .max(200)
      .allow('')
      .optional()
      .messages({
        'string.max': 'El origen no puede tener más de 200 caracteres'
      }),
    comentarios: Joi.string()
      .max(1000)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Los comentarios no pueden tener más de 1000 caracteres'
      }),
    empresa_id: Joi.string().uuid().optional() // Solo para admin general
  }),

  // Validación para actualizar vendedor
  update: Joi.object({
    nombre: Joi.string()
      .min(2)
      .max(200)
      .optional()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 200 caracteres'
      }),
    apellido: Joi.string()
      .min(2)
      .max(200)
      .allow('')
      .optional()
      .messages({
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido no puede tener más de 200 caracteres'
      }),
    telefono: Joi.string()
      .pattern(/^[+0-9\s\-()]+$/)
      .max(20)
      .allow('')
      .optional()
      .messages({
        'string.pattern.base': 'El teléfono debe contener solo números y caracteres válidos',
        'string.max': 'El teléfono no puede tener más de 20 caracteres'
      }),
    email: Joi.string()
      .email()
      .allow('')
      .optional()
      .messages({
        'string.email': 'El email debe tener un formato válido'
      }),
    dni: Joi.string()
      .max(20)
      .allow('')
      .optional()
      .messages({
        'string.max': 'El DNI no puede tener más de 20 caracteres'
      }),
    direccion: Joi.string()
      .max(500)
      .allow('')
      .optional()
      .messages({
        'string.max': 'La dirección no puede tener más de 500 caracteres'
      }),
    ciudad: Joi.string()
      .max(100)
      .allow('')
      .optional()
      .messages({
        'string.max': 'La ciudad no puede tener más de 100 caracteres'
      }),
    provincia: Joi.string()
      .max(100)
      .allow('')
      .optional()
      .messages({
        'string.max': 'La provincia no puede tener más de 100 caracteres'
      }),
    codigo_postal: Joi.string()
      .max(10)
      .allow('')
      .optional()
      .messages({
        'string.max': 'El código postal no puede tener más de 10 caracteres'
      }),
    origen: Joi.string()
      .max(200)
      .allow('')
      .optional()
      .messages({
        'string.max': 'El origen no puede tener más de 200 caracteres'
      }),
    comentarios: Joi.string()
      .max(1000)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Los comentarios no pueden tener más de 1000 caracteres'
      }),
    activo: Joi.boolean().optional()
  })
};

// Esquemas de validación para compradores (igual que vendedores)
const compradorValidation = {
  // Validación para crear comprador
  create: Joi.object({
    nombre: Joi.string()
      .min(2)
      .max(200)
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 200 caracteres',
        'any.required': 'El nombre es requerido'
      }),
    apellido: Joi.string()
      .min(2)
      .max(200)
      .allow('')
      .optional()
      .messages({
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido no puede tener más de 200 caracteres'
      }),
    telefono: Joi.string()
      .pattern(/^[+0-9\s\-()]+$/)
      .max(20)
      .allow('')
      .optional()
      .messages({
        'string.pattern.base': 'El teléfono debe contener solo números y caracteres válidos',
        'string.max': 'El teléfono no puede tener más de 20 caracteres'
      }),
    email: Joi.string()
      .email()
      .allow('')
      .optional()
      .messages({
        'string.email': 'El email debe tener un formato válido'
      }),
    dni: Joi.string()
      .max(20)
      .allow('')
      .optional()
      .messages({
        'string.max': 'El DNI no puede tener más de 20 caracteres'
      }),
    direccion: Joi.string()
      .max(500)
      .allow('')
      .optional()
      .messages({
        'string.max': 'La dirección no puede tener más de 500 caracteres'
      }),
    ciudad: Joi.string()
      .max(100)
      .allow('')
      .optional()
      .messages({
        'string.max': 'La ciudad no puede tener más de 100 caracteres'
      }),
    provincia: Joi.string()
      .max(100)
      .allow('')
      .optional()
      .messages({
        'string.max': 'La provincia no puede tener más de 100 caracteres'
      }),
    codigo_postal: Joi.string()
      .max(10)
      .allow('')
      .optional()
      .messages({
        'string.max': 'El código postal no puede tener más de 10 caracteres'
      }),
    origen: Joi.string()
      .max(200)
      .allow('')
      .optional()
      .messages({
        'string.max': 'El origen no puede tener más de 200 caracteres'
      }),
    comentarios: Joi.string()
      .max(1000)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Los comentarios no pueden tener más de 1000 caracteres'
      }),
    empresa_id: Joi.string().uuid().optional() // Solo para admin general
  }),

  // Validación para actualizar comprador
  update: Joi.object({
    nombre: Joi.string()
      .min(2)
      .max(200)
      .optional()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede tener más de 200 caracteres'
      }),
    apellido: Joi.string()
      .min(2)
      .max(200)
      .allow('')
      .optional()
      .messages({
        'string.min': 'El apellido debe tener al menos 2 caracteres',
        'string.max': 'El apellido no puede tener más de 200 caracteres'
      }),
    telefono: Joi.string()
      .pattern(/^[+0-9\s\-()]+$/)
      .max(20)
      .allow('')
      .optional()
      .messages({
        'string.pattern.base': 'El teléfono debe contener solo números y caracteres válidos',
        'string.max': 'El teléfono no puede tener más de 20 caracteres'
      }),
    email: Joi.string()
      .email()
      .allow('')
      .optional()
      .messages({
        'string.email': 'El email debe tener un formato válido'
      }),
    dni: Joi.string()
      .max(20)
      .allow('')
      .optional()
      .messages({
        'string.max': 'El DNI no puede tener más de 20 caracteres'
      }),
    direccion: Joi.string()
      .max(500)
      .allow('')
      .optional()
      .messages({
        'string.max': 'La dirección no puede tener más de 500 caracteres'
      }),
    ciudad: Joi.string()
      .max(100)
      .allow('')
      .optional()
      .messages({
        'string.max': 'La ciudad no puede tener más de 100 caracteres'
      }),
    provincia: Joi.string()
      .max(100)
      .allow('')
      .optional()
      .messages({
        'string.max': 'La provincia no puede tener más de 100 caracteres'
      }),
    codigo_postal: Joi.string()
      .max(10)
      .allow('')
      .optional()
      .messages({
        'string.max': 'El código postal no puede tener más de 10 caracteres'
      }),
    origen: Joi.string()
      .max(200)
      .allow('')
      .optional()
      .messages({
        'string.max': 'El origen no puede tener más de 200 caracteres'
      }),
    comentarios: Joi.string()
      .max(1000)
      .allow('')
      .optional()
      .messages({
        'string.max': 'Los comentarios no pueden tener más de 1000 caracteres'
      }),
    activo: Joi.boolean().optional()
  })
};

// Esquemas de validación para imágenes de vehículos
const imagenVehiculoValidation = {
  // Validación para crear imagen
  create: Joi.object({
    url_imagen: Joi.string()
      .uri()
      .required()
      .messages({
        'string.uri': 'La URL de la imagen debe ser válida',
        'any.required': 'La URL de la imagen es requerida'
      }),
    titulo: Joi.string()
      .max(200)
      .allow('')
      .optional()
      .messages({
        'string.max': 'El título no puede tener más de 200 caracteres'
      }),
    orden: Joi.number()
      .integer()
      .min(0)
      .max(1000)
      .default(0)
      .optional()
      .messages({
        'number.base': 'El orden debe ser un número',
        'number.integer': 'El orden debe ser un número entero',
        'number.min': 'El orden debe ser mayor o igual a 0',
        'number.max': 'El orden no puede ser mayor a 1000'
      }),
    es_principal: Joi.boolean()
      .default(false)
      .optional()
  }),

  // Validación para actualizar imagen
  update: Joi.object({
    url_imagen: Joi.string()
      .uri()
      .optional()
      .messages({
        'string.uri': 'La URL de la imagen debe ser válida'
      }),
    titulo: Joi.string()
      .max(200)
      .allow('')
      .optional()
      .messages({
        'string.max': 'El título no puede tener más de 200 caracteres'
      }),
    orden: Joi.number()
      .integer()
      .min(0)
      .max(1000)
      .optional()
      .messages({
        'number.base': 'El orden debe ser un número',
        'number.integer': 'El orden debe ser un número entero',
        'number.min': 'El orden debe ser mayor o igual a 0',
        'number.max': 'El orden no puede ser mayor a 1000'
      }),
    es_principal: Joi.boolean().optional(),
    activo: Joi.boolean().optional()
  })
};

// Filtros generales para búsquedas
const filterValidationGeneral = {
  general: Joi.object({
    page: Joi.number().integer().min(1).default(1).optional(),
    limit: Joi.number().integer().min(1).max(100).default(12).optional(),
    orderBy: Joi.string().valid('created_at', 'updated_at', 'nombre').default('created_at').optional(),
    order: Joi.string().valid('asc', 'desc').default('desc').optional(),
    search: Joi.string().max(100).allow('').optional()
  })
};

// Función helper para validar datos
function validateData(schema, data) {
  const { error, value } = schema.validate(data, { 
    abortEarly: false,
    allowUnknown: true,  // Permitir parámetros adicionales
    stripUnknown: false, // No eliminar parámetros desconocidos
    convert: true        // Asegurar conversión de tipos
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
      let dataToValidate = req[property];
      
      console.log(`🔍 VALIDATION - Input ${property}:`, JSON.stringify(dataToValidate));
      
      // Si estamos validando query parameters, convertir strings a los tipos correctos
      if (property === 'query' && dataToValidate) {
        dataToValidate = { ...dataToValidate };
        
        // Convertir parámetros numéricos
        if (dataToValidate.page) dataToValidate.page = Number(dataToValidate.page);
        if (dataToValidate.limit) dataToValidate.limit = Number(dataToValidate.limit);
        if (dataToValidate.yearFrom) dataToValidate.yearFrom = Number(dataToValidate.yearFrom);
        if (dataToValidate.yearTo) dataToValidate.yearTo = Number(dataToValidate.yearTo);
        if (dataToValidate.priceFrom) dataToValidate.priceFrom = Number(dataToValidate.priceFrom);
        if (dataToValidate.priceTo) dataToValidate.priceTo = Number(dataToValidate.priceTo);
        
        console.log(`🔍 VALIDATION - After conversion:`, JSON.stringify(dataToValidate));
      }
      
      const validatedData = validateData(schema, dataToValidate);
      console.log(`🔍 VALIDATION - Output ${property}:`, JSON.stringify(validatedData));
      
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
  vendedorValidation,
  compradorValidation,
  imagenVehiculoValidation,
  filterValidation,
  filterValidationGeneral,
  validateData,
  validateId,
  validate
};