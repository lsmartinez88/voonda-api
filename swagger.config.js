const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Voonda API',
      version: '1.0.0',
      description: 'API completa para gestión de vehículos con autenticación JWT y sistema multi-empresa',
      contact: {
        name: 'Voonda Team',
        email: 'support@voonda.com',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.fratelli.voonda.net' 
          : 'http://localhost:3001',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtenido del endpoint /api/auth/login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            nombre: { type: 'string' },
            apellido: { type: 'string' },
            telefono: { type: 'string', nullable: true },
            empresa: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nombre: { type: 'string' },
                descripcion: { type: 'string', nullable: true },
                logo_url: { type: 'string', nullable: true },
                activa: { type: 'boolean' }
              }
            },
            rol: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                nombre: { type: 'string' },
                descripcion: { type: 'string' },
                permisos: { type: 'object' }
              }
            },
            ultimo_login: { type: 'string', format: 'date-time', nullable: true },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Vehiculo: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            empresa_id: { type: 'string', format: 'uuid' },
            modelo_id: { type: 'string', format: 'uuid' },
            patente: { type: 'string', nullable: true, maxLength: 15 },
            vehiculo_ano: { type: 'number', minimum: 1950 },
            kilometros: { type: 'number', minimum: 0 },
            valor: { type: 'string', nullable: true },
            moneda: { type: 'string', maxLength: 10 },
            tipo_operacion: { type: 'string', nullable: true },
            publicacion_web: { type: 'string', enum: ['true', 'false'] },
            publicacion_api_call: { type: 'string', enum: ['true', 'false'] },
            fecha_ingreso: { type: 'string', format: 'date-time', nullable: true },
            observaciones: { type: 'string', nullable: true, maxLength: 1000 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            modelo_auto: {
              type: 'object',
              properties: {
                marca: { type: 'string' },
                modelo: { type: 'string' },
                modelo_ano: { type: 'number' },
                combustible: { type: 'string' },
                caja: { type: 'string' },
                version: { type: 'string', nullable: true },
                motorizacion: { type: 'string', nullable: true },
                traccion: { type: 'string', nullable: true },
                puertas: { type: 'number', nullable: true },
                segmento_modelo: { type: 'string', nullable: true },
                cilindrada: { type: 'number', nullable: true },
                potencia_hp: { type: 'number', nullable: true },
                torque_nm: { type: 'number', nullable: true }
              }
            },
            estado: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                codigo: { type: 'string', enum: ['salon', 'consignacion', 'pyc', 'preparacion', 'vendido', 'entregado'] },
                nombre: { type: 'string' },
                descripcion: { type: 'string' }
              }
            }
          }
        },
        EstadoVehiculo: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            codigo: { type: 'string', enum: ['salon', 'consignacion', 'pyc', 'preparacion', 'vendido', 'entregado'] },
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Empresa: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string' },
            descripcion: { type: 'string', nullable: true },
            logo_url: { type: 'string', nullable: true },
            activa: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
            message: { type: 'string' },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' }
          }
        },
        VehiculoRequest: {
          type: 'object',
          required: ['modelo_id', 'vehiculo_ano'],
          properties: {
            modelo_id: { type: 'string', format: 'uuid' },
            vehiculo_ano: { type: 'number', minimum: 1950 },
            estado_codigo: { type: 'string', enum: ['salon', 'consignacion', 'pyc', 'preparacion', 'vendido', 'entregado'] },
            estado_id: { type: 'string', format: 'uuid' },
            patente: { type: 'string', maxLength: 15 },
            kilometros: { type: 'number', minimum: 0 },
            valor: { type: 'number', minimum: 0 },
            moneda: { type: 'string', maxLength: 10 },
            tipo_operacion: { type: 'string' },
            publicacion_web: { type: 'string', enum: ['true', 'false'] },
            publicacion_api_call: { type: 'string', enum: ['true', 'false'] },
            fecha_ingreso: { type: 'string', format: 'date-time' },
            observaciones: { type: 'string', maxLength: 1000 }
          }
        },
        PaginatedVehiculos: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            vehiculos: {
              type: 'array',
              items: { $ref: '#/components/schemas/Vehiculo' }
            },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                pages: { type: 'number' }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js', './server.js']
};

const specs = swaggerJsdoc(options);
module.exports = specs;