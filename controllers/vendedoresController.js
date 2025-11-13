/**
 * Controller de Vendedores usando Prisma ORM - VERSION COMPLETA
 * Maneja las personas que venden vehículos a la empresa
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
  
  if (filters.search) {
    where.OR = [
      { nombre: { contains: filters.search, mode: 'insensitive' } },
      { apellido: { contains: filters.search, mode: 'insensitive' } },
      { telefono: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } },
      { dni: { contains: filters.search, mode: 'insensitive' } }
    ];
  }

  // Solo mostrar vendedores activos por defecto
  where.activo = true;

  return where;
};

/**
 * Obtener lista de vendedores con filtros y paginación
 */
exports.getAll = async function (req, res) {
  const {
    page = 1,
    limit = 12,
    orderBy = 'created_at',
    order = 'desc',
    ...filters
  } = req.query;

  // Aplicar filtro de empresa desde middleware
  const where = buildPrismaFilters(filters, req.empresaFilter);
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    // Ejecutar consultas en paralelo para mejor performance
    const [vendedores, total] = await Promise.all([
      prisma.vendedor.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { [orderBy]: order },
        select: {
          id: true,
          nombre: true,
          apellido: true,
          telefono: true,
          email: true,
          dni: true,
          ciudad: true,
          provincia: true,
          origen: true,
          activo: true,
          created_at: true,
          updated_at: true,
          _count: {
            select: {
              vehiculos: true,
              operaciones: true // CAMBIO: usar operaciones genérica
            }
          }
        }
      }),
      prisma.vendedor.count({ where })
    ]);

    const pagination = {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    };

    return successResponse(res, { vendedores, pagination }, 'Vendedores obtenidos exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener un vendedor por ID
 */
exports.getById = async function (req, res) {
  const { id } = req.params;
  
  // Validar formato UUID
  if (!validateId(id)) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'ID de vendedor inválido'
    });
  }

  try {
    const vendedor = await prisma.vendedor.findFirst({
      where: {
        id,
        ...req.empresaFilter // Multi-empresa filtering
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        telefono: true,
        email: true,
        dni: true,
        direccion: true,
        ciudad: true,
        provincia: true,
        codigo_postal: true,
        origen: true,
        comentarios: true,
        activo: true,
        created_at: true,
        updated_at: true,
        vehiculos: {
          select: {
            id: true,
            patente: true,
            modelo: {
              select: {
                marca: true,
                modelo: true,
                version: true,
                modelo_ano: true
              }
            },
            estado: {
              select: {
                codigo: true,
                nombre: true
              }
            }
          },
          take: 5,
          orderBy: { created_at: 'desc' }
        },
        operaciones: { // CAMBIO: usar operaciones genérica
          select: {
            id: true,
            monto: true, // CAMBIO: usar monto en lugar de precio_compra
            tipo: true,  // CAMBIO: agregar tipo
            fecha: true, // CAMBIO: usar fecha en lugar de fecha_compra
            estado: true,
            vehiculo: {
              select: {
                modelo: {
                  select: {
                    marca: true,
                    modelo: true,
                    modelo_ano: true
                  }
                },
                patente: true
              }
            }
          },
          orderBy: { created_at: 'desc' },
          take: 10 // Solo las últimas 10 operaciones
        }
      }
    });

    if (!vendedor) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Vendedor no encontrado'
      });
    }

    return successResponse(res, { vendedor }, 'Vendedor obtenido exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Crear un nuevo vendedor
 */
exports.create = async function (req, res) {
  try {
    // Aplicar empresa del usuario autenticado
    const datosVendedor = {
      ...req.body,
      empresa_id: req.user.empresa_id || req.body.empresa_id
    };

    const nuevoVendedor = await prisma.vendedor.create({
      data: datosVendedor,
      select: {
        id: true,
        nombre: true,
        apellido: true,
        telefono: true,
        email: true,
        dni: true,
        ciudad: true,
        provincia: true,
        origen: true,
        activo: true,
        created_at: true
      }
    });

    return successResponse(res, { vendedor: nuevoVendedor }, 'Vendedor creado exitosamente', 201);
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar un vendedor
 */
exports.update = async function (req, res) {
  const { id } = req.params;
  
  // Validar formato UUID
  if (!validateId(id)) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'ID de vendedor inválido'
    });
  }

  try {
    // Verificar que el vendedor existe y pertenece a la empresa
    const vendedorExiste = await prisma.vendedor.findFirst({
      where: {
        id,
        ...req.empresaFilter
      },
      select: { id: true }
    });

    if (!vendedorExiste) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Vendedor no encontrado'
      });
    }

    const vendedorActualizado = await prisma.vendedor.update({
      where: { id },
      data: req.body,
      select: {
        id: true,
        nombre: true,
        apellido: true,
        telefono: true,
        email: true,
        dni: true,
        direccion: true,
        ciudad: true,
        provincia: true,
        codigo_postal: true,
        origen: true,
        comentarios: true,
        activo: true,
        updated_at: true
      }
    });

    return successResponse(res, { vendedor: vendedorActualizado }, 'Vendedor actualizado exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar un vendedor (soft delete)
 */
exports.delete = async function (req, res) {
  const { id } = req.params;
  
  // Validar formato UUID
  if (!validateId(id)) {
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      message: 'ID de vendedor inválido'
    });
  }

  try {
    // Verificar que el vendedor existe y pertenece a la empresa
    const vendedorExiste = await prisma.vendedor.findFirst({
      where: {
        id,
        ...req.empresaFilter
      },
      select: { id: true, nombre: true, apellido: true }
    });

    if (!vendedorExiste) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'Vendedor no encontrado'
      });
    }

    // Soft delete - marcar como inactivo
    const vendedorEliminado = await prisma.vendedor.update({
      where: { id },
      data: { activo: false },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        activo: true
      }
    });

    return successResponse(res, { vendedor: vendedorEliminado }, 'Vendedor eliminado exitosamente');
  } catch (error) {
    throw error;
  }
};

module.exports = exports;