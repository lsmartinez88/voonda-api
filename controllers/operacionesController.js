/**
 * Controller de Operaciones usando Prisma ORM - SISTEMA GENÉRICO
 * Maneja todas las operaciones: compra, venta, seña, transferencia, ingreso, entrega, etc.
 */

const { prisma } = require('../utils/prisma');
const { validateId } = require('../utils/validations');
const { successResponse } = require('../middleware/errorHandler');

/**
 * Función helper para construir filtros de Prisma con soporte multi-empresa
 */
const buildPrismaFilters = (filters, empresaFilter = null) => {
  const where = {};
  
  // Aplicar filtro de empresa si existe
  if (empresaFilter) {
    Object.assign(where, empresaFilter);
  }
  
  // Filtro por tipo de operación
  if (filters.tipo) {
    where.tipo = filters.tipo;
  }
  
  // Filtro por estado
  if (filters.estado) {
    where.estado = filters.estado;
  }
  
  // Filtro por rango de fechas
  if (filters.fecha_desde || filters.fecha_hasta) {
    where.fecha = {};
    if (filters.fecha_desde) {
      where.fecha.gte = new Date(filters.fecha_desde);
    }
    if (filters.fecha_hasta) {
      where.fecha.lte = new Date(filters.fecha_hasta);
    }
  }
  
  // Filtro por vehículo
  if (filters.vehiculo_id) {
    where.vehiculo_id = filters.vehiculo_id;
  }
  
  // Filtro por vendedor
  if (filters.vendedor_id) {
    where.vendedor_id = filters.vendedor_id;
  }
  
  // Filtro por comprador
  if (filters.comprador_id) {
    where.comprador_id = filters.comprador_id;
  }
  
  // Búsqueda en observaciones
  if (filters.search) {
    where.observaciones = {
      contains: filters.search,
      mode: 'insensitive'
    };
  }

  return where;
};

/**
 * Obtener lista de operaciones con filtros y paginación
 */
