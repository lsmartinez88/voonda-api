/**
 * Middleware de Autenticación Multi-Empresa con Roles y Permisos
 * Sistema robusto de autenticación y autorización
 */

const jwt = require('jsonwebtoken');
const { prisma } = require('../utils/prisma');

// Middleware de autenticación JWT mejorado
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    // Verificar el token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar el usuario completo con empresa y rol
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      include: {
        empresa: true,
        rol: true
      }
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario desactivado'
      });
    }

    // Verificar si el usuario está bloqueado
    if (usuario.bloqueado_hasta && new Date() < usuario.bloqueado_hasta) {
      return res.status(423).json({
        success: false,
        message: 'Usuario bloqueado temporalmente'
      });
    }

    // Agregar información del usuario a la request
    req.user = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      empresa_id: usuario.empresa_id, // También incluir el ID directo
      empresa: usuario.empresa,
      rol: usuario.rol,
      permisos: usuario.rol.permisos || {}
    };

    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware para verificar permisos específicos
const requirePermission = (recurso, accion) => {
  return (req, res, next) => {
    try {
      const { permisos } = req.user;

      // Administrador general tiene todos los permisos
      if (req.user.rol.nombre === 'administrador_general') {
        return next();
      }

      // Verificar si tiene el permiso específico
      if (permisos[recurso] && permisos[recurso][accion]) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: `No tienes permisos para ${accion} en ${recurso}`
      });
    } catch (error) {
      console.error('Error verificando permisos:', error);
      return res.status(500).json({
        success: false,
        message: 'Error verificando permisos'
      });
    }
  };
};

// Middleware para filtrar por empresa (solo para administradores de empresa y colaboradores)
const filterByEmpresa = (req, res, next) => {
  try {
    // Si es administrador general, no aplicar filtro
    if (req.user.rol.nombre === 'administrador_general') {
      return next();
    }

    // Para otros usuarios, agregar filtro de empresa
    if (req.user.empresa) {
      req.empresaFilter = {
        empresa_id: req.user.empresa.id
      };
    } else {
      // Usuario sin empresa asignada (caso extraño)
      return res.status(403).json({
        success: false,
        message: 'Usuario no tiene empresa asignada'
      });
    }

    next();
  } catch (error) {
    console.error('Error aplicando filtro de empresa:', error);
    return res.status(500).json({
      success: false,
      message: 'Error aplicando filtro de empresa'
    });
  }
};

// Middleware para verificar si el usuario puede acceder a una empresa específica
const canAccessEmpresa = (empresaId) => {
  return (req, res, next) => {
    try {
      // Administrador general puede acceder a cualquier empresa
      if (req.user.rol.nombre === 'administrador_general') {
        return next();
      }

      // Verificar que el usuario pertenece a la empresa solicitada
      if (!req.user.empresa || req.user.empresa.id !== empresaId) {
        return res.status(403).json({
          success: false,
          message: 'No tienes acceso a esta empresa'
        });
      }

      next();
    } catch (error) {
      console.error('Error verificando acceso a empresa:', error);
      return res.status(500).json({
        success: false,
        message: 'Error verificando acceso a empresa'
      });
    }
  };
};

// Función helper para verificar roles
const hasRole = (req, ...roles) => {
  return roles.includes(req.user.rol.nombre);
};

// Función helper para verificar si es administrador general
const isAdminGeneral = (req) => {
  return req.user.rol.nombre === 'administrador_general';
};

// Función helper para verificar si es administrador de empresa
const isAdminEmpresa = (req) => {
  return req.user.rol.nombre === 'administrador_empresa';
};

// Función helper para verificar si es colaborador
const isColaborador = (req) => {
  return req.user.rol.nombre === 'colaborador';
};

module.exports = {
  authenticateToken,
  requirePermission,
  filterByEmpresa,
  canAccessEmpresa,
  hasRole,
  isAdminGeneral,
  isAdminEmpresa,
  isColaborador
};