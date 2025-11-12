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
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false, // Deshabilitar CSP completamente para evitar conflictos con Swagger
}));

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
  
  // Servir Swagger UI usando CDN para evitar problemas con archivos estáticos en Vercel
  app.get('/api-docs/', (req, res) => {
    const swaggerDocument = JSON.stringify(swaggerSpecs);
    
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Voonda API Documentation</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
        <style>
          html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
          *, *:before, *:after { box-sizing: inherit; }
          body { margin:0; background: #fafafa; }
          .swagger-ui .topbar { display: none; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = function() {
            const ui = SwaggerUIBundle({
              url: '/api/swagger.json',
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              plugins: [
                SwaggerUIBundle.plugins.DownloadUrl
              ],
              layout: "StandaloneLayout",
              persistAuthorization: true,
              filter: true,
              tryItOutEnabled: true
            });
          };
        </script>
      </body>
      </html>
    `);
  });
  
  // Redireccionar /api-docs a /api-docs/
  app.get('/api-docs', (req, res) => {
    res.redirect('/api-docs/');
  });
  
  // Endpoint para servir el JSON de Swagger
  app.get('/api/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpecs);
  });
  
  console.log('📖 Swagger UI configurado correctamente en /api-docs (CDN version)');
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
app.get('/debug-env', (req, res) => {
  res.json({
    DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
    DATABASE_URL_LENGTH: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
    DATABASE_URL_PREFIX: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'NOT_SET',
    JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

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

// Nuevas rutas
app.use('/api/vendedores', require('./routes/vendedores'));
app.use('/api/compradores', require('./routes/compradores'));
app.use('/api/imagenes', require('./routes/imagenes'));

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

module.exports = app;// Force redeploy to apply env vars - Wed Nov 12 00:29:05 -03 2025
