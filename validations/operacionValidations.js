/**
 * Validaciones para operaciones usando Joi
 * Sistema genérico para múltiples tipos de operaciones
 */

const Joi = require('joi');

// Schema base común para todas las operaciones
const baseOperacionSchema = {
  tipo: Joi.string()
    .valid('compra', 'venta', 'seña', 'transferencia', 'ingreso', 'entrega', 'devolucion')
    .required()
    .messages({
      'any.only': 'El tipo debe ser uno de: compra, venta, seña, transferencia, ingreso, entrega, devolucion',
      'any.required': 'El tipo de operación es requerido'
    }),

  fecha: Joi.date()
    .required()
    .messages({
      'date.base': 'La fecha debe ser válida',
      'any.required': 'La fecha es requerida'
    }),

  monto: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': 'El monto debe ser un número',
      'number.positive': 'El monto debe ser positivo',
      'any.required': 'El monto es requerido'
    }),

  moneda: Joi.string()
    .valid('ARS', 'USD', 'EUR', 'BRL')
    .default('ARS')
    .messages({
      'any.only': 'La moneda debe ser ARS, USD, EUR o BRL'
    }),

  estado: Joi.string()
    .valid('pendiente', 'en_proceso', 'completada', 'cancelada', 'suspendida')
    .default('pendiente')
    .messages({
      'any.only': 'El estado debe ser: pendiente, en_proceso, completada, cancelada, suspendida'
    }),

  vehiculo_id: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.uuid': 'ID de vehículo debe ser un UUID válido',
      'any.required': 'El vehículo es requerido'
    }),

  vendedor_id: Joi.string()
    .uuid()
    .allow(null)
    .messages({
      'string.uuid': 'ID de vendedor debe ser un UUID válido'
    }),

  comprador_id: Joi.string()
    .uuid()
    .allow(null)
    .messages({
      'string.uuid': 'ID de comprador debe ser un UUID válido'
    }),

  observaciones: Joi.string()
    .max(1000)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Las observaciones no pueden exceder 1000 caracteres'
    }),

  empresa_id: Joi.string()
    .uuid()
    .optional()
    .messages({
      'string.uuid': 'ID de empresa debe ser un UUID válido'
    })
};

// Schemas específicos para datos_especificos según tipo de operación
const compraDataSchema = Joi.object({
  forma_pago: Joi.string().valid('efectivo', 'transferencia', 'cheque', 'financiado').optional(),
  descuento_aplicado: Joi.number().min(0).max(100).optional(),
  garantia_meses: Joi.number().integer().min(0).optional(),
  documentacion_completa: Joi.boolean().optional(),
  precio_final: Joi.number().positive().optional()
});

const ventaDataSchema = Joi.object({
  comision_vendedor: Joi.number().min(0).optional(),
  precio_lista: Joi.number().positive().optional(),
  descuento_otorgado: Joi.number().min(0).optional(),
  forma_entrega: Joi.string().valid('inmediata', 'programada', 'envio').optional(),
  fecha_entrega: Joi.date().optional(),
  documentos_transferidos: Joi.boolean().optional()
});

const senaDataSchema = Joi.object({
  monto_total_acordado: Joi.number().positive().optional(),
  saldo_pendiente: Joi.number().min(0).optional(),
  fecha_vencimiento: Joi.date().optional(),
  condiciones_especiales: Joi.string().max(500).optional()
});

const transferenciaDataSchema = Joi.object({
  banco_origen: Joi.string().max(100).optional(),
  banco_destino: Joi.string().max(100).optional(),
  numero_operacion: Joi.string().max(100).optional(),
  comprobante_url: Joi.string().uri().optional()
});

const ingresoDataSchema = Joi.object({
  origen: Joi.string().max(200).optional(),
  estado_ingreso: Joi.string().valid('nuevo', 'usado', 'reparacion').optional(),
  documentacion_recibida: Joi.boolean().optional(),
  valuacion_inicial: Joi.number().positive().optional()
});

const entregaDataSchema = Joi.object({
  receptor_nombre: Joi.string().max(100).optional(),
  receptor_dni: Joi.string().max(20).optional(),
  lugar_entrega: Joi.string().max(200).optional(),
  hora_entrega: Joi.date().optional(),
  confirmacion_entrega: Joi.boolean().optional()
});

const devolucionDataSchema = Joi.object({
  motivo: Joi.string().max(500).optional(),
  estado_vehiculo: Joi.string().valid('perfecto', 'bueno', 'dañado').optional(),
  monto_reembolso: Joi.number().min(0).optional(),
  fecha_devolucion: Joi.date().optional()
});

