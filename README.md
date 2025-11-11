# 🚗 Voonda API - Sistema de Gestión de Vehículos

API REST completa para gestión de vehículos con autenticación JWT y sistema multi-empresa, construida con Node.js, Express, Prisma ORM y PostgreSQL.

## 🚀 Características Principales

- ✅ **Autenticación JWT** con sistema multi-tenant
- ✅ **CRUD completo de vehículos** con filtros avanzados
- ✅ **Sistema de estados** para vehículos (Salón, Consignación, etc.)
- ✅ **Paginación y búsqueda** optimizada
- ✅ **Arquitectura multi-empresa** con control de acceso
- ✅ **Documentación Swagger** interactiva
- ✅ **Validación robusta** con Joi
- ✅ **Rate limiting** y seguridad
- ✅ **Deploy listo para Vercel**

## 📖 Documentación

- **Swagger UI:** `https://api.fratelli.voonda.net/api-docs`
- **Documentación Frontend:** [`frontend-api-docs.md`](./frontend-api-docs.md)
- **Guía de Deploy:** [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md)
- **API Base:** `https://api.fratelli.voonda.net`

## 🛠️ Tecnologías

- **Backend:** Node.js + Express.js
- **ORM:** Prisma
- **Base de Datos:** PostgreSQL
- **Autenticación:** JWT
- **Validación:** Joi
- **Documentación:** Swagger UI
- **Deploy:** Vercel Ready

## 📦 Instalación Rápida

### 1. Clonar repositorio
```bash
git clone <tu-repo>
cd voonda-api
npm install
```

### 2. Configurar base de datos
```bash
# Copia el archivo de ambiente
cp .env.example .env

# Edita .env con tu DATABASE_URL y JWT_SECRET
nano .env
```

### 3. Configurar Prisma y datos iniciales
```bash
npx prisma db push
npm run prisma:seed
```

### 4. Iniciar servidor
```bash
npm run dev
# Servidor disponible en: http://localhost:3001
# Swagger UI en: http://localhost:3001/api-docs
# Producción en: https://api.fratelli.voonda.net
# Swagger Producción: https://api.fratelli.voonda.net/api-docs
```

## 🌐 Deploy a Producción (Vercel)

### Deploy Directo desde GitHub:
1. Conecta tu repo en [vercel.com](https://vercel.com)
2. Configura las variables de entorno:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=tu-secret-aqui
   NODE_ENV=production
   FRONTEND_URL=https://tu-frontend.vercel.app
   ```
3. ¡Deploy automático!

Ver guía completa: [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md)

## 📚 Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/me` - Perfil del usuario
- `POST /api/auth/logout` - Cerrar sesión

### Vehículos
- `GET /api/vehiculos` - Lista con filtros y paginación
- `GET /api/vehiculos/:id` - Obtener vehículo específico
- `POST /api/vehiculos` - Crear vehículo
- `PUT /api/vehiculos/:id` - Actualizar vehículo
- `DELETE /api/vehiculos/:id` - Eliminar vehículo

### Estados
- `GET /api/estados` - Obtener estados disponibles

### Empresas
- `GET /api/empresas` - Lista de empresas (admin)

## 🎯 Ejemplos de Uso

### Login y obtener token:
```bash
# Desarrollo
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin.empresa@voonda.com","password":"admin123"}'

# Producción
curl -X POST https://api.fratelli.voonda.net/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin.empresa@voonda.com","password":"admin123"}'
```

### Crear vehículo:
```bash
curl -X POST http://localhost:3001/api/vehiculos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "modelo_id": "81fe616b-efac-4b6c-8102-a790d9340ee2",
    "vehiculo_ano": 2020,
    "estado_codigo": "salon",
    "valor": 2500000,
    "kilometros": 25000,
    "patente": "ABC123"
  }'
```

### Obtener vehículos con filtros:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3001/api/vehiculos?page=1&limit=10&estado_codigo=salon&yearFrom=2020"
```

## 🗄️ Estructura de Base de Datos

```sql
-- Empresas (multi-tenant)
CREATE TABLE empresas (
  id UUID PRIMARY KEY,
  nombre VARCHAR NOT NULL,
  activa BOOLEAN DEFAULT true
);

-- Usuarios con roles
CREATE TABLE usuarios (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  empresa_id UUID REFERENCES empresas(id),
  rol_id UUID REFERENCES roles(id)
);

-- Estados de vehículos
CREATE TABLE estado_vehiculos (
  id UUID PRIMARY KEY,
  codigo VARCHAR UNIQUE, -- salon, consignacion, pyc, etc.
  nombre VARCHAR NOT NULL,
  descripcion TEXT
);

-- Modelos de autos (catálogo compartido)
CREATE TABLE modelo_autos (
  id UUID PRIMARY KEY,
  marca VARCHAR NOT NULL,
  modelo VARCHAR NOT NULL,
  modelo_ano INTEGER
  -- más campos técnicos...
);

-- Vehículos principales
CREATE TABLE vehiculos (
  id UUID PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id),
  modelo_id UUID REFERENCES modelo_autos(id),
  estado_id UUID REFERENCES estado_vehiculos(id),
  vehiculo_ano INTEGER,
  kilometros INTEGER,
  valor DECIMAL,
  patente VARCHAR,
  -- más campos...
);
```

## 🔒 Sistema de Permisos

### Roles disponibles:
- **Colaborador:** CRUD vehículos de su empresa
- **Admin Empresa:** Gestión completa de su empresa
- **Admin General:** Acceso a todas las empresas

### Middleware de autorización:
```javascript
// Verificar autenticación
authenticateToken

