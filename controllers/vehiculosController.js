/**
 * Controller de Vehículos usando Prisma ORM
 * Migrado desde Supabase directo a Prisma para mejor manejo de tipos y relaciones
 */

const { prisma } = require('../utils/prisma');
const { validateId } = require('../utils/validations');
const { successResponse } = require('../middleware/errorHandler');
const { resolverEstadoId, getEstadoDefecto, getEstadoPorCodigo, getEstadoPorId } = require('../utils/estadoVehiculo');
const auditSystem = require('../utils/auditSystem');

/**
 * Sanitizar término de búsqueda para seguridad
 */
const sanitizeSearchTerm = (term) => {
  if (!term || typeof term !== 'string') return '';
  
  // Remover caracteres especiales peligrosos y limitar longitud
  return term
    .replace(/[<>\"'%;()&+]/g, '')
    .trim()
    .substring(0, 100);
};

/**
 * Validar parámetros de filtro y convertir tipos
 */
const validateAndTransformFilters = (filters) => {
  const errors = [];
  const transformed = { ...filters };
  
  // Validar año
  if (filters.ano) {
    const ano = parseInt(filters.ano);
    if (isNaN(ano) || ano < 1950 || ano > new Date().getFullYear() + 1) {
      errors.push('Año inválido');
    } else {
      transformed.ano = ano;
    }
  }
  
  // Validar página y límite
  if (filters.page) {
    const page = parseInt(filters.page);
    if (isNaN(page) || page < 1) {
      errors.push('Página inválida');
    } else {
      transformed.page = page;
    }
  }
  
  if (filters.limit) {
    const limit = parseInt(filters.limit);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      errors.push('Límite inválido (1-100)');
    } else {
      transformed.limit = limit;
    }
  }
  
  // Sanitizar término de búsqueda
  if (filters.search) {
    transformed.search = sanitizeSearchTerm(filters.search);
  }
  
  return { errors, transformed };
};

/**
 * Función helper para construir filtros de Prisma con soporte multi-empresa y filtros jerárquicos
 */
const buildPrismaFilters = async (filters, empresaFilter = null) => {
  const where = {};
  
  // Aplicar filtro de empresa si existe
  if (empresaFilter) {
    Object.assign(where, empresaFilter);
  }
  
  // Filtro por marca (soportar ambos formatos: marca y marcaId)
  const marcaValue = filters.marca || filters.marcaId;
  if (marcaValue) {
    where.modelo = {
      marca: marcaValue // Buscar por nombre de marca directamente
    };
  }
  
  // Filtro por modelo (soportar ambos formatos: modelo y modeloId) 
  const modeloValue = filters.modelo || filters.modeloId;
  if (modeloValue) {
    if (!where.modelo) where.modelo = {};
    // Si es UUID, buscar por ID; si no, buscar por nombre
    if (modeloValue.length === 36 && modeloValue.includes('-')) {
      where.modelo.id = modeloValue;
    } else {
      where.modelo.modelo = modeloValue; // Buscar por nombre del modelo
    }
  }
  
  // Filtro por año
  if (filters.ano) {
    where.vehiculo_ano = parseInt(filters.ano);
  }
  
  if (filters.yearFrom || filters.yearTo) {
    where.vehiculo_ano = {};
    if (filters.yearFrom) {
      where.vehiculo_ano.gte = parseInt(filters.yearFrom);
    }
    if (filters.yearTo) {
      where.vehiculo_ano.lte = parseInt(filters.yearTo);
    }
  }

  // Filtro por estado
  if (filters.estado) {
    where.estado_id = filters.estado;
  }
  
  if (filters.estado_codigo) {
    // Resolver código de estado a ID
    const estado = await getEstadoPorCodigo(filters.estado_codigo);
    if (estado) {
      where.estado_id = { equals: estado.id };
    }
  }

  if (filters.priceFrom || filters.priceTo) {
    where.valor = {};
    if (filters.priceFrom) {
      where.valor.gte = parseFloat(filters.priceFrom);
    }
    if (filters.priceTo) {
      where.valor.lte = parseFloat(filters.priceTo);
    }
  }

  // Búsqueda general mejorada: ID, marca, modelo, patente, observaciones y más
  if (filters.search) {
    const searchTerm = filters.search.trim();
    if (searchTerm) {
      // Si el término parece ser un UUID, buscar directamente por ID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(searchTerm);
      
      if (isUUID) {
        // Búsqueda directa por ID de vehículo
        where.id = searchTerm;
      } else {
        // Búsqueda general en múltiples campos
        const searchConditions = [
          // Búsqueda en marca
          {
            modelo: {
              marca: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            }
          },
          // Búsqueda en modelo
          {
            modelo: {
              modelo: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            }
          },
          // Búsqueda en versión
          {
            modelo: {
              version: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            }
          },
          // Búsqueda en patente (dominio del vehículo)
          {
            patente: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          // Búsqueda en observaciones
          {
            observaciones: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          // Búsqueda en comentarios
          {
            comentarios: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        ];

        // Si es un número, buscar también por año o kilometraje
        const numericValue = parseInt(searchTerm);
        if (!isNaN(numericValue)) {
          // Búsqueda por año si parece un año válido
          if (numericValue >= 1950 && numericValue <= new Date().getFullYear() + 1) {
            searchConditions.push({
              vehiculo_ano: numericValue
            });
          }
          
          // Búsqueda por kilometraje si es un número grande
          if (numericValue > 0) {
            searchConditions.push({
              kilometros: {
                gte: numericValue - 1000,
                lte: numericValue + 1000
              }
            });
          }
        }

        // Si es un decimal, buscar por valor
        const floatValue = parseFloat(searchTerm);
        if (!isNaN(floatValue) && searchTerm.includes('.') && floatValue > 1000) {
          searchConditions.push({
            valor: {
              gte: floatValue - 100000,
              lte: floatValue + 100000
            }
          });
        }

        where.OR = searchConditions;
      }
    }
  }

  // Solo mostrar vehículos activos por defecto
  where.activo = true;

  return where;
};

/**
 * Obtener lista de vehículos con filtros y paginación
 */
exports.getAll = async function (req, res) {
  const query = req.query || {};
  
  // Log para debug - mostrar parámetros recibidos
  console.log('🔍 GET /api/vehiculos - Parámetros recibidos:', JSON.stringify(query, null, 2));
  
  // Validar y transformar filtros
  const { errors, transformed } = validateAndTransformFilters(query);
  
  if (errors.length > 0) {
    console.log('❌ Errores de validación:', errors);
    return res.status(400).json({
      success: false,
      error: 'Parámetros inválidos',
      details: errors
    });
  }
  
  const {
    page = 1,
    limit = 12,
    orderBy = 'created_at',
    sortBy, // Compatibilidad con frontend
    order = 'desc',
    ...filters
  } = transformed;

  // Usar sortBy si está presente, sino orderBy
  const finalOrderBy = sortBy || orderBy;
  
  // Mapear nombres de campos del frontend a la base de datos
  const orderByMapping = {
    'fecha_ingreso': 'created_at',
    'created_at': 'created_at',
    'valor': 'valor',
    'vehiculo_ano': 'vehiculo_ano',
    'ano': 'vehiculo_ano',
    'kilometros': 'kilometros'
  };
  
  const mappedOrderBy = orderByMapping[finalOrderBy] || 'created_at';

  // Aplicar filtro de empresa desde middleware
  const where = await buildPrismaFilters(filters, req.empresaFilter);
  
  // Log para debug - mostrar filtros construidos
  console.log('🔍 Filtros WHERE construidos:', JSON.stringify(where, null, 2));
  
  const skip = (page - 1) * limit;

  try {
    // Ejecutar consultas en paralelo para mejor performance
    const [vehiculos, total] = await Promise.all([
      prisma.vehiculo.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [mappedOrderBy]: order },
        include: {
          modelo: {
            select: {
              id: true,
              marca: true,
              modelo: true,
              version: true,
              modelo_ano: true,
              segmento_modelo: true,
              motorizacion: true,
              combustible: true,
              caja: true,
              traccion: true,
              cilindrada: true,
              potencia_hp: true,
              torque_nm: true,
              rendimiento_mixto: true,
              equipamiento: true,
              asistencias_manejo: true
            }
          },
          estado: {
            select: {
              id: true,
              codigo: true,
              nombre: true,
              descripcion: true
            }
          },
          vendedor: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              telefono: true,
              email: true
            }
          },
          comprador: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              telefono: true,
              email: true
            }
          },
          imagenes: {
            select: {
              id: true,
              url: true,
              descripcion: true,
              orden: true,
              es_principal: true
            },
            where: { activo: true },
            orderBy: [{ es_principal: 'desc' }, { orden: 'asc' }]
          },
          publicaciones: {
            select: {
              id: true,
              plataforma: true,
              titulo: true,
              activo: true
            },
            where: { activo: true }
          }
        }
      }),
      prisma.vehiculo.count({ where })
    ]);

    const pagination = {
      total,
      page: page,
      limit: limit,
      pages: Math.ceil(total / limit)
    };

    return successResponse(res, { vehiculos, pagination }, 'Vehículos obtenidos exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener un vehículo por ID
 */
exports.getById = async function (req, res) {
  const { id } = req.params;
  
  // Validar formato del ID
  try {
    validateId(id);
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'ID inválido',
      message: 'El ID debe ser un UUID válido'
    });
  }

  try {
    // Construir filtros con empresa
    const where = { id };
    if (req.empresaFilter) {
      Object.assign(where, req.empresaFilter);
    }

    const vehiculo = await prisma.vehiculo.findFirst({
      where,
      include: {
        empresa: {
          select: {
            id: true,
            nombre: true
          }
        },
        modelo: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            version: true,
            modelo_ano: true,
            combustible: true,
            caja: true,
            motorizacion: true,
            traccion: true,
            segmento_modelo: true,
            cilindrada: true,
            potencia_hp: true,
            torque_nm: true,
            equipamiento: true,
            asistencias_manejo: true
          }
        },
        estado: {
          select: {
            id: true,
            codigo: true,
            nombre: true,
            descripcion: true
          }
        },
        vendedor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono: true,
            email: true,
            dni: true,
            direccion: true
          }
        },
        comprador: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono: true,
            email: true,
            dni: true,
            direccion: true
          }
        },
        publicaciones: {
          select: {
            id: true,
            vehiculo_id: true,
            plataforma: true,
            url_publicacion: true,
            id_publicacion: true,
            titulo: true,
            ficha_breve: true,
            activo: true,
            created_at: true,
            updated_at: true
          },
          where: { activo: true }
        },
        imagenes: {
          select: {
            id: true,
            url: true,
            descripcion: true,
            orden: true,
            es_principal: true,
            created_at: true
          },
          where: { activo: true },
          orderBy: [{ es_principal: 'desc' }, { orden: 'asc' }]
        },
        operaciones: { // CAMBIO: usar operaciones unificada
          select: {
            id: true,
            tipo: true,
            monto: true,
            fecha: true,
            estado: true,
            vendedor: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                telefono: true
              }
            },
            comprador: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                telefono: true
              }
            }
          },
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        error: 'Vehículo no encontrado',
        message: `No se encontró un vehículo con el ID: ${id} o no tienes acceso a él`
      });
    }

    return successResponse(res, { vehiculo }, 'Vehículo obtenido exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Crear nuevo vehículo
 */
exports.create = async function (req, res) {
  try {
    // Determinar empresa_id según el rol del usuario
    let empresa_id;
    if (req.user.rol.nombre === 'administrador_general') {
      // Admin general debe especificar la empresa
      empresa_id = req.body.empresa_id;
      if (!empresa_id) {
        return res.status(400).json({
          success: false,
          message: 'Debes especificar la empresa para este vehículo'
        });
      }
    } else {
      // Otros usuarios usan su empresa
      empresa_id = req.user.empresa.id;
    }

    // 1. CREAR/VERIFICAR VENDEDOR
    console.log('🧑‍💼 Creando/verificando vendedor...');
    const vendedorData = {
      empresa_id: empresa_id,
      nombre: req.body.vendedor_nombre.trim(),
      apellido: req.body.vendedor_apellido.trim(),
      telefono: req.body.vendedor_telefono.trim(),
      email: req.body.vendedor_email.trim().toLowerCase(),
      dni: req.body.vendedor_dni?.trim() || null,
      direccion: req.body.vendedor_direccion?.trim() || null,
      observaciones: req.body.vendedor_observaciones?.trim() || null,
      activo: true
    };

    // Verificar si ya existe el vendedor por email en la empresa
    let vendedor = await prisma.vendedor.findFirst({
      where: {
        email: vendedorData.email,
        empresa_id: empresa_id
      }
    });

    let vendedorCreado = false;
    if (!vendedor) {
      // Crear nuevo vendedor si no existe
      vendedor = await prisma.vendedor.create({
        data: vendedorData
      });
      vendedorCreado = true;
      console.log('✅ Vendedor creado:', vendedor.id);
    } else {
      console.log('✅ Vendedor existente encontrado:', vendedor.id);
    }

    // 2. CREAR/VERIFICAR MODELO AUTO
    console.log('🚗 Creando/verificando modelo auto...');
    const modeloData = {
      marca: req.body.marca.trim(),
      modelo: req.body.modelo.trim(),
      version: req.body.version.trim(),
      modelo_ano: req.body.vehiculo_ano
    };

    // Buscar modelo existente
    let modeloAuto = await prisma.modeloAuto.findFirst({
      where: {
        marca: modeloData.marca,
        modelo: modeloData.modelo,
        version: modeloData.version,
        modelo_ano: modeloData.modelo_ano
      }
    });

    let modeloCreado = false;
    if (!modeloAuto) {
      // Crear nuevo modelo si no existe
      modeloAuto = await prisma.modeloAuto.create({
        data: modeloData
      });
      modeloCreado = true;
      console.log('✅ Modelo auto creado:', modeloAuto.id);
    } else {
      console.log('✅ Modelo auto existente encontrado:', modeloAuto.id);
    }

    // 3. OBTENER/VALIDAR ESTADO
    console.log('🔄 Resolviendo estado del vehículo...');
    let estado_id = null;
    
    try {
      // Resolver estado desde los parámetros del usuario o usar el defecto
      estado_id = await resolverEstadoId(req.body.estado_codigo, req.body.estado_id);
      
      // Si no se especifica estado, usar el por defecto (salon)
      if (!estado_id) {
        const estadoDefecto = await getEstadoDefecto();
        estado_id = estadoDefecto.id;
        console.log('✅ Usando estado por defecto:', estadoDefecto.codigo);
      } else {
        // Obtener información del estado para mostrar en log
        const estado = await getEstadoPorId(estado_id);
        console.log('✅ Estado especificado:', estado ? estado.codigo : 'desconocido');
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Estado inválido',
        message: error.message
      });
    }

    // 4. CREAR VEHICULO
    console.log('🚙 Creando vehículo...');
    const vehiculoData = {
      empresa_id,
      modelo_id: modeloAuto.id,
      vendedor_id: vendedor.id,
      estado_id: estado_id,
      vehiculo_ano: req.body.vehiculo_ano,
      patente: req.body.patente?.trim() || null,
      kilometros: req.body.kilometros || 0,
      valor: req.body.valor || null,
      moneda: req.body.moneda || 'ARS',
      tipo_operacion: req.body.tipo_operacion?.trim() || null,
      fecha_ingreso: req.body.fecha_ingreso ? new Date(req.body.fecha_ingreso) : new Date(),
      observaciones: req.body.observaciones?.trim() || null,
      pendientes_preparacion: req.body.pendientes_preparacion ? 
        (Array.isArray(req.body.pendientes_preparacion) ? 
          req.body.pendientes_preparacion : [req.body.pendientes_preparacion.trim()]) : [],
      comentarios: req.body.comentarios?.trim() || null,
      activo: true
    };

    // Limpiar campos undefined pero preservar valores booleanos false
    Object.keys(vehiculoData).forEach(key => {
      if (vehiculoData[key] === undefined || 
          (vehiculoData[key] === '' && typeof vehiculoData[key] !== 'boolean')) {
        delete vehiculoData[key];
      }
    });

    const newVehiculo = await prisma.vehiculo.create({
      data: vehiculoData,
      include: {
        empresa: {
          select: {
            id: true,
            nombre: true,
            descripcion: true
          }
        },
        modelo: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            version: true,
            modelo_ano: true,
            segmento_modelo: true,
            motorizacion: true,
            combustible: true,
            caja: true,
            traccion: true,
            cilindrada: true,
            potencia_hp: true,
            torque_nm: true,
            rendimiento_mixto: true,
            equipamiento: true,
            asistencias_manejo: true
          }
        },
        estado: {
          select: {
            id: true,
            codigo: true,
            nombre: true,
            descripcion: true
          }
        },
        vendedor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono: true,
            email: true
          }
        },
        comprador: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono: true,
            email: true
          }
        }
      }
    });

    console.log('✅ Vehículo creado exitosamente:', newVehiculo.id);
    
    // Log de auditoría para creación de vehículo
    await auditSystem.logCreateVehiculo(req.user, newVehiculo, req);

    // 5. CREAR PUBLICACIONES si se proporcionaron
    let publicacionesCreadas = [];
    if (req.body.publicaciones && req.body.publicaciones.length > 0) {
      console.log('📢 Creando publicaciones del vehículo...');
      
      const publicacionesData = req.body.publicaciones.map(pub => ({
        vehiculo_id: newVehiculo.id,
        plataforma: pub.plataforma.trim(),
        titulo: pub.titulo.trim(),
        url_publicacion: pub.url_publicacion?.trim() || null,
        id_publicacion: pub.id_publicacion?.trim() || null,
        ficha_breve: pub.ficha_breve?.trim() || null,
        activo: pub.activo !== false // Por defecto true
      }));

      // Crear todas las publicaciones
      publicacionesCreadas = await prisma.publicacionVehiculo.createMany({
        data: publicacionesData,
        skipDuplicates: true
      });

      // Obtener las publicaciones creadas para la respuesta
      const publicacionesRespuesta = await prisma.publicacionVehiculo.findMany({
        where: {
          vehiculo_id: newVehiculo.id
        },
        select: {
          id: true,
          vehiculo_id: true,
          plataforma: true,
          url_publicacion: true,
          id_publicacion: true,
          titulo: true,
          ficha_breve: true,
          activo: true,
          created_at: true,
          updated_at: true
        }
      });

      console.log(`✅ ${publicacionesRespuesta.length} publicaciones creadas`);
      
      // Agregar las publicaciones al objeto vehículo para la respuesta
      newVehiculo.publicaciones = publicacionesRespuesta;
    }

    console.log('🎉 Vehículo y publicaciones creados exitosamente');

    return successResponse(res, { 
      vehiculo: newVehiculo,
      resumen: {
        vendedor_creado: vendedorCreado ? 'nuevo' : 'reutilizado',
        modelo_creado: modeloCreado ? 'nuevo' : 'reutilizado',
        estado_asignado: newVehiculo.estado ? newVehiculo.estado.codigo : 'desconocido',
        publicaciones_creadas: publicacionesCreadas.count || 0
      },
      publicaciones: newVehiculo.publicaciones || []
    }, 'Vehículo creado exitosamente', 201);
  } catch (error) {
    console.error('❌ Error al crear vehículo:', error);
    throw error;
  }
};