// Función para validar datos_especificos según tipo
const validateDatosEspecificos = (tipo, datos) => {
  if (!datos) return { value: {}, error: null };

  const schemaMap = {
    compra: compraDataSchema,
    venta: ventaDataSchema,
    seña: senaDataSchema,
    transferencia: transferenciaDataSchema,
    ingreso: ingresoDataSchema,
    entrega: entregaDataSchema,
    devolucion: devolucionDataSchema
  };

  const schema = schemaMap[tipo];
  if (!schema) {
    return { value: datos, error: null }; // Permitir datos libres para tipos no definidos
  }

  return schema.validate(datos);
};

// Schema principal para crear operación
const createOperacionSchema = Joi.object({
  ...baseOperacionSchema,
  datos_especificos: Joi.object().optional()
}).custom((value, helpers) => {
  // Validar datos_especificos según el tipo
  const { tipo, datos_especificos } = value;
  const { error } = validateDatosEspecificos(tipo, datos_especificos);
  
  if (error) {
    return helpers.error('custom.datos_especificos', { details: error.details });
  }
  
  return value;
}).messages({
  'custom.datos_especificos': 'Error en datos específicos: {{#details}}'
});

// Schema para actualizar operación (campos opcionales)
const updateOperacionSchema = Joi.object({
  tipo: Joi.string()
    .valid('compra', 'venta', 'seña', 'transferencia', 'ingreso', 'entrega', 'devolucion')
    .optional(),
  
  fecha: Joi.date().optional(),
  
  monto: Joi.number()
    .positive()
    .precision(2)
    .optional(),
  
  moneda: Joi.string()
    .valid('ARS', 'USD', 'EUR', 'BRL')
    .optional(),
  
  estado: Joi.string()
    .valid('pendiente', 'en_proceso', 'completada', 'cancelada', 'suspendida')
    .optional(),
  
  vehiculo_id: Joi.string()
    .uuid()
    .optional(),
  
  vendedor_id: Joi.string()
    .uuid()
    .allow(null)
    .optional(),
  
  comprador_id: Joi.string()
    .uuid()
    .allow(null)
    .optional(),
  
  observaciones: Joi.string()
    .max(1000)
    .allow('')
    .optional(),
  
  datos_especificos: Joi.object().optional()
}).min(1).messages({
  'object.min': 'Se requiere al menos un campo para actualizar'
}).custom((value, helpers) => {
  // Si se actualiza el tipo, validar datos_especificos
  if (value.tipo && value.datos_especificos) {
    const { error } = validateDatosEspecificos(value.tipo, value.datos_especificos);
    if (error) {
      return helpers.error('custom.datos_especificos', { details: error.details });
    }
  }
  
  return value;
});

// Schema para filtros de búsqueda
const filtrosOperacionSchema = Joi.object({
  tipo: Joi.string()
    .valid('compra', 'venta', 'seña', 'transferencia', 'ingreso', 'entrega', 'devolucion')
    .optional(),
  
  estado: Joi.string()
    .valid('pendiente', 'en_proceso', 'completada', 'cancelada', 'suspendida')
    .optional(),
  
  fecha_desde: Joi.date().optional(),
  fecha_hasta: Joi.date().optional(),
  
  vehiculo_id: Joi.string().uuid().optional(),
  vendedor_id: Joi.string().uuid().optional(),
  comprador_id: Joi.string().uuid().optional(),
  
  search: Joi.string().max(100).optional(),
  
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
  orderBy: Joi.string().valid('fecha', 'monto', 'tipo', 'estado', 'created_at').default('fecha'),
  order: Joi.string().valid('asc', 'desc').default('desc')
}).custom((value, helpers) => {
  // Validar que fecha_hasta sea mayor que fecha_desde
  if (value.fecha_desde && value.fecha_hasta) {
    if (value.fecha_hasta < value.fecha_desde) {
      return helpers.error('custom.fechas');
    }
  }
  
  return value;
}).messages({
  'custom.fechas': 'La fecha hasta debe ser mayor que la fecha desde'
});

// Middleware de validación
const validateCreateOperacion = (req, res, next) => {
  const { error, value } = createOperacionSchema.validate(req.body, { 
    abortEarly: false,
    allowUnknown: false
  });
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'Error de validación',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.body = value;
  next();
};

const validateUpdateOperacion = (req, res, next) => {
  const { error, value } = updateOperacionSchema.validate(req.body, { 
    abortEarly: false,
    allowUnknown: false
  });
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'Error de validación',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.body = value;
  next();
};

const validateFiltrosOperacion = (req, res, next) => {
  const { error, value } = filtrosOperacionSchema.validate(req.query, { 
    abortEarly: false,
    allowUnknown: false
  });
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'Error en filtros de búsqueda',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  req.query = value;
  next();
};

module.exports = {
  validateCreateOperacion,
  validateUpdateOperacion,
  validateFiltrosOperacion,
  createOperacionSchema,
  updateOperacionSchema,
  filtrosOperacionSchema
};