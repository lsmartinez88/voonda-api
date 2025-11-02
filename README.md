# Voonda API

API completa para la gestión de vehículos con autenticación JWT, construida con **Node.js/Express** y Supabase.

## Características

- ✅ **Autenticación JWT** - Sistema completo de autenticación con tokens seguros
- ✅ **CRUD Vehículos** - Operaciones completas para gestión de vehículos
- ✅ **Base de datos Supabase** - Integración con PostgreSQL a través de Supabase
- ✅ **Validaciones robustas** - Validación de datos con Joi
- ✅ **Middleware de seguridad** - Autenticación, CORS, helmet y rate limiting
- ✅ **Filtros y paginación** - Sistema avanzado de búsqueda y paginación
- ✅ **Manejo de errores** - Respuestas consistentes y logging de errores
- ✅ **Rate limiting** - Protección contra abuso de la API
- ✅ **Análisis de DB** - Script para analizar estructura de base de datos automáticamente
- ✅ **Compresión** - Compresión automática de respuestas

## Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista y rápido
- **Supabase** - Base de datos PostgreSQL como servicio
- **JWT** - Autenticación mediante tokens
- **Joi** - Validación de esquemas
- **bcryptjs** - Hashing de contraseñas
- **Helmet** - Seguridad con headers HTTP
- **Morgan** - Logging de requests HTTP
- **Compression** - Compresión gzip

## Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd voonda-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear un archivo `.env` en la raíz del proyecto:
```bash
touch .env
```

Editar `.env` con tus credenciales:
```env
# Configuración de Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Configuración de JWT
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-characters-long

# Configuración del servidor
PORT=3001
NODE_ENV=development

# Configuración de CORS
FRONTEND_URL=http://localhost:3000
```

4. **Configurar base de datos en Supabase**

Crear las siguientes tablas en Supabase:

```sql
-- Tabla de usuarios
CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de modelos de autos (referencia)
CREATE TABLE modelo_autos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  marca VARCHAR(50) NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  año INTEGER NOT NULL,
  combustible VARCHAR(20) NOT NULL,
  caja VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de vehículos
CREATE TABLE vehiculos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  marca VARCHAR(50) NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  vehiculo_ano INTEGER NOT NULL,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('disponible', 'vendido', 'reservado', 'mantenimiento')),
  valor DECIMAL(12,2) NOT NULL,
  combustible VARCHAR(20) NOT NULL CHECK (combustible IN ('gasolina', 'diesel', 'hibrido', 'electrico', 'gas', 'flex')),
  kilometros INTEGER NOT NULL DEFAULT 0,
  caja VARCHAR(20) NOT NULL CHECK (caja IN ('manual', 'automatica', 'cvt', 'semi-automatica')),
  transmision VARCHAR(20) CHECK (transmision IN ('manual', 'automatica', 'cvt', 'semi-automatica')),
  motor VARCHAR(50) NOT NULL,
  descripcion TEXT NOT NULL,
  modelo_auto_id UUID REFERENCES modelo_autos(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_vehiculos_marca ON vehiculos(marca);
CREATE INDEX idx_vehiculos_estado ON vehiculos(estado);
CREATE INDEX idx_vehiculos_valor ON vehiculos(valor);
CREATE INDEX idx_vehiculos_ano ON vehiculos(vehiculo_ano);
CREATE INDEX idx_vehiculos_created_at ON vehiculos(created_at);
CREATE INDEX idx_usuarios_email ON usuarios(email);
```

5. **Analizar estructura de base de datos (opcional)**
```bash
npm run analyze-db
```

6. **Ejecutar la aplicación**
```bash
# Desarrollo (con nodemon para auto-restart)
npm run dev

# Producción
npm start
```

La API estará disponible en `http://localhost:3001`

## Estructura del proyecto

```
voonda-api/
├── package.json
├── server.js                    # Servidor Express principal
├── .env                        # Variables de entorno
├── analyze-database.js         # Script de análisis de DB
├── routes/
│   ├── auth.js                 # Rutas de autenticación
│   └── vehiculos.js            # Rutas de vehículos
├── middleware/
│   ├── auth.js                 # Middleware de autenticación
│   └── errorHandler.js         # Manejo de errores
├── utils/
│   ├── supabase.js            # Cliente y helpers de Supabase
│   └── validations.js         # Esquemas de validación con Joi
├── controllers/               # Controladores (para expansión futura)
├── temp/                     # Archivos temporales de análisis
├── database-models.json      # Modelos generados automáticamente
├── database-types.ts         # Tipos TypeScript generados
├── database-constants.js     # Constantes generadas
└── README.md
```

## Estructura del proyecto