/**
 * Actualizar un vehículo
 */
exports.update = async function (req, res) {
  const { id } = req.params;
  
  // Validar formato del ID
  try {
    validateId(id);
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'ID inválido',
      message: 'El ID debe ser un UUID válido'
    });
  }

  try {
    // Verificar que el vehículo existe y pertenece a la empresa del usuario
    const where = { id };
    if (req.empresaFilter) {
      Object.assign(where, req.empresaFilter);
    }

    const existingVehiculo = await prisma.vehiculo.findFirst({
      where,
      include: {
        empresa: {
          select: {
            id: true,
            nombre: true
          }
        },
        vendedor: {
          select: {
            id: true,
            email: true
          }
        },
        modelo: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            version: true,
            modelo_ano: true
          }
        }
      }
    });
    
    if (!existingVehiculo) {
      return res.status(404).json({
        success: false,
        error: 'Vehículo no encontrado',
        message: `No se encontró un vehículo con el ID: ${id} o no tienes acceso a él`
      });
    }

    console.log('📝 Actualizando vehículo:', id);

    // Variables para rastrear cambios
    let vendedorId = existingVehiculo.vendedor_id;
    let modeloId = existingVehiculo.modelo_id;
    let resumenCambios = {
      vendedor_actualizado: false,
      modelo_actualizado: false,
      publicaciones_gestionadas: 0
    };

    // 1. ACTUALIZAR/CREAR VENDEDOR si se proporciona información del vendedor
    if (req.body.vendedor_email) {
      console.log('🧑‍💼 Verificando/actualizando vendedor...');
      
      const vendedorData = {
        empresa_id: existingVehiculo.empresa_id,
        nombre: req.body.vendedor_nombre?.trim(),
        apellido: req.body.vendedor_apellido?.trim(),
        telefono: req.body.vendedor_telefono?.trim(),
        email: req.body.vendedor_email?.trim().toLowerCase(),
        dni: req.body.vendedor_dni?.trim() || null,
        direccion: req.body.vendedor_direccion?.trim() || null,
        observaciones: req.body.vendedor_observaciones?.trim() || null,
        activo: true
      };

      // Si cambió el email, buscar o crear nuevo vendedor
      if (existingVehiculo.vendedor?.email !== vendedorData.email) {
        let vendedor = await prisma.vendedor.findFirst({
          where: {
            email: vendedorData.email,
            empresa_id: existingVehiculo.empresa_id
          }
        });

        if (!vendedor) {
          // Crear nuevo vendedor
          vendedor = await prisma.vendedor.create({
            data: vendedorData
          });
          console.log('✅ Nuevo vendedor creado:', vendedor.id);
          resumenCambios.vendedor_actualizado = 'nuevo';
        } else {
          console.log('✅ Vendedor existente encontrado:', vendedor.id);
          resumenCambios.vendedor_actualizado = 'reutilizado';
        }
        
        vendedorId = vendedor.id;
      } else if (existingVehiculo.vendedor) {
        // Actualizar datos del vendedor actual si solo cambiaron otros campos
        await prisma.vendedor.update({
          where: { id: existingVehiculo.vendedor_id },
          data: {
            ...vendedorData,
            email: existingVehiculo.vendedor.email // Mantener email original
          }
        });
        console.log('✅ Datos del vendedor actualizados');
        resumenCambios.vendedor_actualizado = 'actualizado';
      }
    }

    // 2. ACTUALIZAR/CREAR MODELO si se proporciona información del modelo
    if (req.body.marca && req.body.modelo && req.body.version && req.body.vehiculo_ano) {
      console.log('🚗 Verificando/actualizando modelo...');
      
      const modeloData = {
        marca: req.body.marca.trim(),
        modelo: req.body.modelo.trim(),
        version: req.body.version.trim(),
        modelo_ano: req.body.vehiculo_ano
      };

      // Verificar si cambió el modelo
      const modeloCambiado = (
        existingVehiculo.modelo.marca !== modeloData.marca ||
        existingVehiculo.modelo.modelo !== modeloData.modelo ||
        existingVehiculo.modelo.version !== modeloData.version ||
        existingVehiculo.modelo.modelo_ano !== modeloData.modelo_ano
      );

      if (modeloCambiado) {
        let modeloAuto = await prisma.modeloAuto.findFirst({
          where: {
            marca: modeloData.marca,
            modelo: modeloData.modelo,
            version: modeloData.version,
            modelo_ano: modeloData.modelo_ano
          }
        });

        if (!modeloAuto) {
          // Crear nuevo modelo
          modeloAuto = await prisma.modeloAuto.create({
            data: modeloData
          });
          console.log('✅ Nuevo modelo creado:', modeloAuto.id);
          resumenCambios.modelo_actualizado = 'nuevo';
        } else {
          console.log('✅ Modelo existente encontrado:', modeloAuto.id);
          resumenCambios.modelo_actualizado = 'reutilizado';
        }
        
        modeloId = modeloAuto.id;
      }
    }

    // 3. GESTIONAR PUBLICACIONES
    if (req.body.publicaciones && Array.isArray(req.body.publicaciones)) {
      console.log('📢 Gestionando publicaciones...');
      
      // Eliminar publicaciones existentes del vehículo
      await prisma.publicacionVehiculo.deleteMany({
        where: { vehiculo_id: id }
      });

      if (req.body.publicaciones.length > 0) {
        // Crear nuevas publicaciones
        const publicacionesData = req.body.publicaciones.map(pub => ({
          vehiculo_id: id,
          plataforma: pub.plataforma?.trim(),
          titulo: pub.titulo?.trim(),
          url_publicacion: pub.url_publicacion?.trim() || null,
          id_publicacion: pub.id_publicacion?.trim() || null,
          ficha_breve: pub.ficha_breve?.trim() || null,
          activo: pub.activo !== false
        })).filter(pub => pub.plataforma && pub.titulo); // Filtrar publicaciones válidas

        if (publicacionesData.length > 0) {
          await prisma.publicacionVehiculo.createMany({
            data: publicacionesData,
            skipDuplicates: true
          });
          
          console.log(`✅ ${publicacionesData.length} publicaciones actualizadas`);
          resumenCambios.publicaciones_gestionadas = publicacionesData.length;
        }
      }
    }

    // 4. RESOLVER ESTADO si se proporciona
    let estadoId = undefined;
    if (req.body.estado_codigo) {
      const estado = await prisma.estadoVehiculo.findFirst({
        where: { codigo: req.body.estado_codigo }
      });
      if (estado) {
        estadoId = estado.id;
      }
    }

    // 5. PREPARAR DATOS DE ACTUALIZACIÓN
    const updateData = {
      vendedor_id: vendedorId,
      modelo_id: modeloId,
      vehiculo_ano: req.body.vehiculo_ano || existingVehiculo.vehiculo_ano,
      patente: req.body.patente?.trim() || existingVehiculo.patente,
      kilometros: req.body.kilometros ?? existingVehiculo.kilometros,
      valor: req.body.valor ?? existingVehiculo.valor,
      moneda: req.body.moneda?.trim() || existingVehiculo.moneda,
      tipo_operacion: req.body.tipo_operacion?.trim() || existingVehiculo.tipo_operacion,
      fecha_ingreso: req.body.fecha_ingreso ? new Date(req.body.fecha_ingreso) : existingVehiculo.fecha_ingreso,
      observaciones: req.body.observaciones?.trim() ?? existingVehiculo.observaciones,
      pendientes_preparacion: req.body.pendientes_preparacion !== undefined ? 
        (Array.isArray(req.body.pendientes_preparacion) ? 
          req.body.pendientes_preparacion : 
          req.body.pendientes_preparacion === '' || req.body.pendientes_preparacion === null ? [] : [req.body.pendientes_preparacion.toString().trim()]
        ) : existingVehiculo.pendientes_preparacion,
      comentarios: req.body.comentarios?.trim() ?? existingVehiculo.comentarios
    };

    // Agregar estado si se resolvió
    if (estadoId) {
      updateData.estado_id = estadoId;
    }

    // Limpiar campos undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // 6. ACTUALIZAR VEHÍCULO
    console.log('🚙 Actualizando vehículo...');
    const updatedVehiculo = await prisma.vehiculo.update({
      where: { id },
      data: updateData,
      include: {
        modelo: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            version: true,
            modelo_ano: true,
            segmento_modelo: true,
            motorizacion: true,
            combustible: true,
            caja: true,
            traccion: true,
            cilindrada: true,
            potencia_hp: true,
            torque_nm: true,
            rendimiento_mixto: true,
            equipamiento: true,
            asistencias_manejo: true
          }
        },
        estado: {
          select: {
            id: true,
            codigo: true,
            nombre: true,
            descripcion: true
          }
        },
        vendedor: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            telefono: true,
            email: true
          }
        },
        publicaciones: {
          select: {
            id: true,
            vehiculo_id: true,
            plataforma: true,
            url_publicacion: true,
            id_publicacion: true,
            titulo: true,
            ficha_breve: true,
            activo: true,
            created_at: true,
            updated_at: true
          }
        }
      }
    });

    console.log('🎉 Vehículo actualizado exitosamente');

    // Log de auditoría para actualización de vehículo
    await auditSystem.logUpdateVehiculo(req.user, existingVehiculo, updatedVehiculo, req);

    return successResponse(res, { 
      vehiculo: updatedVehiculo,
      resumen: resumenCambios
    }, 'Vehículo actualizado exitosamente');
  } catch (error) {
    console.error('❌ Error al actualizar vehículo:', error);
    throw error;
  }
};

