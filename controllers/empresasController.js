/**
 * Controller de Empresas - Sistema Multi-Tenant
 * Gestión de empresas en el sistema
 */

const { prisma } = require('../utils/prisma');
const { successResponse } = require('../middleware/errorHandler');

/**
 * Obtener todas las empresas (solo administrador general)
 */
exports.getAll = async function (req, res) {
  try {
    const { page = 1, limit = 10, search, activa } = req.query;
    
    // Construir filtros
    const where = {};
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (activa !== undefined) {
      where.activa = activa === 'true';
    }

    // Calcular skip para paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Obtener empresas con conteos
    const [empresas, total] = await Promise.all([
      prisma.empresa.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { created_at: 'desc' },
        include: {
          _count: {
            select: {
              usuarios: true,
              vehiculos: true
            }
          }
        }
      }),
      prisma.empresa.count({ where })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    return successResponse(res, {
      empresas,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    throw error;
  }
};

/**
 * Obtener una empresa por ID
 */
exports.getById = async function (req, res) {
  try {
    const { id } = req.params;

    const empresa = await prisma.empresa.findUnique({
      where: { id },
      include: {
        usuarios: {
          select: {
            id: true,
            email: true,
            nombre: true,
            apellido: true,
            rol: true,
            activo: true,
            created_at: true
          }
        },
        _count: {
          select: {
            vehiculos: true,
            modelo_autos: true
          }
        }
      }
    });

    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    return successResponse(res, { empresa });

  } catch (error) {
    throw error;
  }
};

/**
 * Crear una nueva empresa
 */
exports.create = async function (req, res) {
  try {
    const { nombre, descripcion, logo_url } = req.body;

    const empresa = await prisma.empresa.create({
      data: {
        nombre: nombre.trim(),
        descripcion: descripcion?.trim(),
        logo_url
      }
    });

    return successResponse(res, { empresa }, 'Empresa creada exitosamente', 201);

  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar una empresa
 */
exports.update = async function (req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion, logo_url, activa } = req.body;

    // Verificar que la empresa existe
    const empresaExistente = await prisma.empresa.findUnique({
      where: { id }
    });

    if (!empresaExistente) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    // Actualizar empresa
    const empresa = await prisma.empresa.update({
      where: { id },
      data: {
        nombre: nombre?.trim(),
        descripcion: descripcion?.trim(),
        logo_url,
        activa
      }
    });

    return successResponse(res, { empresa }, 'Empresa actualizada exitosamente');

  } catch (error) {
    throw error;
  }
};

/**
 * Desactivar/Activar una empresa
 */
exports.toggleActive = async function (req, res) {
  try {
    const { id } = req.params;

    const empresaExistente = await prisma.empresa.findUnique({
      where: { id }
    });

    if (!empresaExistente) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    const empresa = await prisma.empresa.update({
      where: { id },
      data: {
        activa: !empresaExistente.activa
      }
    });

    const message = empresa.activa ? 'Empresa activada' : 'Empresa desactivada';
    
    return successResponse(res, { empresa }, message);

  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar una empresa (solo si no tiene datos asociados)
 */
exports.delete = async function (req, res) {
  try {
    const { id } = req.params;

    // Verificar que la empresa existe
    const empresa = await prisma.empresa.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            usuarios: true,
            vehiculos: true,
            modelo_autos: true
          }
        }
      }
    });

    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    // Verificar que no tenga datos asociados
    const { usuarios, vehiculos, modelo_autos } = empresa._count;
    
    if (usuarios > 0 || vehiculos > 0 || modelo_autos > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar la empresa porque tiene datos asociados',
        details: {
          usuarios,
          vehiculos,
          modelo_autos
        }
      });
    }

    // Eliminar empresa
    await prisma.empresa.delete({
      where: { id }
    });

    return successResponse(res, {}, 'Empresa eliminada exitosamente');

  } catch (error) {
    throw error;
  }
};

/**
 * Obtener estadísticas de una empresa
 */
exports.getStats = async function (req, res) {
  try {
    const { id } = req.params;

    // Verificar que la empresa existe
    const empresa = await prisma.empresa.findUnique({
      where: { id }
    });

    if (!empresa) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    // Obtener estadísticas
    const [
      totalUsuarios,
      usuariosActivos,
      totalVehiculos,
      vehiculosDisponibles,
      totalModelosAutos
    ] = await Promise.all([
      prisma.usuario.count({ where: { empresa_id: id } }),
      prisma.usuario.count({ where: { empresa_id: id, activo: true } }),
      prisma.vehiculo.count({ where: { empresa_id: id } }),
      prisma.vehiculo.count({ 
        where: { 
          empresa_id: id, 
          estado: 'Disponible',
          activo: true 
        } 
      }),
      prisma.modeloAuto.count({ where: { empresa_id: id } })
    ]);

    const stats = {
      usuarios: {
        total: totalUsuarios,
        activos: usuariosActivos,
        inactivos: totalUsuarios - usuariosActivos
      },
      vehiculos: {
        total: totalVehiculos,
        disponibles: vehiculosDisponibles,
        no_disponibles: totalVehiculos - vehiculosDisponibles
      },
      modelos: {
        total: totalModelosAutos
      }
    };

    return successResponse(res, { empresa, stats });

  } catch (error) {
    throw error;
  }
};