// Verificar permisos específicos
requirePermission('vehiculos', 'crear')

// Filtrar por empresa automáticamente
filterByEmpresa
```

## 📊 Estados de Vehículos

| Código | Nombre | Descripción |
|--------|--------|-------------|
| `salon` | En Salón | Disponible para venta |
| `consignacion` | En Consignación | Vehículo en consignación |
| `pyc` | Preparación y Chapa | En taller |
| `preparacion` | En Preparación | Siendo preparado |
| `vendido` | Vendido | Venta concretada |
| `entregado` | Entregado | Entregado al cliente |

## 🧪 Testing

### Health checks:
```bash
curl http://localhost:3001/health        # Estado del servidor
curl http://localhost:3001/db-health     # Estado de la BD
```

### Datos de prueba:
El comando `npm run prisma:seed` crea:
- 2 empresas de ejemplo
- Usuarios admin y colaboradores
- 6 estados de vehículos
- 3 modelos de autos base
- Roles y permisos

Credenciales de prueba:
- **Admin:** `admin.empresa@voonda.com` / `admin123`
- **Colaborador:** `colaborador@voonda.com` / `colaborador123`

## 📁 Estructura del Proyecto

```
voonda-api/
├── controllers/         # Lógica de negocio
├── middleware/         # Auth, CORS, errores
├── prisma/            # Schema y migraciones
├── routes/            # Definición de rutas
├── utils/             # Utilidades y validaciones
├── server.js          # Servidor principal
├── swagger.config.js  # Configuración Swagger
├── vercel.json       # Configuración Vercel
└── package.json      # Dependencias y scripts
```

## 🚨 Variables de Entorno

```env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-feature`
3. Commit: `git commit -am 'Agregar nueva feature'`
4. Push: `git push origin feature/nueva-feature`
5. Pull Request

## 📄 Licencia

MIT License - ver [`LICENSE`](LICENSE) para detalles.

---

## 🔗 Enlaces Útiles

- **Documentación Swagger:** `/api-docs`
- **Prisma Studio:** `npx prisma studio`
- **Logs de desarrollo:** `npm run dev`
- **Deploy Vercel:** [Guía completa](./VERCEL_DEPLOYMENT.md)

¡Tu API Voonda está lista para escalar! 🎉