/**
 * Eliminar un vehículo (soft delete - marcar como inactivo)
 */
exports.delete = async function (req, res) {
  const { id } = req.params;
  
  // Validar formato del ID
  try {
    validateId(id);
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'ID inválido',
      message: 'El ID debe ser un UUID válido'
    });
  }

  try {
    // Verificar que el vehículo existe y pertenece a la empresa del usuario
    const where = { id };
    if (req.empresaFilter) {
      Object.assign(where, req.empresaFilter);
    }

    const existingVehiculo = await prisma.vehiculo.findFirst({
      where,
      include: {
        empresa: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });
    
    if (!existingVehiculo) {
      return res.status(404).json({
        success: false,
        error: 'Vehículo no encontrado',
        message: `No se encontró un vehículo con el ID: ${id} o no tienes acceso a él`
      });
    }

    // Soft delete - marcar como inactivo en lugar de eliminar
    // Para eliminar, podríamos crear un estado "eliminado" o simplemente desactivar
    await prisma.vehiculo.update({
      where: { id },
      data: { 
        activo: false
      }
    });

    // Log de auditoría para eliminación de vehículo
    await auditSystem.logDeleteVehiculo(req.user, existingVehiculo, req);

    return successResponse(res, {}, 'Vehículo eliminado exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener marcas que tienen vehículos disponibles para filtros
 */
exports.getMarcas = async function (req, res) {
  try {
    // Aplicar filtro de empresa si corresponde
    let empresaFilter = {};
    if (req.empresaFilter) {
      empresaFilter = req.empresaFilter;
    }

    // Obtener marcas que tienen vehículos activos
    const marcasData = await prisma.vehiculo.findMany({
      where: {
        activo: true,
        ...empresaFilter
      },
      select: {
        modelo: {
          select: {
            marca: true
          }
        }
      },
      distinct: ['modelo_id']
    });

    // Extraer marcas únicas y ordenar
    const marcasSet = new Set();
    marcasData.forEach(({ modelo }) => {
      if (modelo?.marca) {
        marcasSet.add(modelo.marca);
      }
    });

    const marcas = Array.from(marcasSet).sort();

    return successResponse(res, { marcas }, 'Marcas disponibles obtenidas exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener modelos por marca para filtros
 */
exports.getModelosByMarca = async function (req, res) {
  try {
    const { marcaId } = req.query;
    
    // Aplicar filtro de empresa si corresponde
    let empresaFilter = {};
    if (req.empresaFilter) {
      empresaFilter = req.empresaFilter;
    }

    // Construir filtros
    const where = {
      activo: true,
      ...empresaFilter
    };

    // Filtrar por marca si se especifica
    if (marcaId) {
      where.modelo = {
        marca: marcaId
      };
    }

    // Obtener modelos que tienen vehículos activos
    const modelosData = await prisma.vehiculo.findMany({
      where,
      select: {
        modelo: {
          select: {
            id: true,
            modelo: true,
            marca: true
          }
        }
      },
      distinct: ['modelo_id']
    });

    // Extraer modelos únicos con información de marca
    const modelosMap = new Map();
    modelosData.forEach(({ modelo }) => {
      if (modelo) {
        if (!modelosMap.has(modelo.id)) {
          modelosMap.set(modelo.id, {
            id: modelo.id,
            nombre: modelo.modelo,
            marca: modelo.marca
          });
        }
      }
    });

    const modelos = Array.from(modelosMap.values())
      .sort((a, b) => a.nombre.localeCompare(b.nombre));

    return successResponse(res, { modelos }, 'Modelos disponibles obtenidos exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener marcas con modelos y versiones para filtros
 */
exports.getMarcasModelos = async function (req, res) {
  try {
    // Aplicar filtro de empresa si corresponde
    let empresaFilter = {};
    if (req.empresaFilter) {
      empresaFilter = req.empresaFilter;
    }

    // Obtener modelos únicos con sus marcas, agrupados por marca
    const modelosData = await prisma.vehiculo.findMany({
      where: {
        activo: true,
        ...empresaFilter
      },
      select: {
        modelo: {
          select: {
            marca: true,
            modelo: true,
            version: true
          }
        }
      },
      distinct: ['modelo_id']
    });

    // Agrupar por marca -> modelo -> versiones
    const marcasMap = new Map();
    
    modelosData.forEach(({ modelo }) => {
      const { marca, modelo: nombreModelo, version } = modelo;
      
      if (!marcasMap.has(marca)) {
        marcasMap.set(marca, new Map());
      }
      
      const modelosMap = marcasMap.get(marca);
      if (!modelosMap.has(nombreModelo)) {
        modelosMap.set(nombreModelo, new Set());
      }
      
      if (version) {
        modelosMap.get(nombreModelo).add(version);
      }
    });

    // Convertir a estructura de respuesta
    const marcas = Array.from(marcasMap.entries()).map(([marca, modelosMap]) => ({
      marca,
      modelos: Array.from(modelosMap.entries()).map(([modelo, versionesSet]) => ({
        modelo,
        versiones: Array.from(versionesSet).sort()
      })).sort((a, b) => a.modelo.localeCompare(b.modelo))
    })).sort((a, b) => a.marca.localeCompare(b.marca));

    return successResponse(res, { marcas }, 'Marcas y modelos obtenidos exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener años únicos de vehículos para filtros
 */
exports.getAños = async function (req, res) {
  try {
    // Aplicar filtro de empresa si corresponde
    let empresaFilter = {};
    if (req.empresaFilter) {
      empresaFilter = req.empresaFilter;
    }

    // Obtener años únicos de vehículos activos
    const añosData = await prisma.vehiculo.findMany({
      where: {
        activo: true,
        ...empresaFilter
      },
      select: {
        vehiculo_ano: true
      },
      distinct: ['vehiculo_ano'],
      orderBy: {
        vehiculo_ano: 'desc'
      }
    });

    const años = añosData.map(v => v.vehiculo_ano);

    return successResponse(res, { años }, 'Años disponibles obtenidos exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener estados de vehículos para filtros
 */
exports.getEstados = async function (req, res) {
  try {
    // Obtener todos los estados activos
    const estados = await prisma.estadoVehiculo.findMany({
      select: {
        id: true,
        codigo: true,
        nombre: true,
        descripcion: true
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    return successResponse(res, { estados }, 'Estados disponibles obtenidos exitosamente');
  } catch (error) {
    throw error;
  }
};