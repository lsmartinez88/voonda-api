/**
 * Controller de Vehículos usando Prisma ORM
 * Migrado desde Supabase directo a Prisma para mejor manejo de tipos y relaciones
 */

const { prisma } = require('../utils/prisma');
const { validateId } = require('../utils/validations');
const { successResponse } = require('../middleware/errorHandler');
const { resolverEstadoId, getEstadoDefecto, getEstadoPorCodigo } = require('../utils/estadoVehiculo');

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

  // Búsqueda general en marca, modelo y descripción
  if (filters.search) {
    const searchTerm = filters.search.trim();
    if (searchTerm) {
      where.OR = [
        {
          modelo: {
            modelo: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        },
        {
          modelo: {
            marca: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        },
        {
          descripcion: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        }
      ];
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
            puertas: true,
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
            direccion: true,
            ciudad: true,
            provincia: true
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
            direccion: true,
            ciudad: true,
            provincia: true
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

    // Resolver estado_id desde estado_codigo o estado_id
    let estado_id = null;
    try {
      estado_id = await resolverEstadoId(req.body.estado_codigo, req.body.estado_id);
      
      // Si no se especifica estado, usar el por defecto (salon)
      if (!estado_id) {
        const estadoDefecto = await getEstadoDefecto();
        estado_id = estadoDefecto.id;
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Estado inválido',
        message: error.message
      });
    }

    // Normalizar datos - Prisma maneja los timestamps automáticamente
    const vehiculoData = {
      ...req.body,
      empresa_id, // Agregar empresa_id
      estado_id,  // Usar el estado_id resuelto
      // Limpiar campos de texto
      observaciones: req.body.observaciones?.trim(),
      pendientes_preparacion: req.body.pendientes_preparacion?.trim(),
      comentarios: req.body.comentarios?.trim(),
      // Prisma maneja created_at y updated_at automáticamente
    };

    // Limpiar campos de estado originales del body
    delete vehiculoData.estado_codigo;

    // Limpiar campos undefined para evitar problemas con Prisma
    Object.keys(vehiculoData).forEach(key => {
      if (vehiculoData[key] === undefined || vehiculoData[key] === '') {
        delete vehiculoData[key];
      }
    });

    // Re-agregar el estado_id final al vehiculoData
    vehiculoData.estado_id = estado_id;

    const newVehiculo = await prisma.vehiculo.create({
      data: vehiculoData,
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
        }
      }
    });

    return successResponse(res, { vehiculo: newVehiculo }, 'Vehículo creado exitosamente', 201);
  } catch (error) {
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

    // Preparar datos de actualización
    const updateData = { ...req.body };
    
    // No permitir cambiar empresa_id a menos que sea admin general
    if (updateData.empresa_id && req.user.rol.nombre !== 'administrador_general') {
      delete updateData.empresa_id;
    }

    // Resolver estado_id si se proporciona estado_codigo o estado_id
    if (updateData.estado_codigo || updateData.estado_id) {
      try {
        const estado_id = await resolverEstadoId(updateData.estado_codigo, updateData.estado_id);
        if (estado_id) {
          updateData.estado_id = estado_id;
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Estado inválido',
          message: error.message
        });
      }
    }

    // Limpiar campo de estado_codigo del updateData
    delete updateData.estado_codigo;
    
    // Normalizar strings si están presentes
    if (updateData.marca) updateData.marca = updateData.marca.trim();
    if (updateData.modelo) updateData.modelo = updateData.modelo.trim();
    if (updateData.version) updateData.version = updateData.version.trim();
    if (updateData.motorizacion) updateData.motorizacion = updateData.motorizacion.trim();

    // Limpiar campos undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });

    // Prisma maneja updated_at automáticamente
    const updatedVehiculo = await prisma.vehiculo.update({
      where: { id },
      data: updateData,
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
        }
      }
    });

    return successResponse(res, { vehiculo: updatedVehiculo }, 'Vehículo actualizado exitosamente');
  } catch (error) {
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