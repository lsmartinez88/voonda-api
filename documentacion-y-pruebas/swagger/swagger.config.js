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
    tags: [
      {
        name: 'Autenticación',
        description: 'Endpoints de autenticación y gestión de sesiones'
      },
      {
        name: 'Vehículos',
        description: 'Gestión completa de vehículos del inventario'
      },
      {
        name: 'Vendedores',
        description: 'Gestión de vendedores (personas que venden vehículos a la empresa)'
      },
      {
        name: 'Compradores',
        description: 'Gestión de compradores (personas que compran vehículos de la empresa)'
      },
      {
        name: 'Operaciones',
        description: 'Sistema unificado de operaciones de compra y venta'
      },
      {
        name: 'Imágenes',
        description: 'Gestión de imágenes de vehículos'
      },
      {
        name: 'Estados',
        description: 'Estados disponibles para vehículos'
      },
      {
        name: 'Empresas',
        description: 'Gestión de empresas (solo admin general)'
      }
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
            estado_id: { type: 'string', format: 'uuid', nullable: true },
            tipo_operacion: { type: 'string', nullable: true },
            fecha_ingreso: { type: 'string', format: 'date-time', nullable: true },
            observaciones: { type: 'string', nullable: true, maxLength: 1000 },
            pendientes_preparacion: { 
              type: 'array', 
              items: { type: 'string' }, 
              nullable: true,
              description: 'Lista de tareas pendientes de preparación'
            },
            comentarios: { type: 'string', nullable: true, maxLength: 2000 },
            vendedor_id: { type: 'string', format: 'uuid', nullable: true },
            comprador_id: { type: 'string', format: 'uuid', nullable: true },
            activo: { type: 'boolean', default: true },
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
                equipamiento: { 
                  type: 'array', 
                  items: { type: 'string' }, 
                  nullable: true,
                  description: 'Lista de equipamiento del modelo'
                },
                asistencias_manejo: { 
                  type: 'array', 
                  items: { type: 'string' }, 
                  nullable: true,
                  description: 'Lista de asistencias de manejo'
                },
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
              nullable: true,
              properties: {
                id: { type: 'string', format: 'uuid' },
                codigo: { type: 'string', enum: ['salon', 'consignacion', 'pyc', 'preparacion', 'vendido', 'entregado'] },
                nombre: { type: 'string' },
                descripcion: { type: 'string' }
              }
            },
            vendedor: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'string', format: 'uuid' },
                nombre: { type: 'string' },
                apellido: { type: 'string', nullable: true },
                telefono: { type: 'string', nullable: true },
                email: { type: 'string', nullable: true }
              }
            },
            comprador: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'string', format: 'uuid' },
                nombre: { type: 'string' },
                apellido: { type: 'string', nullable: true },
                telefono: { type: 'string', nullable: true },
                email: { type: 'string', nullable: true }
              }
            },
            imagenes: {
              type: 'array',
              items: { $ref: '#/components/schemas/ImagenVehiculo' },
              description: 'Lista de imágenes del vehículo'
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
        Vendedor: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            empresa_id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string' },
            apellido: { type: 'string', nullable: true },
            telefono: { type: 'string', nullable: true },
            email: { type: 'string', nullable: true },
            dni: { type: 'string', nullable: true },
            direccion: { type: 'string', nullable: true },
            ciudad: { type: 'string', nullable: true },
            provincia: { type: 'string', nullable: true },
            codigo_postal: { type: 'string', nullable: true },
            origen: { type: 'string', nullable: true },
            comentarios: { type: 'string', nullable: true },
            activo: { type: 'boolean', default: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Comprador: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            empresa_id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string' },
            apellido: { type: 'string', nullable: true },
            telefono: { type: 'string', nullable: true },
            email: { type: 'string', nullable: true },
            dni: { type: 'string', nullable: true },
            direccion: { type: 'string', nullable: true },
            ciudad: { type: 'string', nullable: true },
            provincia: { type: 'string', nullable: true },
            codigo_postal: { type: 'string', nullable: true },
            origen: { type: 'string', nullable: true },
            comentarios: { type: 'string', nullable: true },
            activo: { type: 'boolean', default: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Operacion: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            empresa_id: { type: 'string', format: 'uuid' },
            vehiculo_id: { type: 'string', format: 'uuid' },
            vendedor_id: { 
              type: 'string', 
              format: 'uuid', 
              nullable: true,
              description: 'ID del vendedor (solo para operaciones de compra)'
            },
            comprador_id: { 
              type: 'string', 
              format: 'uuid', 
              nullable: true,
              description: 'ID del comprador (solo para operaciones de venta)'
            },
            tipo_operacion: { 
              type: 'string', 
              enum: ['compra', 'venta'],
              description: 'Tipo de operación'
            },
            precio: { type: 'string', description: 'Precio de la operación' },
            moneda: { type: 'string', default: 'ARS' },
            fecha_operacion: { type: 'string', format: 'date' },
            estado: { 
              type: 'string', 
              enum: ['pendiente', 'completada', 'cancelada'],
              default: 'pendiente'
            },
            metodo_pago: { type: 'string', nullable: true },
            observaciones: { type: 'string', nullable: true },
            documentos_pendientes: { 
              type: 'array', 
              items: { type: 'string' }, 
              nullable: true,
              description: 'Lista de documentos pendientes'
            },
            activo: { type: 'boolean', default: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Imagen: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nombre: { type: 'string', maxLength: 200 },
            url: { type: 'string', description: 'URL de la imagen' },
            tipo: { 
              type: 'string',
              enum: ['vehiculo', 'perfil', 'documento', 'logo', 'banner', 'otro'],
              description: 'Tipo de imagen'
            },
            descripcion: { type: 'string', nullable: true },
            tamaño: { type: 'integer', nullable: true, description: 'Tamaño en bytes' },
            formato: { 
              type: 'string', 
              nullable: true, 
              enum: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'webp'],
              description: 'Formato de la imagen'
            },
            activo: { type: 'boolean', default: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        ImagenVehiculo: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            vehiculo_id: { type: 'string', format: 'uuid' },
            url: { type: 'string', description: 'URL de la imagen' },
            descripcion: { type: 'string', nullable: true },
            orden: { type: 'integer', minimum: 1 },
            es_principal: { type: 'boolean', default: false },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        PublicacionVehiculo: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            vehiculo_id: { type: 'string', format: 'uuid' },
            plataforma: { 
              type: 'string', 
              enum: ['facebook', 'web', 'mercadolibre', 'instagram', 'whatsapp', 'olx', 'autocosmos', 'otro']
            },
            url_publicacion: { type: 'string', nullable: true },
            id_publicacion: { type: 'string', nullable: true },
            titulo: { type: 'string', maxLength: 200 },
            ficha_breve: { type: 'string', nullable: true, maxLength: 1000 },
            activo: { type: 'boolean', default: true },
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
          required: ['marca', 'modelo', 'version', 'vehiculo_ano', 'vendedor_nombre', 'vendedor_apellido', 'vendedor_telefono', 'vendedor_email'],
          properties: {
            // INFORMACIÓN DEL MODELO (OBLIGATORIO - se verifica/crea en modelo_autos)
            marca: { 
              type: 'string', 
              minLength: 2,
              maxLength: 50,
              description: 'Marca del vehículo (se verifica/crea automáticamente en modelo_autos)',
              example: 'Toyota'
            },
            modelo: { 
              type: 'string', 
              minLength: 1,
              maxLength: 50,
              description: 'Modelo del vehículo (se verifica/crea automáticamente en modelo_autos)',
              example: 'Corolla'
            },
            version: { 
              type: 'string', 
              minLength: 1,
              maxLength: 50,
              description: 'Versión del modelo (se verifica/crea automáticamente en modelo_autos)',
              example: 'XEI'
            },
            vehiculo_ano: { 
              type: 'number', 
              minimum: 1950,
              description: 'Año del vehículo',
              example: 2023
            },
            // INFORMACIÓN DEL VENDEDOR (OBLIGATORIO - se crea/reutiliza automáticamente)
            vendedor_nombre: { 
              type: 'string', 
              minLength: 2,
              maxLength: 50,
              description: 'Nombre del vendedor (se crea/reutiliza vendedor automáticamente)',
              example: 'Juan'
            },
            vendedor_apellido: { 
              type: 'string', 
              minLength: 2,
              maxLength: 50,
              description: 'Apellido del vendedor',
              example: 'Pérez'
            },
            vendedor_telefono: { 
              type: 'string', 
              minLength: 8,
              maxLength: 20,
              description: 'Teléfono del vendedor',
              example: '+54 9 11 1234-5678'
            },
            vendedor_email: { 
              type: 'string', 
              format: 'email',
              maxLength: 100,
              description: 'Email del vendedor (identificador único por empresa)',
              example: 'juan.perez@email.com'
            },
            // INFORMACIÓN ADICIONAL DEL VENDEDOR (OPCIONAL)
            vendedor_dni: { 
              type: 'string', 
              maxLength: 20,
              description: 'DNI del vendedor',
              example: '12345678'
            },
            vendedor_direccion: { 
              type: 'string', 
              maxLength: 200,
              description: 'Dirección del vendedor',
              example: 'Av. Corrientes 1234, CABA'
            },
            vendedor_observaciones: { 
              type: 'string', 
              maxLength: 500,
              description: 'Observaciones sobre el vendedor',
              example: 'Vendedor confiable'
            },
            // INFORMACIÓN DEL VEHÍCULO (OPCIONAL)
            estado_codigo: { 
              type: 'string', 
              enum: ['disponible', 'salon', 'consignacion', 'pyc', 'preparacion', 'vendido', 'entregado'],
              default: 'disponible',
              description: 'Estado del vehículo (por defecto DISPONIBLE)'
            },
            patente: { type: 'string', maxLength: 15, example: 'ABC123' },
            kilometros: { type: 'number', minimum: 0, default: 0, example: 15000 },
            valor: { type: 'number', minimum: 0, example: 2500000 },
            moneda: { type: 'string', maxLength: 10, default: 'ARS', example: 'ARS' },
            tipo_operacion: { type: 'string', example: 'Venta' },
            fecha_ingreso: { type: 'string', format: 'date-time' },
            observaciones: { type: 'string', maxLength: 1000 },
            pendientes_preparacion: { 
              oneOf: [
                {
                  type: 'array',
                  items: {
                    type: 'string',
                    maxLength: 500
                  },
                  description: 'Array de pendientes de preparación',
                  example: ['Revisión mecánica', 'Limpieza completa', 'Documentos']
                },
                {
                  type: 'string',
                  maxLength: 2000,
                  description: 'String con pendientes separados por saltos de línea (\\n)',
                  example: 'Revisión mecánica\\nLimpieza completa\\nDocumentos'
                }
              ],
              description: 'Pendientes de preparación. Acepta array de strings o string multilínea con \\n'
            },
            comentarios: { type: 'string', maxLength: 2000 },
            publicacion_web: { type: 'string', enum: ['true', 'false'], default: 'false' },
            publicacion_api_call: { type: 'string', enum: ['true', 'false'], default: 'false' },
            // Array de publicaciones
            publicaciones: {
              type: 'array',
              description: 'Array de publicaciones a crear junto con el vehículo',
              items: {
                type: 'object',
                required: ['plataforma', 'titulo'],
                properties: {
                  plataforma: {
                    type: 'string',
                    enum: ['facebook', 'web', 'mercadolibre', 'instagram', 'whatsapp', 'olx', 'autocosmos', 'otro'],
                    description: 'Plataforma donde se publicará'
                  },
                  titulo: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 200,
                    description: 'Título de la publicación'
                  },
                  url_publicacion: {
                    type: 'string',
                    format: 'uri',
                    description: 'URL de la publicación (opcional)'
                  },
                  id_publicacion: {
                    type: 'string',
                    maxLength: 100,
                    description: 'ID interno de la publicación en la plataforma (opcional)'
                  },
                  ficha_breve: {
                    type: 'string',
                    maxLength: 1000,
                    description: 'Descripción breve de la publicación (opcional)'
                  },
                  activo: {
                    type: 'boolean',
                    default: true,
                    description: 'Si la publicación está activa'
                  }
                }
              },
              example: [
                {
                  plataforma: 'web',
                  titulo: 'Toyota Corolla XEI 2023 - Impecable',
                  ficha_breve: 'Vehículo en excelente estado, único dueño'
                },
                {
                  plataforma: 'facebook',
                  titulo: 'Toyota Corolla XEI 2023',
                  url_publicacion: 'https://facebook.com/marketplace/item/123',
                  id_publicacion: 'fb_123456'
                }
              ]
            }
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
        },
        PaginatedVendedores: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            vendedores: {
              type: 'array',
              items: { $ref: '#/components/schemas/Vendedor' }
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
        },
        PaginatedCompradores: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            compradores: {
              type: 'array',
              items: { $ref: '#/components/schemas/Comprador' }
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
        },
        PaginatedOperaciones: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            operaciones: {
              type: 'array',
              items: { $ref: '#/components/schemas/Operacion' }
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