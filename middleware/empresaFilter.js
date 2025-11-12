/**
 * Middleware para filtrado por empresa
 * Aplica filtros automáticos basados en la empresa del usuario autenticado
 */

/**
 * Middleware que agrega el filtro de empresa al request
 * Debe usarse después del middleware de autenticación
 */
const addEmpresaFilter = (req, res, next) => {
  // Si el usuario está autenticado y tiene empresa_id
  if (req.user && req.user.empresa_id) {
    // Agregar filtro de empresa al request para usar en los controladores
    req.empresaFilter = {
      empresa_id: req.user.empresa_id
    };
  } else {
    // Si no hay usuario autenticado o empresa_id, no aplicar filtro
    // Esto permite que rutas públicas funcionen sin filtro
    req.empresaFilter = {};
  }
  
  next();
};

/**
 * Middleware estricto que requiere empresa_id
 * Usar en rutas que obligatoriamente necesitan filtrado por empresa
 */
const requireEmpresaFilter = (req, res, next) => {
  if (!req.user || !req.user.empresa_id) {
    return res.status(403).json({
      success: false,
      error: 'AccessDenied',
      message: 'Acceso denegado: Se requiere usuario con empresa asignada'
    });
  }
  
  req.empresaFilter = {
    empresa_id: req.user.empresa_id
  };
  
  next();
};

/**
 * Middleware para administradores generales
 * Permite acceso sin filtro de empresa para administradores del sistema
 */
const addEmpresaFilterWithAdminOverride = (req, res, next) => {
  // Si es administrador general, no aplicar filtro de empresa
  if (req.user && req.user.rol && req.user.rol.nombre === 'administrador_general') {
    req.empresaFilter = {};
    req.isGlobalAdmin = true;
  } 
  // Si es usuario normal con empresa, aplicar filtro
  else if (req.user && req.user.empresa_id) {
    req.empresaFilter = {
      empresa_id: req.user.empresa_id
    };
    req.isGlobalAdmin = false;
  } 
  // Si no cumple ninguna condición, denegar acceso
  else {
    return res.status(403).json({
      success: false,
      error: 'AccessDenied',
      message: 'Acceso denegado: Se requiere usuario autenticado con empresa o permisos de administrador'
    });
  }
  
  next();
};

module.exports = {
  addEmpresaFilter,
  requireEmpresaFilter,
  addEmpresaFilterWithAdminOverride
};