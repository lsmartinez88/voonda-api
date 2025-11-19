/**
 * Sistema de Auditoría y Trazabilidad
 * Registra todas las actividades importantes del sistema
 */

const { prisma } = require('./prisma');
const auditConfig = require('./auditConfig');

class AuditSystem {
  constructor() {
    this.config = auditConfig;
  }

  /**
   * Registrar una acción de auditoría
   */
  async log(params) {
    if (!this.config.enabled) {
      return null;
    }

    const {
      accion,
      entidadTipo,
      entidadId,
      descripcion,
      usuario,
      request,
      datosAnteriores = null,
      datosNuevos = null,
      datosAdicionales = null,
      resultado = 'EXITO',
      codigoRespuesta = 200,
      tiempoEjecucion = null,
      errorMensaje = null
    } = params;

    // Verificar si la acción está habilitada
    const actionConfig = this.config.actions[accion];
    if (!actionConfig || !actionConfig.enabled) {
      return null;
    }

    try {
      // Limpiar datos sensibles
      const datosAnterioresLimpios = this.cleanSensitiveData(datosAnteriores);
      const datosNuevosLimpios = this.cleanSensitiveData(datosNuevos);

      // Preparar datos de auditoría
      const auditData = {
        accion,
        entidad_tipo: entidadTipo,
        entidad_id: entidadId,
        descripcion,
        
        // Información del usuario
        usuario_id: usuario?.id || null,
        usuario_email: usuario?.email || null,
        usuario_nombre: usuario?.nombre || null,
        empresa_id: usuario?.empresa?.id || usuario?.empresa_id || null,
        
        // Metadatos de la request
        ip_address: this.extractIpAddress(request),
        user_agent: request?.headers?.['user-agent'] || null,
        endpoint: request?.originalUrl || request?.url || null,
        metodo_http: request?.method || null,
        
        // Datos de la acción
        datos_anteriores: datosAnterioresLimpios,
        datos_nuevos: datosNuevosLimpios,
        datos_adicionales: datosAdicionales,
        
        // Resultado
        resultado,
        codigo_respuesta: codigoRespuesta,
        tiempo_ejecucion: tiempoEjecucion,
        error_mensaje: errorMensaje
      };

      // Guardar en base de datos
      const registro = await prisma.registroAuditoria.create({
        data: auditData
      });

      // Log en consola si es desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 AUDIT [${accion}]:`, {
          usuario: usuario?.email || 'ANONIMO',
          entidad: `${entidadTipo}:${entidadId}`,
          descripcion,
          resultado
        });
      }

      return registro;
    } catch (error) {
      // No fallar la operación principal por errores de auditoría
      console.error('❌ Error en sistema de auditoría:', error);
      return null;
    }
  }

  /**
   * Limpiar datos sensibles
   */
  cleanSensitiveData(data) {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const cleaned = { ...data };
    
    for (const field of this.config.sensitiveFields) {
      if (cleaned[field]) {
        cleaned[field] = '[CENSURADO]';
      }
    }

    return cleaned;
  }

  /**
   * Extraer dirección IP del request
   */
  extractIpAddress(request) {
    if (!request) return null;
    
    return (
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request.headers['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip ||
      null
    );
  }

  /**
   * Registrar login exitoso
   */
  async logLogin(usuario, request) {
    return this.log({
      accion: 'LOGIN',
      entidadTipo: 'USUARIO',
      entidadId: usuario.id,
      descripcion: `Usuario ${usuario.email} inició sesión exitosamente`,
      usuario,
      request,
      datosNuevos: {
        email: usuario.email,
        rol: usuario.rol?.nombre,
        empresa: usuario.empresa?.nombre,
        ultimo_login: new Date()
      }
    });
  }

  /**
   * Registrar intento de login fallido
   */
  async logLoginFailed(email, request, error) {
    return this.log({
      accion: 'LOGIN_FAILED',
      entidadTipo: 'USUARIO',
      entidadId: null,
      descripcion: `Intento fallido de login para: ${email}`,
      usuario: null,
      request,
      datosAdicionales: { 
        email_intentado: email,
        error: error.message 
      },
      resultado: 'ERROR',
      codigoRespuesta: 401,
      errorMensaje: error.message
    });
  }

  /**
   * Registrar logout
   */
  async logLogout(usuario, request) {
    return this.log({
      accion: 'LOGOUT',
      entidadTipo: 'USUARIO',
      entidadId: usuario.id,
      descripcion: `Usuario ${usuario.email} cerró sesión`,
      usuario,
      request
    });
  }

  /**
   * Registrar creación de vehículo
   */
  async logCreateVehiculo(vehiculo, usuario, request) {
    return this.log({
      accion: 'CREATE_VEHICULO',
      entidadTipo: 'VEHICULO',
      entidadId: vehiculo.id,
      descripcion: `Nuevo vehículo creado: ${vehiculo.modelo?.marca} ${vehiculo.modelo?.modelo} ${vehiculo.vehiculo_ano}`,
      usuario,
      request,
      datosNuevos: {
        marca: vehiculo.modelo?.marca,
        modelo: vehiculo.modelo?.modelo,
        ano: vehiculo.vehiculo_ano,
        patente: vehiculo.patente,
        valor: vehiculo.valor,
        vendedor_email: vehiculo.vendedor?.email
      }
    });
  }

  /**
   * Registrar actualización de vehículo
   */
  async logUpdateVehiculo(vehiculoAnterior, vehiculoNuevo, cambios, usuario, request) {
    return this.log({
      accion: 'UPDATE_VEHICULO',
      entidadTipo: 'VEHICULO',
      entidadId: vehiculoNuevo.id,
      descripcion: `Vehículo actualizado: ${vehiculoNuevo.modelo?.marca} ${vehiculoNuevo.modelo?.modelo} (${Object.keys(cambios).join(', ')})`,
      usuario,
      request,
      datosAnteriores: this.extractVehiculoData(vehiculoAnterior),
      datosNuevos: this.extractVehiculoData(vehiculoNuevo),
      datosAdicionales: { campos_modificados: Object.keys(cambios) }
    });
  }

  /**
   * Registrar eliminación de vehículo
   */
  async logDeleteVehiculo(vehiculo, usuario, request) {
    return this.log({
      accion: 'DELETE_VEHICULO',
      entidadTipo: 'VEHICULO',
      entidadId: vehiculo.id,
      descripcion: `Vehículo eliminado: ${vehiculo.modelo?.marca} ${vehiculo.modelo?.modelo} ${vehiculo.vehiculo_ano}`,
      usuario,
      request,
      datosAnteriores: this.extractVehiculoData(vehiculo),
      resultado: 'WARNING'
    });
  }

  /**
   * Registrar creación de operación
   */
  async logCreateOperacion(operacion, usuario, request) {
    return this.log({
      accion: 'CREATE_OPERACION',
      entidadTipo: 'OPERACION',
      entidadId: operacion.id,
      descripcion: `Nueva operación de ${operacion.tipo_operacion}: $${operacion.precio} ${operacion.moneda}`,
      usuario,
      request,
      datosNuevos: {
        tipo: operacion.tipo_operacion,
        precio: operacion.precio,
        moneda: operacion.moneda,
        vehiculo_patente: operacion.vehiculo?.patente,
        vendedor_email: operacion.vendedor?.email,
        comprador_email: operacion.comprador?.email
      }
    });
  }

  /**
   * Registrar acceso denegado
   */
  async logAccessDenied(accion, entidad, usuario, request) {
    return this.log({
      accion: 'ACCESS_DENIED',
      entidadTipo: entidad,
      entidadId: null,
      descripcion: `Acceso denegado para acción: ${accion}`,
      usuario,
      request,
      datosAdicionales: { 
        accion_intentada: accion,
        permisos_usuario: usuario?.rol?.permisos 
      },
      resultado: 'ERROR',
      codigoRespuesta: 403
    });
  }

  /**
   * Extraer datos relevantes de vehículo para auditoría
   */
  extractVehiculoData(vehiculo) {
    if (!vehiculo) return null;
    
    return {
      id: vehiculo.id,
      marca: vehiculo.modelo?.marca,
      modelo: vehiculo.modelo?.modelo,
      ano: vehiculo.vehiculo_ano,
      patente: vehiculo.patente,
      kilometros: vehiculo.kilometros,
      valor: vehiculo.valor,
      estado: vehiculo.estado?.codigo,
      vendedor_email: vehiculo.vendedor?.email,
      comprador_email: vehiculo.comprador?.email
    };
  }

  /**
   * Limpiar registros antiguos (tarea de mantenimiento)
   */
  async cleanOldRecords() {
    if (!this.config.retention.autoCleanup) {
      return;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retention.days);

    try {
      const deleted = await prisma.registroAuditoria.deleteMany({
        where: {
          created_at: {
            lt: cutoffDate
          }
        }
      });

      console.log(`🧹 Limpieza de auditoría: ${deleted.count} registros eliminados`);
      return deleted.count;
    } catch (error) {
      console.error('❌ Error limpiando registros de auditoría:', error);
      return 0;
    }
  }

  /**
   * Obtener estadísticas de auditoría
   */
  async getStats(dateFrom, dateTo) {
    try {
      const where = {};
      
      if (dateFrom || dateTo) {
        where.created_at = {};
        if (dateFrom) where.created_at.gte = new Date(dateFrom);
        if (dateTo) where.created_at.lte = new Date(dateTo);
      }

      const stats = await prisma.registroAuditoria.groupBy({
        by: ['accion', 'resultado'],
        where,
        _count: {
          id: true
        }
      });

      return stats;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de auditoría:', error);
      return [];
    }
  }
}

// Exportar instancia única
const auditSystem = new AuditSystem();
module.exports = auditSystem;