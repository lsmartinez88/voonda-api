/**
 * Controller de Vendedores usando Prisma ORM - VERSION DEPURADA
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
              operaciones_compra: true
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
        operaciones_compra: {
          select: {
            id: true,
            precio_compra: true,
            fecha_compra: true,
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

module.exports = exports;