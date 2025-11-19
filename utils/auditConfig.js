/**
 * Configuración del Sistema de Auditoría y Trazabilidad
 * Control centralizado de todas las acciones a auditar
 */

const auditConfig = {
  // Interruptor principal de auditoría
  enabled: process.env.AUDIT_ENABLED === 'true' || false,
  
  // Configuración de acciones a auditar
  actions: {
    // Autenticación y usuarios
    LOGIN: { enabled: true, nivel: 'INFO' },
    LOGOUT: { enabled: true, nivel: 'INFO' },
    LOGIN_FAILED: { enabled: true, nivel: 'WARNING' },
    REGISTER_USER: { enabled: true, nivel: 'INFO' },
    UPDATE_USER: { enabled: true, nivel: 'INFO' },
    DELETE_USER: { enabled: true, nivel: 'CRITICAL' },
    
    // Vehículos
    CREATE_VEHICULO: { enabled: true, nivel: 'INFO' },
    UPDATE_VEHICULO: { enabled: true, nivel: 'INFO' },
    DELETE_VEHICULO: { enabled: true, nivel: 'WARNING' },
    VIEW_VEHICULO: { enabled: false, nivel: 'DEBUG' }, // Deshabilitado por defecto (mucho volumen)
    
    // Vendedores y Compradores
    CREATE_VENDEDOR: { enabled: true, nivel: 'INFO' },
    UPDATE_VENDEDOR: { enabled: true, nivel: 'INFO' },
    DELETE_VENDEDOR: { enabled: true, nivel: 'WARNING' },
    CREATE_COMPRADOR: { enabled: true, nivel: 'INFO' },
    UPDATE_COMPRADOR: { enabled: true, nivel: 'INFO' },
    DELETE_COMPRADOR: { enabled: true, nivel: 'WARNING' },
    
    // Operaciones
    CREATE_OPERACION: { enabled: true, nivel: 'INFO' },
    UPDATE_OPERACION: { enabled: true, nivel: 'INFO' },
    DELETE_OPERACION: { enabled: true, nivel: 'WARNING' },
    COMPLETE_OPERACION: { enabled: true, nivel: 'INFO' },
    CANCEL_OPERACION: { enabled: true, nivel: 'WARNING' },
    
    // Imágenes y Publicaciones
    UPLOAD_IMAGEN: { enabled: true, nivel: 'INFO' },
    DELETE_IMAGEN: { enabled: true, nivel: 'INFO' },
    CREATE_PUBLICACION: { enabled: true, nivel: 'INFO' },
    UPDATE_PUBLICACION: { enabled: true, nivel: 'INFO' },
    DELETE_PUBLICACION: { enabled: true, nivel: 'INFO' },
    
    // Estados y Empresas
    UPDATE_ESTADO_VEHICULO: { enabled: true, nivel: 'INFO' },
    CREATE_EMPRESA: { enabled: true, nivel: 'CRITICAL' },
    UPDATE_EMPRESA: { enabled: true, nivel: 'WARNING' },
    DELETE_EMPRESA: { enabled: true, nivel: 'CRITICAL' },
    
    // Accesos y seguridad
    ACCESS_DENIED: { enabled: true, nivel: 'WARNING' },
    INVALID_TOKEN: { enabled: true, nivel: 'WARNING' },
    RATE_LIMIT_EXCEEDED: { enabled: true, nivel: 'WARNING' },
    
    // Exportaciones e importaciones
    EXPORT_DATA: { enabled: true, nivel: 'INFO' },
    IMPORT_DATA: { enabled: true, nivel: 'WARNING' },
    
    // Sistema
    SERVER_START: { enabled: true, nivel: 'INFO' },
    SERVER_STOP: { enabled: true, nivel: 'INFO' },
    DATABASE_ERROR: { enabled: true, nivel: 'CRITICAL' },
    API_ERROR: { enabled: true, nivel: 'ERROR' }
  },
  
  // Configuración de datos sensibles a censurar
  sensitiveFields: [
    'password',
    'token',
    'secret',
    'key',
    'credit_card',
    'ssn',
    'dni',
    'access_token',
    'refresh_token',
    'jwt'
  ],
  
  // Configuración de retención de logs
  retention: {
    days: parseInt(process.env.AUDIT_RETENTION_DAYS) || 365,
    autoCleanup: process.env.AUDIT_AUTO_CLEANUP === 'true' || false
  },
  
  // Configuración de almacenamiento
  storage: {
    database: true, // Siempre en BD
    file: process.env.AUDIT_FILE_ENABLED === 'true' || false,
    external: process.env.AUDIT_EXTERNAL_ENABLED === 'true' || false
  }
};

module.exports = auditConfig;