# Voonda API - Documentación de Endpoints para Frontend

## Base URL: https://api.fratelli.voonda.net

## Autenticación
Todos los endpoints (excepto login) requieren header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 AUTENTICACIÓN

### POST /api/auth/login
**Descripción:** Iniciar sesión y obtener token JWT
**Autenticación:** No requerida

**Request Body (JSON):**
```json
{
  "email": "string (required, email format)", 
  "password": "string (required, min 6 chars)"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "token": "string (JWT token)",
  "user": {
    "id": "string (UUID)",
    "email": "string",
    "nombre": "string", 
    "apellido": "string",
    "telefono": "string|null",
    "empresa": {
      "id": "string (UUID)",
      "nombre": "string",
      "descripcion": "string|null",
      "logo_url": "string|null",
      "activa": "boolean"
    },
    "rol": {
      "id": "string (UUID)",
      "nombre": "string", // "colaborador" | "administrador_empresa" | "administrador_general"
      "descripcion": "string",
      "permisos": "object"
    },
    "ultimo_login": "string (ISO date)",
    "created_at": "string (ISO date)"
  }
}
```

**Response 401:**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

## 🚗 VEHÍCULOS

### GET /api/vehiculos
**Descripción:** Obtener lista de vehículos con filtros y paginación
**Autenticación:** Requerida
**Permisos:** vehiculos.leer

**Query Parameters (todos opcionales):**
```
page: number (default: 1, min: 1)
limit: number (default: 12, min: 1, max: 100)  
orderBy: string (default: "created_at") // "created_at" | "valor" | "vehiculo_ano" | "kilometros"
order: string (default: "desc") // "asc" | "desc"
estado_codigo: string // "salon" | "consignacion" | "pyc" | "preparacion" | "vendido" | "entregado"
yearFrom: number (min: 1950, max: current year + 1)
yearTo: number (min: 1950, max: current year + 1)
priceFrom: number (positive)
priceTo: number (positive) 
search: string (max: 100 chars, busca en marca/modelo)
```

**Response 200:**
```json
{
  "success": true,
  "message": "Vehículos obtenidos exitosamente",
  "vehiculos": [
    {
      "id": "string (UUID)",
      "empresa_id": "string (UUID)",
      "modelo_id": "string (UUID)", 
      "patente": "string|null",
      "vehiculo_ano": "number",
      "kilometros": "number",
      "valor": "string (decimal)|null",
      "moneda": "string",
      "tipo_operacion": "string|null",
      "publicacion_web": "string", // "true" | "false"
      "publicacion_api_call": "string", // "true" | "false"
      "fecha_ingreso": "string (ISO date)|null",
      "observaciones": "string|null",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)",
      "modelo_auto": {
        "marca": "string",
        "modelo": "string", 
        "modelo_ano": "number",
        "combustible": "string",
        "caja": "string"
      },
      "estado": {
        "id": "string (UUID)",
        "codigo": "string",
        "nombre": "string",
        "descripcion": "string"
      }
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number", 
    "limit": "number",
    "pages": "number"
  }
}
```

### GET /api/vehiculos/{id}
**Descripción:** Obtener un vehículo por ID
**Autenticación:** Requerida
**Permisos:** vehiculos.leer

**Path Parameters:**
```
id: string (UUID, required)
```

**Response 200:**
```json
{
  "success": true,
  "message": "Vehículo obtenido exitosamente", 
  "vehiculo": {
    "id": "string (UUID)",
    "empresa_id": "string (UUID)",
    "modelo_id": "string (UUID)",
    "patente": "string|null",
    "vehiculo_ano": "number",
    "kilometros": "number", 
    "valor": "string (decimal)|null",
    "moneda": "string",
    "tipo_operacion": "string|null",
    "publicacion_web": "string",
    "publicacion_api_call": "string", 
    "fecha_ingreso": "string (ISO date)|null",
    "observaciones": "string|null",
    "created_at": "string (ISO date)",
    "updated_at": "string (ISO date)",
    "empresa": {
      "id": "string (UUID)",
      "nombre": "string"
    },
    "modelo_auto": {
      "marca": "string",
      "modelo": "string",
      "modelo_ano": "number", 
      "combustible": "string",
      "caja": "string",
      "version": "string|null",
      "motorizacion": "string|null",
      "traccion": "string|null",
      "puertas": "number|null",
      "segmento_modelo": "string|null",
      "cilindrada": "number|null",
      "potencia_hp": "number|null",
      "torque_nm": "number|null"
    },
    "estado": {
      "id": "string (UUID)",
      "codigo": "string", 
      "nombre": "string",
      "descripcion": "string"
    }
  }
}
```

**Response 404:**
```json
{
  "success": false,
  "error": "Vehículo no encontrado",
  "message": "No se encontró un vehículo con el ID: {id} o no tienes acceso a él"
}
```

### POST /api/vehiculos
**Descripción:** Crear nuevo vehículo
**Autenticación:** Requerida
**Permisos:** vehiculos.crear

**Request Body (JSON):**
```json
{
  "modelo_id": "string (UUID, required)",
  "vehiculo_ano": "number (required, min: 1950, max: current year + 1)",
  "estado_codigo": "string (optional)", // "salon" | "consignacion" | "pyc" | "preparacion" | "vendido" | "entregado"
  "estado_id": "string (UUID, optional)", // Alternativa a estado_codigo
  "patente": "string (optional, max: 15 chars)",
  "kilometros": "number (optional, min: 0, default: 0)",
  "valor": "number (optional, positive)",
  "moneda": "string (optional, max: 10 chars, default: 'ARS')",
  "tipo_operacion": "string (optional)",
  "publicacion_web": "string (optional, 'true'|'false', default: 'false')",
  "publicacion_api_call": "string (optional, 'true'|'false', default: 'false')", 
  "fecha_ingreso": "string (ISO date, optional)",
  "observaciones": "string (optional, max: 1000 chars)"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Vehículo creado exitosamente",
  "vehiculo": {
    // Mismo formato que GET /api/vehiculos/{id}
  }
}
```

