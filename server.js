/**
 * Servidor Voonda API con Prisma ORM
 * Migrado desde Supabase directo a Prisma para mejor manejo de tipos y relaciones
 */

require('dotenv/config');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger.config');

const { errorHandler } = require('./middleware/errorHandler');
const { prisma } = require('./utils/prisma');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://voonda.com',
      'https://api.fratelli.voonda.net',
      'https://fratelli.voonda.net',
      process.env.FRONTEND_URL
    ];
    
    // Permitir requests sin origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware de seguridad
app.use((req, res, next) => {
  // Configuración especial para Swagger UI
  if (req.path.startsWith('/api-docs')) {
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false, // Deshabilitar CSP para Swagger UI
    })(req, res, next);
  } else {
    // Configuración normal para el resto de endpoints
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https:"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", "https:", "data:"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        }
      }
    })(req, res, next);
  }
});

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    success: false,
    error: 'Demasiadas solicitudes',
    message: 'Has excedido el límite de requests. Inténtalo en 15 minutos.'
  }
});

// Middlewares
app.use(globalLimiter);
app.use(cors(corsOptions));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger Documentation
try {
  console.log('🔧 Inicializando Swagger UI...');
  console.log('📦 Swagger dependencies:', {
    swaggerUi: !!require('swagger-ui-express'),
    swaggerJsdoc: !!require('swagger-jsdoc')
  });
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
    },
    customSiteTitle: 'Voonda API Documentation'
  }));
  console.log('📖 Swagger UI configurado correctamente en /api-docs');
} catch (error) {
  console.error('❌ Error configurando Swagger UI:', error.message);
  console.error('Stack trace:', error.stack);
  
  // Fallback: endpoint simple de documentación
  app.get('/api-docs', (req, res) => {
    res.json({
      error: 'Swagger UI no disponible',
      message: 'Error al cargar Swagger UI',
      details: error.message,
      documentation: {
        github: 'https://github.com/lsmartinez88/voonda-api',
        frontend_docs: '/frontend-api-docs.md'
      },
      endpoints: {
        health: '/health',
        'db-health': '/db-health',
        auth: '/api/auth',
        vehiculos: '/api/vehiculos',
        empresas: '/api/empresas',
        estados: '/api/estados'
      }
    });
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Voonda API with Prisma ORM is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    orm: 'Prisma'
  });
});

// Endpoint de prueba de conexión Prisma
app.get('/db-health', async (req, res) => {
  try {
    // Probar conexión con Prisma
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'OK',
      message: 'Database connection is healthy',
      timestamp: new Date().toISOString(),
      database: 'PostgreSQL'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      status: 'ERROR',
      database: 'Disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Servir documentación frontend como texto
app.get('/frontend-api-docs.md', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const docsPath = path.join(__dirname, 'frontend-api-docs.md');
    const content = fs.readFileSync(docsPath, 'utf8');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(content);
  } catch (error) {
    res.status(404).json({
      error: 'Documentation not found',
      message: 'Frontend documentation is not available'
    });
  }
});

// Rutas de la API con Prisma
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehiculos', require('./routes/vehiculos'));
app.use('/api/empresas', require('./routes/empresas'));
app.use('/api/estados', require('./routes/estados'));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Voonda API con Prisma ORM',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    server: 'https://api.fratelli.voonda.net',
    documentation: {
      swagger: '/api-docs',
      frontend: '/frontend-api-docs.md',
      github: 'https://github.com/lsmartinez88/voonda-api'
    },
    endpoints: {
      health: '/health',
      'db-health': '/db-health',
      auth: '/api/auth',
      vehiculos: '/api/vehiculos',
      empresas: '/api/empresas',
      estados: '/api/estados'
    }
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Manejo graceful de cierre del servidor
const gracefulShutdown = async (signal) => {
  console.log(`\n📡 ${signal} recibido, cerrando servidor gracefully...`);
  
  try {
    // Cerrar conexiones de Prisma
    await prisma.$disconnect();
    console.log('🔌 Conexión de Prisma cerrada.');
    
    console.log('✅ Servidor cerrado correctamente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el cierre del servidor:', error);
    process.exit(1);
  }
};

// Listeners para señales de cierre
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception thrown:', error);
  process.exit(1);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 Servidor Voonda API con Prisma ejecutándose en puerto', PORT);
  console.log('🌍 Entorno:', process.env.NODE_ENV || 'development');
  console.log('📡 URL:', `http://localhost:${PORT}`);
  console.log('🏥 Health check:', `http://localhost:${PORT}/health`);
  console.log('💾 DB Health:', `http://localhost:${PORT}/db-health`);
  console.log('🔗 ORM: Prisma');
});

module.exports = app;