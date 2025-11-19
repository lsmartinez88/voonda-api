/**
 * Middleware de Auditoría Automática
 * Captura automáticamente ciertas acciones para registro de auditoría
 */

const auditSystem = require('../utils/auditSystem');

/**
 * Middleware para capturar automáticamente ciertas acciones
 */
const auditMiddleware = (accion, entidadTipo = null) => {
  return (req, res, next) => {
    // Guardar tiempo de inicio
    req.auditStartTime = Date.now();
    
    // Interceptar el res.json para capturar la respuesta
    const originalJson = res.json;
    
    res.json = function(data) {
      const tiempoEjecucion = Date.now() - req.auditStartTime;
      
      // Log de auditoría asíncrono para no bloquear la respuesta
      setImmediate(async () => {
        try {
          // Extraer información relevante de la respuesta
          let entidadId = null;
          let datosNuevos = null;

          // Para respuestas exitosas, extraer ID de la entidad
          if (data && data.success && data.vehiculo) {
            entidadId = data.vehiculo.id;
            datosNuevos = data.vehiculo;
          } else if (data && data.success && data.vendedor) {
            entidadId = data.vendedor.id;
            datosNuevos = data.vendedor;
          } else if (data && data.success && data.operacion) {
            entidadId = data.operacion.id;
            datosNuevos = data.operacion;
          }

          // Determinar resultado
          let resultado = 'EXITO';
          if (res.statusCode >= 400) {
            resultado = res.statusCode === 403 ? 'BLOQUEADO' : 'ERROR';
          }

          await auditSystem.log({
            accion,
            entidadTipo: entidadTipo || extraerEntidadDelEndpoint(req.path),
            entidadId,
            descripcion: generarDescripcionAutomatica(accion, req, data),
            usuario: req.user,
            request: req,
            datosNuevos,
            resultado,
            codigoRespuesta: res.statusCode,
            tiempoEjecucion,
            errorMensaje: (!data || !data.success) ? data?.message || data?.error : null
          });
        } catch (error) {
          console.error('❌ Error en middleware de auditoría:', error);
        }
      });

      // Llamar al método original
      return originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Extraer tipo de entidad del endpoint
 */
function extraerEntidadDelEndpoint(path) {
  if (path.includes('/vehiculos')) return 'VEHICULO';
  if (path.includes('/vendedores')) return 'VENDEDOR';
  if (path.includes('/compradores')) return 'COMPRADOR';
  if (path.includes('/operaciones')) return 'OPERACION';
  if (path.includes('/usuarios')) return 'USUARIO';
  if (path.includes('/empresas')) return 'EMPRESA';
  if (path.includes('/auth')) return 'AUTH';
  return 'UNKNOWN';
}

/**
 * Generar descripción automática basada en la acción y request
 */
function generarDescripcionAutomatica(accion, req, data) {
  const entidad = extraerEntidadDelEndpoint(req.path);
  const metodo = req.method;
  
  switch (metodo) {
    case 'POST':
      return `${entidad} creado vía API`;
    case 'PUT':
    case 'PATCH':
      return `${entidad} actualizado vía API`;
    case 'DELETE':
      return `${entidad} eliminado vía API`;
    case 'GET':
      return `${entidad} consultado vía API`;
    default:
      return `Acción ${accion} realizada vía API`;
  }
}

/**
 * Middleware específico para endpoints críticos
 */
const auditCriticalEndpoint = auditMiddleware('CRITICAL_ACTION', 'SISTEMA');

/**
 * Middleware para registrar accesos denegados
 */
const auditAccessDenied = (req, res, next) => {
  const originalStatus = res.status;
  
  res.status = function(code) {
    if (code === 403) {
      // Registrar acceso denegado
      setImmediate(async () => {
        await auditSystem.logAccessDenied(
          req.method + ' ' + req.path,
          extraerEntidadDelEndpoint(req.path),
          req.user,
          req
        );
      });
    }
    return originalStatus.call(this, code);
  };
  
  next();
};

module.exports = {
  auditMiddleware,
  auditCriticalEndpoint,
  auditAccessDenied
};