```
voonda-api/
├── package.json
├── next.config.js
├── config.js
├── .env.local.example
├── lib/
│   ├── supabase.js          # Cliente y helpers de Supabase
│   ├── middleware.js        # Middleware de autenticación y CORS
│   └── validations.js       # Esquemas de validación con Joi
├── pages/api/
│   ├── auth/
│   │   ├── login.js         # POST - Iniciar sesión
│   │   ├── register.js      # POST - Registrar usuario
│   │   ├── logout.js        # POST - Cerrar sesión
│   │   └── me.js           # GET - Información del usuario
│   └── vehiculos/
│       ├── index.js         # GET/POST - Listar/crear vehículos
│       └── [id].js         # GET/PUT/DELETE - Operaciones por ID
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## Documentación de la API

### Autenticación

Todos los endpoints (excepto login y register) requieren autenticación JWT mediante header:
```
Authorization: Bearer <token>
```

#### POST /api/auth/register
Registrar un nuevo usuario.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "name": "Nombre Usuario"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /api/auth/login
Iniciar sesión.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /api/auth/logout
Cerrar sesión (invalida el token).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

#### GET /api/auth/me
Obtener información del usuario autenticado.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Información del usuario obtenida exitosamente",
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Vehículos

#### GET /api/vehiculos
Obtener lista de vehículos con filtros y paginación.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Número de página (default: 1)
- `limit` (number): Elementos por página (default: 12, max: 100)
- `marca` (string): Filtrar por marca
- `estado` (string): Filtrar por estado (disponible, vendido, reservado, mantenimiento)
- `yearFrom` (number): Año mínimo
- `yearTo` (number): Año máximo
- `priceFrom` (number): Precio mínimo
- `priceTo` (number): Precio máximo
- `search` (string): Búsqueda en marca, modelo o descripción
- `orderBy` (string): Campo de ordenamiento (created_at, valor, vehiculo_ano, kilometros, marca, modelo)
- `order` (string): Dirección del ordenamiento (asc, desc)

**Example:** `GET /api/vehiculos?page=1&limit=12&marca=Toyota&estado=disponible&orderBy=valor&order=asc`

**Response (200):**
```json
{
  "success": true,
  "message": "Vehículos obtenidos exitosamente",
  "vehiculos": [
    {
      "id": "uuid",
      "marca": "Toyota",
      "modelo": "Corolla",
      "vehiculo_ano": 2022,
      "estado": "disponible",
      "valor": 25000.00,
      "combustible": "gasolina",
      "kilometros": 15000,
      "caja": "automatica",
      "transmision": "automatica",
      "motor": "1.8L",
      "descripcion": "Vehículo en excelente estado...",
      "created_at": "2024-01-01T00:00:00Z",
      "modelo_autos": {
        "marca": "Toyota",
        "modelo": "Corolla",
        "año": 2022,
        "combustible": "gasolina",
        "caja": "automatica"
      }
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 12,
    "pages": 5
  }
}
```

#### GET /api/vehiculos/[id]
Obtener un vehículo específico por ID.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Vehículo obtenido exitosamente",
  "vehiculo": {
    "id": "uuid",
    "marca": "Toyota",
    "modelo": "Corolla",
    "vehiculo_ano": 2022,
    "estado": "disponible",
    "valor": 25000.00,
    "combustible": "gasolina",
    "kilometros": 15000,
    "caja": "automatica",
    "transmision": "automatica",
    "motor": "1.8L",
    "descripcion": "Vehículo en excelente estado...",
    "created_at": "2024-01-01T00:00:00Z",
    "modelo_autos": {
      "marca": "Toyota",
      "modelo": "Corolla",
      "año": 2022,
      "combustible": "gasolina",
      "caja": "automatica"
    }
  }
}
```

#### POST /api/vehiculos
Crear un nuevo vehículo.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "marca": "Toyota",
  "modelo": "Corolla",
  "vehiculo_ano": 2022,
  "estado": "disponible",
  "valor": 25000.00,
  "combustible": "gasolina",
  "kilometros": 15000,
  "caja": "automatica",
  "motor": "1.8L",
  "descripcion": "Vehículo en excelente estado con mantenimiento al día"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Vehículo creado exitosamente",
  "vehiculo": {
    "id": "uuid",
    "marca": "Toyota",
    "modelo": "Corolla",
    "vehiculo_ano": 2022,
    "estado": "disponible",
    "valor": 25000.00,
    "combustible": "gasolina",
    "kilometros": 15000,
    "caja": "automatica",
    "transmision": "automatica",
    "motor": "1.8L",
    "descripcion": "Vehículo en excelente estado...",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /api/vehiculos/[id]
Actualizar un vehículo existente.

**Headers:** `Authorization: Bearer <token>`

**Body (campos opcionales):**
```json
{
  "estado": "vendido",
  "valor": 24000.00,
  "kilometros": 16000
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Vehículo actualizado exitosamente",
  "vehiculo": {
    "id": "uuid",
    "marca": "Toyota",
    "modelo": "Corolla",
    "vehiculo_ano": 2022,
    "estado": "vendido",
    "valor": 24000.00,
    "combustible": "gasolina",
    "kilometros": 16000,
    "caja": "automatica",
    "transmision": "automatica",
    "motor": "1.8L",
    "descripcion": "Vehículo en excelente estado...",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  }
}
```

#### DELETE /api/vehiculos/[id]
Eliminar un vehículo.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Vehículo eliminado exitosamente"
}
```

## Códigos de estado HTTP

- **200** - Operación exitosa
- **201** - Recurso creado exitosamente
- **400** - Datos inválidos o faltantes
- **401** - No autenticado
- **403** - Token inválido o expirado
- **404** - Recurso no encontrado
- **405** - Método no permitido
- **409** - Conflicto (recurso ya existe)
- **429** - Demasiadas solicitudes (rate limiting)
- **500** - Error interno del servidor

## Rate Limiting

La API implementa rate limiting para prevenir abuso:

- **General**: 100 requests por 15 minutos
- **Login**: 5 intentos por 15 minutos
- **Register**: 3 registros por hora
- **Crear vehículo**: 10 creaciones por hora

## Validaciones

### Vehículo
- **marca**: Requerida, 1-50 caracteres
- **modelo**: Requerido, 1-50 caracteres
- **vehiculo_ano**: Requerido, entre 1950 y año actual + 1
- **estado**: Requerido, valores: disponible, vendido, reservado, mantenimiento
- **valor**: Requerido, número positivo
- **combustible**: Requerido, valores: gasolina, diesel, hibrido, electrico, gas, flex
- **kilometros**: Requerido, número entero ≥ 0
- **caja**: Requerida, valores: manual, automatica, cvt, semi-automatica
- **motor**: Requerido, 1-50 caracteres
- **descripcion**: Requerida, 10-1000 caracteres

### Usuario
- **email**: Requerido, formato de email válido
- **password**: Requerida, 6-50 caracteres
- **name**: Requerido, 2-100 caracteres

## Desarrollo

### Comandos disponibles
```bash
npm run dev         # Iniciar en modo desarrollo (con nodemon)
npm start           # Iniciar servidor de producción
npm run analyze-db  # Analizar estructura de base de datos
npm run lint        # Ejecutar linter
npm run format      # Formatear código con Prettier
npm test            # Ejecutar tests (cuando estén configurados)
```

## Análisis de Base de Datos

La API incluye un script que se conecta automáticamente a tu base de datos Supabase y analiza la estructura existente:

```bash
npm run analyze-db
```

Este script:
- 🔍 **Analiza las tablas** existentes en tu base de datos
- 📊 **Genera modelos** automáticamente basados en la estructura real
- 📝 **Crea tipos TypeScript** para desarrollo type-safe
- 📊 **Genera constantes** para nombres de tablas y campos
- 💾 **Guarda archivos** JSON, TS y JS con toda la información

**Archivos generados:**
- `database-models.json` - Modelos completos con estructura y datos de muestra
- `database-types.ts` - Interfaces TypeScript para cada tabla
- `database-constants.js` - Constantes con nombres de tablas y campos

**Ejemplo de salida:**
```
📋 Modelo: Vehiculos
   Tabla: vehiculos
   Campos:
     • id: UUID (ej: "81fac822-9bfa-4ef2-8a18-7f4e730cf06a")
     • marca: Text (ej: "Sin especificar")
     • valor: Integer (ej: 7500000)
     • estado: Text (ej: "salon")
     ...
```

### Variables de entorno requeridas
```env
SUPABASE_URL=                    # URL de tu proyecto Supabase
SUPABASE_SERVICE_ROLE_KEY=       # Service role key de Supabase
JWT_SECRET=                      # Secreto para firmar tokens JWT (min 32 chars)
PORT=3001                        # Puerto del servidor (opcional)
```

### Variables de entorno opcionales
```env
NODE_ENV=development             # Entorno de ejecución
CORS_ORIGIN=http://localhost:3000 # Origen permitido para CORS
LOG_LEVEL=info                   # Nivel de logging
API_BASE_URL=http://localhost:3001 # URL base de la API
```

## Seguridad

- ✅ Autenticación JWT con expiración de tokens
- ✅ Hashing de contraseñas con bcrypt
- ✅ Rate limiting por IP
- ✅ Validación exhaustiva de datos de entrada
- ✅ Headers de seguridad (CORS, XSS, etc.)
- ✅ Sanitización de datos
- ✅ Lista negra de tokens (logout)

## Producción

Para desplegar en producción:

1. **Configurar variables de entorno de producción**
2. **Configurar dominio CORS apropiado**
3. **Usar HTTPS**
4. **Configurar logging apropiado**
5. **Configurar Redis para rate limiting y blacklist de tokens**
6. **Configurar monitoring y alertas**

## Soporte

Para reportar bugs o solicitar características, crear un issue en el repositorio del proyecto.

## Licencia

[MIT License](LICENSE)