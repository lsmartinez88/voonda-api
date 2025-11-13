/**
 * Controller de Compradores usando Prisma ORM
 * Maneja las personas que compran vehículos de la empresa
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

  // Solo mostrar compradores activos por defecto
  where.activo = true;

  return where;
};

/**
 * Obtener lista de compradores con filtros y paginación
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
    const [compradores, total] = await Promise.all([
      prisma.comprador.findMany({
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
      prisma.comprador.count({ where })
    ]);

    const pagination = {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    };

    return successResponse(res, { compradores, pagination }, 'Compradores obtenidos exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener un comprador por ID
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

    const comprador = await prisma.comprador.findFirst({
      where,
      include: {
        empresa: {
          select: {
            id: true,
            nombre: true
          }
        },
        vehiculos: {
          select: {
            id: true,
            modelo: {
              select: {
                marca: true,
                modelo: true,
                modelo_ano: true
              }
            },
            patente: true,
            vehiculo_ano: true,
            valor: true,
            estado: {
              select: {
                codigo: true,
                nombre: true
              }
            },
            created_at: true
          },
          where: { activo: true },
          orderBy: { created_at: 'desc' }
        },
        operaciones: { // CAMBIO: usar operaciones genérica
          select: {
            id: true,
            monto: true, // CAMBIO: usar monto en lugar de precio_venta
            tipo: true,  // CAMBIO: agregar tipo
            fecha: true, // CAMBIO: usar fecha en lugar de fecha_venta
            fecha_entrega: true,
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

    if (!comprador) {
      return res.status(404).json({
        success: false,
        error: 'Comprador no encontrado',
        message: `No se encontró un comprador con el ID: ${id} o no tienes acceso a él`
      });
    }

    return successResponse(res, { comprador }, 'Comprador obtenido exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Crear nuevo comprador
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
          message: 'Debes especificar la empresa para este comprador'
        });
      }
    } else {
      // Otros usuarios usan su empresa
      empresa_id = req.user.empresa.id;
    }

    // Normalizar datos
    const compradorData = {
      ...req.body,
      empresa_id,
      nombre: req.body.nombre?.trim(),
      apellido: req.body.apellido?.trim(),
      telefono: req.body.telefono?.trim(),
      email: req.body.email?.trim().toLowerCase(),
      dni: req.body.dni?.trim(),
      direccion: req.body.direccion?.trim(),
      ciudad: req.body.ciudad?.trim(),
      provincia: req.body.provincia?.trim(),
      codigo_postal: req.body.codigo_postal?.trim(),
      origen: req.body.origen?.trim(),
      comentarios: req.body.comentarios?.trim()
    };

    // Limpiar campos undefined
    Object.keys(compradorData).forEach(key => {
      if (compradorData[key] === undefined || compradorData[key] === '') {
        delete compradorData[key];
      }
    });

    const newComprador = await prisma.comprador.create({
      data: compradorData,
      include: {
        empresa: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });

    return successResponse(res, { comprador: newComprador }, 'Comprador creado exitosamente', 201);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'Datos duplicados',
        message: 'Ya existe un comprador con estos datos (DNI, email, etc.)'
      });
    }
    throw error;
  }
};

/**
 * Actualizar comprador existente
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
    // Construir filtros con empresa
    const where = { id };
    if (req.empresaFilter) {
      Object.assign(where, req.empresaFilter);
    }

    // Verificar que el comprador existe y pertenece a la empresa
    const existingComprador = await prisma.comprador.findFirst({ where });
    if (!existingComprador) {
      return res.status(404).json({
        success: false,
        error: 'Comprador no encontrado',
        message: `No se encontró un comprador con el ID: ${id} o no tienes acceso a él`
      });
    }

    // Normalizar datos de actualización
    const updateData = {
      ...req.body,
      nombre: req.body.nombre?.trim(),
      apellido: req.body.apellido?.trim(),
      telefono: req.body.telefono?.trim(),
      email: req.body.email?.trim().toLowerCase(),
      dni: req.body.dni?.trim(),
      direccion: req.body.direccion?.trim(),
      ciudad: req.body.ciudad?.trim(),
      provincia: req.body.provincia?.trim(),
      codigo_postal: req.body.codigo_postal?.trim(),
      origen: req.body.origen?.trim(),
      comentarios: req.body.comentarios?.trim()
    };

    // Limpiar campos undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });

    const updatedComprador = await prisma.comprador.update({
      where: { id },
      data: updateData,
      include: {
        empresa: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });

    return successResponse(res, { comprador: updatedComprador }, 'Comprador actualizado exitosamente');
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'Datos duplicados',
        message: 'Ya existe un comprador con estos datos (DNI, email, etc.)'
      });
    }
    throw error;
  }
};

/**
 * Eliminar comprador (soft delete)
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
    // Construir filtros con empresa
    const where = { id };
    if (req.empresaFilter) {
      Object.assign(where, req.empresaFilter);
    }

    // Verificar que el comprador existe
    const existingComprador = await prisma.comprador.findFirst({ where });
    if (!existingComprador) {
      return res.status(404).json({
        success: false,
        error: 'Comprador no encontrado',
        message: `No se encontró un comprador con el ID: ${id} o no tienes acceso a él`
      });
    }

    // Soft delete: marcar como inactivo
    await prisma.comprador.update({
      where: { id },
      data: { activo: false }
    });

    return successResponse(res, {}, 'Comprador eliminado exitosamente');
  } catch (error) {
    throw error;
  }
};