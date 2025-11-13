/**
 * Controller de Vehículos usando Prisma ORM
 * Migrado desde Supabase directo a Prisma para mejor manejo de tipos y relaciones
 */

const { prisma } = require('../utils/prisma');
const { validateId } = require('../utils/validations');
const { successResponse } = require('../middleware/errorHandler');
const { resolverEstadoId, getEstadoDefecto, getEstadoPorCodigo } = require('../utils/estadoVehiculo');

/**
 * Función helper para construir filtros de Prisma con soporte multi-empresa
 */
const buildPrismaFilters = async (filters, empresaFilter = null) => {
  const where = {};
  
  // Aplicar filtro de empresa si existe
  if (empresaFilter) {
    Object.assign(where, empresaFilter);
  }
  
  if (filters.marca) {
    where.marca = { equals: filters.marca };
  }
  
  if (filters.estado_codigo) {
    // Resolver código de estado a ID
    const estado = await getEstadoPorCodigo(filters.estado_codigo);
    if (estado) {
      where.estado_id = { equals: estado.id };
    }
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

  if (filters.priceFrom || filters.priceTo) {
    where.valor = {};
    if (filters.priceFrom) {
      where.valor.gte = parseFloat(filters.priceFrom);
    }
    if (filters.priceTo) {
      where.valor.lte = parseFloat(filters.priceTo);
    }
  }

  if (filters.search) {
    where.OR = [
      { marca: { contains: filters.search, mode: 'insensitive' } },
      { modelo: { contains: filters.search, mode: 'insensitive' } },
      { descripcion: { contains: filters.search, mode: 'insensitive' } }
    ];
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
  const {
    page = 1,
    limit = 12,
    orderBy = 'created_at',
    order = 'desc',
    ...filters
  } = query;

  // Aplicar filtro de empresa desde middleware
  const where = await buildPrismaFilters(filters, req.empresaFilter);
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    // Ejecutar consultas en paralelo para mejor performance
    const [vehiculos, total] = await Promise.all([
      prisma.vehiculo.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { [orderBy]: order },
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
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
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