**Response 400:**
```json
{
  "success": false,
  "error": "Datos inválidos",
  "message": "El modelo_id es requerido", 
  "details": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

### PUT /api/vehiculos/{id}
**Descripción:** Actualizar un vehículo existente
**Autenticación:** Requerida
**Permisos:** vehiculos.editar

**Path Parameters:**
```
id: string (UUID, required)
```

**Request Body (JSON, todos los campos opcionales):**
```json
{
  "modelo_id": "string (UUID, optional)",
  "vehiculo_ano": "number (optional, min: 1950, max: current year + 1)",
  "estado_codigo": "string (optional)", 
  "estado_id": "string (UUID, optional)",
  "patente": "string (optional, max: 15 chars)",
  "kilometros": "number (optional, min: 0)",
  "valor": "number (optional, positive)",
  "moneda": "string (optional, max: 10 chars)",
  "tipo_operacion": "string (optional)",
  "publicacion_web": "string (optional, 'true'|'false')",
  "publicacion_api_call": "string (optional, 'true'|'false')",
  "fecha_ingreso": "string (ISO date, optional)",
  "observaciones": "string (optional, max: 1000 chars)"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Vehículo actualizado exitosamente",
  "vehiculo": {
    // Mismo formato que GET /api/vehiculos/{id}
  }
}
```

### DELETE /api/vehiculos/{id}
**Descripción:** Eliminar un vehículo (soft delete)
**Autenticación:** Requerida
**Permisos:** vehiculos.eliminar

**Path Parameters:**
```
id: string (UUID, required)
```

**Response 200:**
```json
{
  "success": true,
  "message": "Vehículo eliminado exitosamente"
}
```

---

## 📊 ESTADOS DE VEHÍCULOS

### GET /api/estados
**Descripción:** Obtener todos los estados de vehículos disponibles
**Autenticación:** Requerida
**Permisos:** vehiculos.leer

**Response 200:**
```json
{
  "success": true,
  "message": "Estados obtenidos exitosamente",
  "estados": [
    {
      "id": "string (UUID)",
      "codigo": "string", // "salon", "consignacion", "pyc", "preparacion", "vendido", "entregado"
      "nombre": "string", // "En Salón", "En Consignación", etc.
      "descripcion": "string",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)"
    }
  ]
}
```

---

## 🏢 EMPRESAS

### GET /api/empresas
**Descripción:** Obtener lista de empresas (solo admin general)
**Autenticación:** Requerida
**Permisos:** empresas.leer

**Response 200:**
```json
{
  "success": true,
  "message": "Empresas obtenidas exitosamente", 
  "empresas": [
    {
      "id": "string (UUID)",
      "nombre": "string",
      "descripcion": "string|null", 
      "logo_url": "string|null",
      "activa": "boolean",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)"
    }
  ]
}
```

---

## 🔍 HEALTH CHECKS

### GET /health
**Descripción:** Verificar estado del servidor
**Autenticación:** No requerida

**Response 200:**
```json
{
  "status": "OK",
  "message": "Voonda API with Prisma ORM is running",
  "timestamp": "string (ISO date)",
  "version": "1.0.0",
  "environment": "development",
  "orm": "Prisma"
}
```

### GET /db-health
**Descripción:** Verificar conectividad con base de datos
**Autenticación:** No requerida

**Response 200:**
```json
{
  "status": "OK", 
  "message": "Database connection is healthy",
  "timestamp": "string (ISO date)",
  "database": "PostgreSQL"
}
```

---

## ⚠️ RESPUESTAS DE ERROR COMUNES

### 400 - Bad Request
```json
{
  "success": false,
  "error": "Datos inválidos",
  "message": "string",
  "details": [
    {
      "field": "string", 
      "message": "string"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Token de acceso requerido" | "Token inválido"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "No tienes permisos para realizar esta acción"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "error": "Recurso no encontrado",
  "message": "string"
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "error": "Error interno del servidor",
  "message": "string",
  "stack": "string (solo en development)"
}
```

---

## 💡 NOTAS PARA FRONTEND

### Manejo de Estados:
- Usar `estado_codigo` para crear/actualizar vehículos (más legible)
- El endpoint `/api/estados` proporciona la lista completa de estados disponibles
- Los estados son: "salon", "consignacion", "pyc", "preparacion", "vendido", "entregado"

### Autenticación:
- El token JWT expira en 24 horas
- Almacenar token en localStorage/sessionStorage
- Incluir token en todas las requests con header `Authorization: Bearer {token}`
- Manejar respuestas 401 para renovar token

### Paginación:
- Usar `page` y `limit` para paginación
- Response incluye objeto `pagination` con información completa
- `limit` máximo es 100

### Filtros de Búsqueda:
- `search` busca en marca y modelo del vehículo
- Usar `yearFrom`/`yearTo` para rango de años
- Usar `priceFrom`/`priceTo` para rango de precios
- `estado_codigo` para filtrar por estado específico

### Datos Relacionados:
- Los vehículos incluyen datos del `modelo_auto` y `estado`
- `modelo_auto` contiene marca, modelo, año, etc.
- `estado` contiene código, nombre y descripción legible