exports.getAll = async function (req, res) {
  const query = req.query || {};
  const {
    page = 1,
    limit = 12,
    orderBy = 'fecha',
    order = 'desc',
    ...filters
  } = query;

  // Aplicar filtro de empresa desde middleware
  const where = buildPrismaFilters(filters, req.empresaFilter);
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    // Ejecutar consultas en paralelo para mejor performance
    const [operaciones, total] = await Promise.all([
      prisma.operacion.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { [orderBy]: order },
        select: {
          id: true,
          tipo: true,
          fecha: true,
          monto: true,
          moneda: true,
          estado: true,
          observaciones: true,
          created_at: true,
          updated_at: true,
          vehiculo: {
            select: {
              id: true,
              patente: true,
              modelo_auto: {
                select: {
                  marca: true,
                  modelo: true,
                  version: true,
                  modelo_ano: true
                }
              }
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
          datos_especificos: true
        }
      }),
      prisma.operacion.count({ where })
    ]);

    const pagination = {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    };

    return successResponse(res, { operaciones, pagination }, 'Operaciones obtenidas exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener una operación por ID
 */
exports.getById = async function (req, res) {
  const { id } = req.params;
  
  // Validar formato UUID
  if (!validateId(id)) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'ID de operación inválido'
    });
  }

  try {
    const operacion = await prisma.operacion.findFirst({
      where: {
        id,
        ...req.empresaFilter // Multi-empresa filtering
      },
      select: {
        id: true,
        tipo: true,
        fecha: true,
        monto: true,
        moneda: true,
        estado: true,
        observaciones: true,
        datos_especificos: true,
        created_at: true,
        updated_at: true,
        empresa: {
          select: {
            id: true,
            nombre: true
          }
        },
        vehiculo: {
          select: {
            id: true,
            patente: true,
            vehiculo_ano: true,
            kilometros: true,
            valor: true,
            modelo_auto: {
              select: {
                marca: true,
                modelo: true,
                version: true,
                modelo_ano: true,
                combustible: true,
                caja: true
              }
            },
            estado: {
              select: {
                codigo: true,
                nombre: true
              }
            }
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
            ciudad: true,
            provincia: true
          }
        }
      }
    });

    if (!operacion) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Operación no encontrada'
      });
    }

    return successResponse(res, { operacion }, 'Operación obtenida exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Crear una nueva operación
 */
exports.create = async function (req, res) {
  try {
    // Aplicar empresa del usuario autenticado
    const datosOperacion = {
      ...req.body,
      empresa_id: req.user.empresa_id || req.body.empresa_id,
      usuario_id: req.user.id
    };

    const nuevaOperacion = await prisma.operacion.create({
      data: datosOperacion,
      select: {
        id: true,
        tipo: true,
        fecha: true,
        monto: true,
        moneda: true,
        estado: true,
        observaciones: true,
        datos_especificos: true,
        created_at: true,
        vehiculo: {
          select: {
            id: true,
            patente: true,
            modelo_auto: {
              select: {
                marca: true,
                modelo: true,
                modelo_ano: true
              }
            }
          }
        },
        vendedor: {
          select: {
            id: true,
            nombre: true,
            apellido: true
          }
        },
        comprador: {
          select: {
            id: true,
            nombre: true,
            apellido: true
          }
        }
      }
    });

    return successResponse(res, { operacion: nuevaOperacion }, 'Operación creada exitosamente', 201);
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar una operación
 */
exports.update = async function (req, res) {
  const { id } = req.params;
  
  // Validar formato UUID
  if (!validateId(id)) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'ID de operación inválido'
    });
  }

  try {
    // Verificar que la operación existe y pertenece a la empresa
    const operacionExiste = await prisma.operacion.findFirst({
      where: {
        id,
        ...req.empresaFilter
      },
      select: { id: true }
    });

    if (!operacionExiste) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Operación no encontrada'
      });
    }

    const operacionActualizada = await prisma.operacion.update({
      where: { id },
      data: req.body,
      select: {
        id: true,
        tipo: true,
        fecha: true,
        monto: true,
        moneda: true,
        estado: true,
        observaciones: true,
        datos_especificos: true,
        updated_at: true
      }
    });

    return successResponse(res, { operacion: operacionActualizada }, 'Operación actualizada exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar una operación
 */
exports.delete = async function (req, res) {
  const { id } = req.params;
  
  // Validar formato UUID
  if (!validateId(id)) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'ID de operación inválido'
    });
  }

  try {
    // Verificar que la operación existe y pertenece a la empresa
    const operacionExiste = await prisma.operacion.findFirst({
      where: {
        id,
        ...req.empresaFilter
      },
      select: { id: true, tipo: true, fecha: true }
    });

    if (!operacionExiste) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Operación no encontrada'
      });
    }

    // Eliminación física (considera cambiar a soft delete si es necesario)
    await prisma.operacion.delete({
      where: { id }
    });

    return successResponse(res, { operacion: operacionExiste }, 'Operación eliminada exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener resumen de operaciones por tipo
 */
exports.getResumenPorTipo = async function (req, res) {
  const query = req.query || {};
  const { fecha_desde, fecha_hasta } = query;

  const where = buildPrismaFilters({ fecha_desde, fecha_hasta }, req.empresaFilter);

  try {
    const resumen = await prisma.operacion.groupBy({
      by: ['tipo'],
      where,
      _count: {
        _all: true
      },
      _sum: {
        monto: true
      },
      _avg: {
        monto: true
      }
    });

    const resumenFormatted = resumen.map(item => ({
      tipo: item.tipo,
      cantidad: item._count._all,
      monto_total: item._sum.monto,
      monto_promedio: item._avg.monto
    }));

    return successResponse(res, { resumen: resumenFormatted }, 'Resumen obtenido exitosamente');
  } catch (error) {
    throw error;
  }
};

module.exports = exports;