/**
 * Controller de Imágenes de Vehículos usando Prisma ORM
 * Maneja las imágenes asociadas a cada vehículo
 */

const { prisma } = require('../utils/prisma');
const { validateId } = require('../utils/validations');
const { successResponse } = require('../middleware/errorHandler');

/**
 * Obtener todas las imágenes de un vehículo
 */
exports.getByVehiculo = async function (req, res) {
  const { vehiculo_id } = req.params;
  
  // Validar formato del ID
  try {
    validateId(vehiculo_id);
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'ID inválido',
      message: 'El vehiculo_id debe ser un UUID válido'
    });
  }

  try {
    // Verificar que el vehículo existe y pertenece a la empresa del usuario
    const where = { id: vehiculo_id };
    if (req.empresaFilter) {
      Object.assign(where, req.empresaFilter);
    }

    const vehiculo = await prisma.vehiculo.findFirst({
      where,
      select: { id: true }
    });

    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        error: 'Vehículo no encontrado',
        message: `No se encontró un vehículo con el ID: ${vehiculo_id} o no tienes acceso a él`
      });
    }

    // Obtener las imágenes del vehículo
    const imagenes = await prisma.imagenVehiculo.findMany({
      where: {
        vehiculo_id,
        activo: true
      },
      select: {
        id: true,
        url: true,
        descripcion: true,
        orden: true,
        es_principal: true,
        created_at: true,
        updated_at: true
      },
      orderBy: [
        { es_principal: 'desc' },
        { orden: 'asc' },
        { created_at: 'asc' }
      ]
    });

    return successResponse(res, { imagenes }, 'Imágenes obtenidas exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener una imagen específica por ID
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
    const imagen = await prisma.imagenVehiculo.findFirst({
      where: { 
        id,
        activo: true,
        vehiculo: req.empresaFilter ? req.empresaFilter : {}
      },
      include: {
        vehiculo: {
          select: {
            id: true,
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
      }
    });

    if (!imagen) {
      return res.status(404).json({
        success: false,
        error: 'Imagen no encontrada',
        message: `No se encontró una imagen con el ID: ${id} o no tienes acceso a ella`
      });
    }

    return successResponse(res, { imagen }, 'Imagen obtenida exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Crear nueva imagen para un vehículo
 */
exports.create = async function (req, res) {
  const { vehiculo_id } = req.params;
  
  // Validar formato del ID
  try {
    validateId(vehiculo_id);
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'ID inválido',
      message: 'El vehiculo_id debe ser un UUID válido'
    });
  }

  try {
    // Verificar que el vehículo existe y pertenece a la empresa del usuario
    const where = { id: vehiculo_id };
    if (req.empresaFilter) {
      Object.assign(where, req.empresaFilter);
    }

    const vehiculo = await prisma.vehiculo.findFirst({
      where,
      select: { id: true }
    });

    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        error: 'Vehículo no encontrado',
        message: `No se encontró un vehículo con el ID: ${vehiculo_id} o no tienes acceso a él`
      });
    }

    // Si se marca como principal, desmarcar las demás
    if (req.body.es_principal) {
      await prisma.imagenVehiculo.updateMany({
        where: {
          vehiculo_id,
          es_principal: true
        },
        data: {
          es_principal: false
        }
      });
    }

    // Normalizar datos
    const imagenData = {
      vehiculo_id,
      url: req.body.url_imagen?.trim(),
      descripcion: req.body.titulo?.trim(),
      orden: req.body.orden || 0,
      es_principal: req.body.es_principal || false
    };

    // Limpiar campos undefined
    Object.keys(imagenData).forEach(key => {
      if (imagenData[key] === undefined || imagenData[key] === '') {
        delete imagenData[key];
      }
    });

    const newImagen = await prisma.imagenVehiculo.create({
      data: imagenData,
      include: {
        vehiculo: {
          select: {
            id: true,
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
      }
    });

    return successResponse(res, { imagen: newImagen }, 'Imagen creada exitosamente', 201);
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar imagen existente
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
    // Verificar que la imagen existe y el vehículo pertenece a la empresa
    const existingImagen = await prisma.imagenVehiculo.findFirst({
      where: { 
        id,
        activo: true,
        vehiculo: req.empresaFilter ? req.empresaFilter : {}
      },
      select: {
        id: true,
        vehiculo_id: true,
        es_principal: true
      }
    });

    if (!existingImagen) {
      return res.status(404).json({
        success: false,
        error: 'Imagen no encontrada',
        message: `No se encontró una imagen con el ID: ${id} o no tienes acceso a ella`
      });
    }

    // Si se marca como principal, desmarcar las demás del mismo vehículo
    if (req.body.es_principal && !existingImagen.es_principal) {
      await prisma.imagenVehiculo.updateMany({
        where: {
          vehiculo_id: existingImagen.vehiculo_id,
          es_principal: true,
          id: { not: id }
        },
        data: {
          es_principal: false
        }
      });
    }

    // Normalizar datos de actualización
    const updateData = {
      url: req.body.url_imagen?.trim(),
      descripcion: req.body.titulo?.trim(),
      orden: req.body.orden,
      es_principal: req.body.es_principal
    };

    // Limpiar campos undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });

    const updatedImagen = await prisma.imagenVehiculo.update({
      where: { id },
      data: updateData,
      include: {
        vehiculo: {
          select: {
            id: true,
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
      }
    });

    return successResponse(res, { imagen: updatedImagen }, 'Imagen actualizada exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar imagen (soft delete)
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
    // Verificar que la imagen existe y el vehículo pertenece a la empresa
    const existingImagen = await prisma.imagenVehiculo.findFirst({
      where: { 
        id,
        activo: true,
        vehiculo: req.empresaFilter ? req.empresaFilter : {}
      },
      select: { id: true }
    });

    if (!existingImagen) {
      return res.status(404).json({
        success: false,
        error: 'Imagen no encontrada',
        message: `No se encontró una imagen con el ID: ${id} o no tienes acceso a ella`
      });
    }

    // Soft delete: marcar como inactiva
    await prisma.imagenVehiculo.update({
      where: { id },
      data: { activo: false }
    });

    return successResponse(res, {}, 'Imagen eliminada exitosamente');
  } catch (error) {
    throw error;
  }
};

/**
 * Establecer imagen como principal
 */
exports.setPrincipal = async function (req, res) {
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
    // Verificar que la imagen existe y el vehículo pertenece a la empresa
    const existingImagen = await prisma.imagenVehiculo.findFirst({
      where: { 
        id,
        activo: true,
        vehiculo: req.empresaFilter ? req.empresaFilter : {}
      },
      select: { 
        id: true,
        vehiculo_id: true,
        es_principal: true 
      }
    });

    if (!existingImagen) {
      return res.status(404).json({
        success: false,
        error: 'Imagen no encontrada',
        message: `No se encontró una imagen con el ID: ${id} o no tienes acceso a ella`
      });
    }

    if (existingImagen.es_principal) {
      return res.status(400).json({
        success: false,
        error: 'Imagen ya principal',
        message: 'Esta imagen ya está marcada como principal'
      });
    }

    // Transacción para cambiar la imagen principal
    await prisma.$transaction(async (prisma) => {
      // Desmarcar la imagen principal actual
      await prisma.imagenVehiculo.updateMany({
        where: {
          vehiculo_id: existingImagen.vehiculo_id,
          es_principal: true
        },
        data: {
          es_principal: false
        }
      });

      // Marcar la nueva imagen como principal
      await prisma.imagenVehiculo.update({
        where: { id },
        data: { es_principal: true }
      });
    });

    return successResponse(res, {}, 'Imagen establecida como principal exitosamente');
  } catch (error) {
    throw error;
  }
};