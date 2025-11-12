# Voonda API - Documentación de Endpoints para Frontend

## Base URL: https://api.fratelli.voonda.net

## Autenticación
Todos los endpoints (excepto login y health checks) requieren header:
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
    } | null,
    "rol": {
      "id": "string (UUID)",
      "nombre": "string", // "colaborador" | "administrador_empresa" | "administrador_general"
      "descripcion": "string",
      "permisos": "object",
      "activo": "boolean"
    },
    "ultimo_login": "string (ISO date)|null",
    "created_at": "string (ISO date)"
  }
}
```

### GET /api/auth/me
**Descripción:** Obtener información del usuario autenticado
**Autenticación:** Requerida

**Response 200:**
```json
{
  "success": true,
  "message": "Información del usuario obtenida exitosamente",
  "user": {
    // Mismo formato que POST /api/auth/login
  }
}
```

### POST /api/auth/logout
**Descripción:** Cerrar sesión del usuario
**Autenticación:** Requerida

**Response 200:**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
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
      "estado_id": "string (UUID)|null",
      "tipo_operacion": "string|null",
      "fecha_ingreso": "string (ISO date)|null",
      "observaciones": "string|null",
      "pendientes_preparacion": "array[string]|null", // NUEVO CAMPO
      "comentarios": "string|null", // NUEVO CAMPO
      "vendedor_id": "string (UUID)|null", // NUEVO CAMPO
      "comprador_id": "string (UUID)|null", // NUEVO CAMPO
      "activo": "boolean",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)",
      "modelo_auto": {
        "marca": "string",
        "modelo": "string", 
        "modelo_ano": "number",
        "combustible": "string",
        "caja": "string",
        "equipamiento": "array[string]", // NUEVO CAMPO
        "asistencias_manejo": "array[string]" // NUEVO CAMPO
      },
      "estado": {
        "id": "string (UUID)",
        "codigo": "string",
        "nombre": "string",
        "descripcion": "string"
      } | null,
      "vendedor": { // NUEVA RELACIÓN
        "id": "string (UUID)",
        "nombre": "string",
        "apellido": "string|null",
        "telefono": "string|null",
        "email": "string|null"
      } | null,
      "comprador": { // NUEVA RELACIÓN
        "id": "string (UUID)",
        "nombre": "string",
        "apellido": "string|null",
        "telefono": "string|null",
        "email": "string|null"
      } | null,
      "imagenes": [ // NUEVA RELACIÓN
        {
          "id": "string (UUID)",
          "url": "string",
          "descripcion": "string|null",
          "orden": "number",
          "es_principal": "boolean"
        }
      ]
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
**Descripción:** Obtener un vehículo por ID con información detallada
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
    "estado_id": "string (UUID)|null",
    "tipo_operacion": "string|null",
    "fecha_ingreso": "string (ISO date)|null",
    "observaciones": "string|null",
    "pendientes_preparacion": "array[string]|null", // NUEVO CAMPO
    "comentarios": "string|null", // NUEVO CAMPO
    "vendedor_id": "string (UUID)|null", // NUEVO CAMPO
    "comprador_id": "string (UUID)|null", // NUEVO CAMPO
    "activo": "boolean",
    "created_at": "string (ISO date)",
    "updated_at": "string (ISO date)",
    "empresa": {
      "id": "string (UUID)",
      "nombre": "string",
      "descripcion": "string|null"
    },
    "modelo_auto": {
      "id": "string (UUID)",
      "marca": "string",
      "modelo": "string",
      "version": "string|null",
      "modelo_ano": "number", 
      "combustible": "string",
      "caja": "string",
      "equipamiento": "array[string]", // NUEVO CAMPO
      "asistencias_manejo": "array[string]", // NUEVO CAMPO
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
    } | null,
    "vendedor": { // NUEVA RELACIÓN
      "id": "string (UUID)",
      "nombre": "string",
      "apellido": "string|null",
      "telefono": "string|null",
      "email": "string|null",
      "dni": "string|null",
      "ciudad": "string|null",
      "provincia": "string|null"
    } | null,
    "comprador": { // NUEVA RELACIÓN
      "id": "string (UUID)",
      "nombre": "string",
      "apellido": "string|null",
      "telefono": "string|null",
      "email": "string|null",
      "dni": "string|null",
      "ciudad": "string|null",
      "provincia": "string|null"
    } | null,
    "imagenes": [ // NUEVA RELACIÓN
      {
        "id": "string (UUID)",
        "url": "string",
        "descripcion": "string|null",
        "orden": "number",
        "es_principal": "boolean",
        "created_at": "string (ISO date)"
      }
    ],
    "publicaciones": [
      {
        "id": "string (UUID)",
        "vehiculo_id": "string (UUID)",
        "plataforma": "string",
        "url_publicacion": "string|null",
        "id_publicacion": "string|null",
        "titulo": "string",
        "ficha_breve": "string|null",
        "activo": "boolean",
        "created_at": "string (ISO date)",
        "updated_at": "string (ISO date)"
      }
    ]
  }
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
  "estado_codigo": "string (optional)",
  "estado_id": "string (UUID, optional)",
  "patente": "string (optional, max: 15 chars)",
  "kilometros": "number (optional, min: 0, default: 0)",
  "valor": "number (optional, positive)",
  "moneda": "string (optional, max: 10 chars, default: 'ARS')",
  "tipo_operacion": "string (optional)",
  "fecha_ingreso": "string (ISO date, optional)",
  "observaciones": "string (optional, max: 1000 chars)",
  "pendientes_preparacion": "array[string] (optional)", // NUEVO CAMPO
  "comentarios": "string (optional, max: 2000 chars)", // NUEVO CAMPO
  "vendedor_id": "string (UUID, optional)", // NUEVO CAMPO
  "comprador_id": "string (UUID, optional)" // NUEVO CAMPO
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
  "fecha_ingreso": "string (ISO date, optional)",
  "observaciones": "string (optional, max: 1000 chars)",
  "pendientes_preparacion": "array[string] (optional)", // NUEVO CAMPO
  "comentarios": "string (optional, max: 2000 chars)", // NUEVO CAMPO
  "vendedor_id": "string (UUID, optional)", // NUEVO CAMPO
  "comprador_id": "string (UUID, optional)" // NUEVO CAMPO
}
```

### DELETE /api/vehiculos/{id}
**Descripción:** Eliminar un vehículo (soft delete - marca como inactivo)
**Autenticación:** Requerida
**Permisos:** vehiculos.eliminar

---

## 👤 VENDEDORES (NUEVO)

### GET /api/vendedores
**Descripción:** Obtener lista de vendedores (personas que venden vehículos a la empresa)
**Autenticación:** Requerida
**Permisos:** vendedores.leer

**Query Parameters (todos opcionales):**
```
page: number (default: 1, min: 1)
limit: number (default: 12, min: 1, max: 100)
orderBy: string (default: "created_at")
order: string (default: "desc") // "asc" | "desc"
search: string (busca en nombre, apellido, teléfono, email, DNI)
```

**Response 200:**
```json
{
  "success": true,
  "message": "Vendedores obtenidos exitosamente",
  "vendedores": [
    {
      "id": "string (UUID)",
      "nombre": "string",
      "apellido": "string|null",
      "telefono": "string|null",
      "email": "string|null",
      "dni": "string|null",
      "ciudad": "string|null",
      "provincia": "string|null",
      "origen": "string|null",
      "activo": "boolean",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)",
      "_count": {
        "vehiculos": "number",
        "operaciones_compra": "number"
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

### GET /api/vendedores/{id}
**Descripción:** Obtener un vendedor por ID con información detallada
**Autenticación:** Requerida
**Permisos:** vendedores.leer

**Response 200:**
```json
{
  "success": true,
  "message": "Vendedor obtenido exitosamente",
  "vendedor": {
    "id": "string (UUID)",
    "nombre": "string",
    "apellido": "string|null",
    "telefono": "string|null",
    "email": "string|null",
    "dni": "string|null",
    "direccion": "string|null",
    "ciudad": "string|null",
    "provincia": "string|null",
    "codigo_postal": "string|null",
    "origen": "string|null",
    "comentarios": "string|null",
    "activo": "boolean",
    "created_at": "string (ISO date)",
    "updated_at": "string (ISO date)",
    "vehiculos": [
      {
        "id": "string (UUID)",
        "patente": "string|null",
        "modelo_auto": {
          "marca": "string",
          "modelo": "string",
          "version": "string|null",
          "modelo_ano": "number"
        },
        "estado": {
          "codigo": "string",
          "nombre": "string"
        }
      }
    ],
    "operaciones_compra": [
      {
        "id": "string (UUID)",
        "precio_compra": "string (decimal)",
        "fecha_compra": "string (ISO date)",
        "estado": "string",
        "vehiculo": {
          "modelo_auto": {
            "marca": "string",
            "modelo": "string",
            "modelo_ano": "number"
          },
          "patente": "string|null"
        }
      }
    ]
  }
}
```

### POST /api/vendedores
**Descripción:** Crear nuevo vendedor
**Autenticación:** Requerida
**Permisos:** vendedores.crear

**Request Body (JSON):**
```json
{
  "empresa_id": "string (UUID, required)",
  "nombre": "string (required, min: 2 chars, max: 200 chars)",
  "apellido": "string (optional, min: 2 chars, max: 200 chars)",
  "telefono": "string (optional, max: 20 chars)",
  "email": "string (optional, email format, max: 255 chars)",
  "dni": "string (optional, max: 20 chars)",
  "direccion": "string (optional, max: 500 chars)",
  "ciudad": "string (optional, max: 100 chars)",
  "provincia": "string (optional, max: 100 chars)",
  "codigo_postal": "string (optional, max: 10 chars)",
  "origen": "string (optional, max: 100 chars)",
  "comentarios": "string (optional, max: 1000 chars)"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Vendedor creado exitosamente",
  "vendedor": {
    "id": "string (UUID)",
    "nombre": "string",
    "apellido": "string|null",
    "telefono": "string|null",
    "email": "string|null",
    "dni": "string|null",
    "ciudad": "string|null",
    "provincia": "string|null",
    "origen": "string|null",
    "activo": "boolean",
    "created_at": "string (ISO date)"
  }
}
```

### PUT /api/vendedores/{id}
**Descripción:** Actualizar un vendedor existente
**Autenticación:** Requerida
**Permisos:** vendedores.editar

### DELETE /api/vendedores/{id}
**Descripción:** Eliminar un vendedor (soft delete)
**Autenticación:** Requerida
**Permisos:** vendedores.eliminar

---

## 🛒 COMPRADORES (NUEVO)

### GET /api/compradores
**Descripción:** Obtener lista de compradores (personas que compran vehículos de la empresa)
**Autenticación:** Requerida
**Permisos:** compradores.leer

**Query Parameters:** (similares a vendedores)

**Response 200:**
```json
{
  "success": true,
  "message": "Compradores obtenidos exitosamente",
  "compradores": [
    {
      "id": "string (UUID)",
      "empresa_id": "string (UUID)",
      "nombre": "string",
      "apellido": "string|null",
      "telefono": "string|null",
      "email": "string|null",
      "dni": "string|null",
      "ciudad": "string|null",
      "provincia": "string|null",
      "origen": "string|null",
      "activo": "boolean",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)",
      "empresa": {
        "id": "string (UUID)",
        "nombre": "string"
      },
      "_count": {
        "vehiculos": "number",
        "operaciones_venta": "number"
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

### POST /api/compradores
**Descripción:** Crear nuevo comprador
**Autenticación:** Requerida
**Permisos:** compradores.crear

**Request Body (JSON):** (similar a vendedores)

### Otros endpoints CRUD para compradores (GET /{id}, PUT, DELETE)

---

## 📷 IMÁGENES DE VEHÍCULOS (NUEVO)

### GET /api/imagenes
**Descripción:** Obtener todas las imágenes (con filtros por vehículo)
**Autenticación:** Requerida
**Permisos:** vehiculos.leer

**Query Parameters:**
```
vehiculo_id: string (UUID, optional) - Filtrar por vehículo específico
page: number (default: 1)
limit: number (default: 12)
```

### GET /api/vehiculos/{vehiculo_id}/imagenes
**Descripción:** Obtener todas las imágenes de un vehículo específico
**Autenticación:** Requerida
**Permisos:** vehiculos.leer

**Response 200:**
```json
{
  "success": true,
  "message": "Imágenes obtenidas exitosamente",
  "imagenes": [
    {
      "id": "string (UUID)",
      "vehiculo_id": "string (UUID)",
      "url": "string (URL de la imagen)",
      "descripcion": "string|null",
      "orden": "number",
      "es_principal": "boolean",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)"
    }
  ]
}
```

### POST /api/imagenes
**Descripción:** Agregar nueva imagen a un vehículo
**Autenticación:** Requerida
**Permisos:** vehiculos.editar

**Request Body (JSON):**
```json
{
  "vehiculo_id": "string (UUID, required)",
  "url": "string (required, URL format)",
  "descripcion": "string (optional, max: 500 chars)",
  "orden": "number (optional, positive, default: auto-calculado)",
  "es_principal": "boolean (optional, default: false)"
}
```

### PATCH /api/imagenes/{id}/principal
**Descripción:** Establecer una imagen como principal (desmarca las demás del mismo vehículo)
**Autenticación:** Requerida
**Permisos:** vehiculos.editar

---

## 📢 PUBLICACIONES

### GET /api/vehiculos/{vehiculo_id}/publicaciones
**Descripción:** Obtener todas las publicaciones de un vehículo
**Autenticación:** Requerida
**Permisos:** vehiculos.leer

### POST /api/vehiculos/{vehiculo_id}/publicaciones
**Descripción:** Crear nueva publicación para un vehículo
**Autenticación:** Requerida
**Permisos:** vehiculos.crear

**Request Body (JSON):**
```json
{
  "plataforma": "string (required)", // "facebook" | "web" | "mercadolibre" | "instagram" | "whatsapp" | "olx" | "autocosmos" | "otro"
  "titulo": "string (required, max: 200 chars)",
  "url_publicacion": "string (optional, URL format)",
  "id_publicacion": "string (optional, max: 100 chars)",
  "ficha_breve": "string (optional, max: 1000 chars)",
  "activo": "boolean (optional, default: true)"
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
      "descripcion": "string"
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
  "message": "Operación exitosa", 
  "empresas": [
    {
      "id": "string (UUID)",
      "nombre": "string",
      "descripcion": "string|null", 
      "logo_url": "string|null",
      "activa": "boolean",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)",
      "_count": {
        "usuarios": "number",
        "vehiculos": "number"
      }
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalItems": "number",
    "itemsPerPage": "number"
  }
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
  "environment": "production",
  "server": "https://api.fratelli.voonda.net"
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
  "message": "Token de acceso requerido" | "Token inválido" | "Token expirado"
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
  "message": "string"
}
```

---

## 💡 NOTAS PARA FRONTEND

### 🆕 NUEVAS CARACTERÍSTICAS

#### **Campos Nuevos en Vehículos:**
- `pendientes_preparacion`: Array de strings con tareas pendientes
- `comentarios`: Comentarios adicionales del vehículo
- `vendedor_id`/`comprador_id`: Referencias a vendedores y compradores
- `equipamiento`: Array de elementos de equipamiento en modelo_auto
- `asistencias_manejo`: Array de asistencias de manejo en modelo_auto

#### **Nuevas Entidades:**
- **Vendedores**: Personas que venden vehículos a la empresa
- **Compradores**: Personas que compran vehículos de la empresa  
- **Imágenes**: Sistema de gestión de imágenes por vehículo

#### **Relaciones Expandidas:**
- Vehículos ahora incluyen `vendedor`, `comprador` e `imagenes`
- Cada entidad mantiene contadores de relaciones (`_count`)

### Credenciales de prueba:
```
Admin General: admin@voonda.com / admin123
Admin Empresa: admin.empresa@voonda.com / admin123
Colaborador: colaborador@voonda.com / admin123
```

### Plataformas de publicación disponibles:
- `"facebook"` - Facebook Marketplace o páginas
- `"web"` - Sitio web de la empresa
- `"mercadolibre"` - MercadoLibre
- `"instagram"` - Instagram posts/stories
- `"whatsapp"` - WhatsApp Business
- `"olx"` - OLX
- `"autocosmos"` - AutoCosmos
- `"otro"` - Otras plataformas

### Estados de vehículos:
- `"salon"` - En Salón (disponible para venta)
- `"consignacion"` - En Consignación  
- `"pyc"` - Permuta y Compra
- `"preparacion"` - En Preparación
- `"vendido"` - Vendido (pendiente entrega)
- `"entregado"` - Entregado al cliente

### Autenticación:
- El token JWT expira en 24 horas
- Almacenar token en localStorage/sessionStorage
- Incluir token en header `Authorization: Bearer {token}`
- Manejar respuestas 401 para renovar token

### Sistema Multi-Empresa:
- Admins generales (`empresa_id: null`) pueden ver todas las empresas
- Admins/colaboradores de empresa solo ven datos de su empresa
- Los filtros por empresa se aplican automáticamente en el backend

### Paginación:
- Usar `page` y `limit` para paginación
- Response incluye objeto `pagination` con información completa
- `limit` máximo es 100

### Soft Delete:
- Los registros eliminados se marcan como `activo: false`
- Solo se muestran por defecto los registros activos

### 🚀 Ejemplos de Uso:

#### Crear vehículo con nuevos campos:
```json
{
  "modelo_id": "uuid-del-modelo",
  "vehiculo_ano": 2023,
  "vendedor_id": "uuid-del-vendedor",
  "pendientes_preparacion": [
    "Revisión mecánica",
    "Limpieza detallada",
    "Documentos al día"
  ],
  "comentarios": "Vehículo en excelente estado, único dueño"
}
```

#### Agregar imagen principal:
```json
{
  "vehiculo_id": "uuid-del-vehiculo",
  "url": "https://example.com/imagen.jpg",
  "descripcion": "Vista frontal",
  "es_principal": true,
  "orden": 1
}
# Voonda API - Documentación de Endpoints para Frontend

## Base URL: https://api.fratelli.voonda.net

## Autenticación
Todos los endpoints (excepto login y health checks) requieren header:
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
    } | null,
    "rol": {
      "id": "string (UUID)",
      "nombre": "string", // "colaborador" | "administrador_empresa" | "administrador_general"
      "descripcion": "string",
      "permisos": "object",
      "activo": "boolean"
    },
    "ultimo_login": "string (ISO date)|null",
    "created_at": "string (ISO date)"
  }
}
```

### GET /api/auth/me
**Descripción:** Obtener información del usuario autenticado
**Autenticación:** Requerida

**Response 200:**
```json
{
  "success": true,
  "message": "Información del usuario obtenida exitosamente",
  "user": {
    // Mismo formato que POST /api/auth/login
  }
}
```

### POST /api/auth/logout
**Descripción:** Cerrar sesión del usuario
**Autenticación:** Requerida

**Response 200:**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
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
      "estado_id": "string (UUID)|null",
      "tipo_operacion": "string|null",
      "fecha_ingreso": "string (ISO date)|null",
      "observaciones": "string|null",
      "activo": "boolean",
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
      } | null
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
**Descripción:** Obtener un vehículo por ID con información detallada
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
    "estado_id": "string (UUID)|null",
    "tipo_operacion": "string|null",
    "fecha_ingreso": "string (ISO date)|null",
    "observaciones": "string|null",
    "activo": "boolean",
    "created_at": "string (ISO date)",
    "updated_at": "string (ISO date)",
    "empresa": {
      "id": "string (UUID)",
      "nombre": "string",
      "descripcion": "string|null"
    },
    "modelo_auto": {
      "id": "string (UUID)",
      "marca": "string",
      "modelo": "string",
      "version": "string|null",
      "modelo_ano": "number", 
      "combustible": "string",
      "caja": "string",
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
    } | null,
    "publicaciones": [
      {
        "id": "string (UUID)",
        "vehiculo_id": "string (UUID)",
        "plataforma": "string", // "facebook" | "web" | "mercadolibre" | "instagram" | "whatsapp" | "olx" | "autocosmos" | "otro"
        "url_publicacion": "string|null",
        "id_publicacion": "string|null",
        "titulo": "string",
        "ficha_breve": "string|null",
        "activo": "boolean",
        "created_at": "string (ISO date)",
        "updated_at": "string (ISO date)"
      }
    ]
  }
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
**Descripción:** Eliminar un vehículo (soft delete - marca como inactivo)
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

## 📢 PUBLICACIONES

### GET /api/vehiculos/{vehiculo_id}/publicaciones
**Descripción:** Obtener todas las publicaciones de un vehículo
**Autenticación:** Requerida
**Permisos:** vehiculos.leer

**Path Parameters:**
```
vehiculo_id: string (UUID, required)
```

**Response 200:**
```json
{
  "success": true,
  "message": "Publicaciones obtenidas exitosamente",
  "publicaciones": [
    {
      "id": "string (UUID)",
      "vehiculo_id": "string (UUID)",
      "plataforma": "string", // "facebook" | "web" | "mercadolibre" | "instagram" | "whatsapp" | "olx" | "autocosmos" | "otro"
      "url_publicacion": "string|null",
      "id_publicacion": "string|null",
      "titulo": "string",
      "ficha_breve": "string|null",
      "activo": "boolean",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)"
    }
  ]
}
```

### POST /api/vehiculos/{vehiculo_id}/publicaciones
**Descripción:** Crear nueva publicación para un vehículo
**Autenticación:** Requerida
**Permisos:** vehiculos.crear

**Path Parameters:**
```
vehiculo_id: string (UUID, required)
```

**Request Body (JSON):**
```json
{
  "plataforma": "string (required)", // "facebook" | "web" | "mercadolibre" | "instagram" | "whatsapp" | "olx" | "autocosmos" | "otro"
  "titulo": "string (required, max: 200 chars)",
  "url_publicacion": "string (optional, URL format)",
  "id_publicacion": "string (optional, max: 100 chars)",
  "ficha_breve": "string (optional, max: 1000 chars)",
  "activo": "boolean (optional, default: true)"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Publicación creada exitosamente",
  "publicacion": {
    "id": "string (UUID)",
    "vehiculo_id": "string (UUID)",
    "plataforma": "string",
    "url_publicacion": "string|null",
    "id_publicacion": "string|null",
    "titulo": "string",
    "ficha_breve": "string|null",
    "activo": "boolean",
    "created_at": "string (ISO date)",
    "updated_at": "string (ISO date)"
  }
}
```

### PUT /api/publicaciones/{id}
**Descripción:** Actualizar una publicación existente
**Autenticación:** Requerida
**Permisos:** vehiculos.editar

**Path Parameters:**
```
id: string (UUID, required)
```

**Request Body (JSON, todos los campos opcionales):**
```json
{
  "plataforma": "string (optional)",
  "titulo": "string (optional, max: 200 chars)",
  "url_publicacion": "string (optional, URL format)",
  "id_publicacion": "string (optional, max: 100 chars)",
  "ficha_breve": "string (optional, max: 1000 chars)",
  "activo": "boolean (optional)"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Publicación actualizada exitosamente",
  "publicacion": {
    // Mismo formato que POST
  }
}
```

### DELETE /api/publicaciones/{id}
**Descripción:** Eliminar una publicación (soft delete)
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
  "message": "Publicación eliminada exitosamente"
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
      "descripcion": "string"
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
  "environment": "string",
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
  "message": "Token de acceso requerido" | "Token inválido" | "Token expirado"
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
  "message": "string"
}
```

---

## 💡 NOTAS PARA FRONTEND

### Credenciales de prueba:
```
Admin General: admin@voonda.com / admin123
Admin Empresa: admin.empresa@voonda.com / admin123
Colaborador: colaborador@voonda.com / admin123
```

### Plataformas de publicación disponibles:
- `"facebook"` - Facebook Marketplace o páginas
- `"web"` - Sitio web de la empresa
- `"mercadolibre"` - MercadoLibre
- `"instagram"` - Instagram posts/stories
- `"whatsapp"` - WhatsApp Business
- `"olx"` - OLX
- `"autocosmos"` - AutoCosmos
- `"otro"` - Otras plataformas

### Estados de vehículos:
- `"salon"` - En Salón (disponible para venta)
- `"consignacion"` - En Consignación  
- `"pyc"` - Permuta y Compra
- `"preparacion"` - En Preparación
- `"vendido"` - Vendido (pendiente entrega)
- `"entregado"` - Entregado al cliente

### Autenticación:
- El token JWT expira en 24 horas
- Almacenar token en localStorage/sessionStorage
- Incluir token en header `Authorization: Bearer {token}`
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

### Soft Delete:
- Los vehículos eliminados se marcan como `activo: false`
- Las publicaciones eliminadas se marcan como `activo: false`
- Solo se muestran por defecto los registros activos

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

---

## 📊 OPERACIONES (SISTEMA UNIFICADO)

### GET /api/operaciones
**Descripción:** Obtener lista de operaciones con filtros y paginación
**Autenticación:** Requerida

**Query Parameters:**
```
tipo?: "compra" | "venta" | "seña" | "transferencia" | "ingreso" | "entrega" | "devolucion"
estado?: "pendiente" | "en_proceso" | "completada" | "cancelada" | "suspendida"
fecha_desde?: "YYYY-MM-DD"
fecha_hasta?: "YYYY-MM-DD"
vehiculo_id?: "string (UUID)"
vendedor_id?: "string (UUID)"
comprador_id?: "string (UUID)"
search?: "string" // Busca en observaciones
page?: "number (default: 1)"
limit?: "number (default: 12, max: 100)"
orderBy?: "fecha" | "monto" | "tipo" | "estado" | "created_at" (default: "fecha")
order?: "asc" | "desc" (default: "desc")
```

**Response 200:**
```json
{
  "success": true,
  "message": "Operaciones obtenidas exitosamente",
  "data": {
    "operaciones": [
      {
        "id": "string (UUID)",
        "tipo": "compra" | "venta" | "seña" | "transferencia" | "ingreso" | "entrega" | "devolucion",
        "fecha": "string (ISO date)",
        "monto": "number",
        "moneda": "ARS" | "USD" | "EUR" | "BRL",
        "estado": "pendiente" | "en_proceso" | "completada" | "cancelada" | "suspendida",
        "observaciones": "string|null",
        "created_at": "string (ISO date)",
        "updated_at": "string (ISO date)",
        "vehiculo": {
          "id": "string (UUID)",
          "patente": "string",
          "modelo_auto": {
            "marca": "string",
            "modelo": "string",
            "version": "string",
            "modelo_ano": "number"
          }
        },
        "vendedor": {
          "id": "string (UUID)",
          "nombre": "string",
          "apellido": "string",
          "telefono": "string|null",
          "email": "string|null"
        } | null,
        "comprador": {
          "id": "string (UUID)", 
          "nombre": "string",
          "apellido": "string",
          "telefono": "string|null",
          "email": "string|null"
        } | null,
        "datos_especificos": "object|null" // JSON flexible según tipo
      }
    ],
    "pagination": {
      "total": "number",
      "page": "number",
      "limit": "number", 
      "pages": "number"
    }
  }
}
```

### GET /api/operaciones/:id
**Descripción:** Obtener operación específica por ID
**Autenticación:** Requerida

**Response 200:**
```json
{
  "success": true,
  "message": "Operación obtenida exitosamente",
  "data": {
    "operacion": {
      "id": "string (UUID)",
      "tipo": "compra" | "venta" | "seña" | "transferencia" | "ingreso" | "entrega" | "devolucion",
      "fecha": "string (ISO date)",
      "monto": "number",
      "moneda": "ARS" | "USD" | "EUR" | "BRL",
      "estado": "pendiente" | "en_proceso" | "completada" | "cancelada" | "suspendida", 
      "observaciones": "string|null",
      "datos_especificos": "object|null",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)",
      "empresa": {
        "id": "string (UUID)",
        "nombre": "string"
      },
      "vehiculo": {
        "id": "string (UUID)",
        "patente": "string",
        "vehiculo_ano": "number",
        "kilometros": "number|null",
        "valor": "number|null",
        "modelo_auto": {
          "marca": "string",
          "modelo": "string",
          "version": "string",
          "modelo_ano": "number",
          "combustible": "string",
          "caja": "string"
        },
        "estado": {
          "codigo": "string",
          "nombre": "string"
        }
      },
      "vendedor": {
        "id": "string (UUID)",
        "nombre": "string",
        "apellido": "string",
        "telefono": "string|null",
        "email": "string|null",
        "dni": "string|null",
        "ciudad": "string|null",
        "provincia": "string|null"
      } | null,
      "comprador": {
        "id": "string (UUID)",
        "nombre": "string", 
        "apellido": "string",
        "telefono": "string|null",
        "email": "string|null",
        "dni": "string|null",
        "ciudad": "string|null", 
        "provincia": "string|null"
      } | null
    }
  }
}
```

### POST /api/operaciones
**Descripción:** Crear nueva operación
**Autenticación:** Requerida

**Request Body (JSON):**
```json
{
  "tipo": "compra" | "venta" | "seña" | "transferencia" | "ingreso" | "entrega" | "devolucion",
  "fecha": "string (ISO date)", 
  "monto": "number (positive)",
  "moneda": "ARS" | "USD" | "EUR" | "BRL" (default: "ARS"),
  "estado": "pendiente" | "en_proceso" | "completada" | "cancelada" | "suspendida" (default: "pendiente"),
  "vehiculo_id": "string (UUID, required)",
  "vendedor_id": "string (UUID, optional)",
  "comprador_id": "string (UUID, optional)",
  "observaciones": "string (max 1000 chars, optional)",
  "datos_especificos": "object (optional)" // JSON específico del tipo
}
```

**Ejemplos de `datos_especificos` por tipo:**

**Compra:**
```json
{
  "forma_pago": "efectivo" | "transferencia" | "cheque" | "financiado",
  "descuento_aplicado": "number (0-100%)",
  "garantia_meses": "number",
  "documentacion_completa": "boolean",
  "precio_final": "number"
}
```

**Venta:**
```json
{
  "comision_vendedor": "number",
  "precio_lista": "number", 
  "descuento_otorgado": "number",
  "forma_entrega": "inmediata" | "programada" | "envio",
  "fecha_entrega": "string (ISO date)",
  "documentos_transferidos": "boolean"
}
```

**Seña:**
```json
{
  "monto_total_acordado": "number",
  "saldo_pendiente": "number",
  "fecha_vencimiento": "string (ISO date)",
  "condiciones_especiales": "string"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Operación creada exitosamente",
  "data": {
    "operacion": {
      "id": "string (UUID)",
      "tipo": "string",
      "fecha": "string (ISO date)",
      "monto": "number",
      "moneda": "string",
      "estado": "string",
      "observaciones": "string|null",
      "datos_especificos": "object|null",
      "created_at": "string (ISO date)",
      "vehiculo": {
        "id": "string (UUID)",
        "patente": "string",
        "modelo_auto": {
          "marca": "string",
          "modelo": "string",
          "modelo_ano": "number"
        }
      },
      "vendedor": {
        "id": "string (UUID)",
        "nombre": "string",
        "apellido": "string"
      } | null,
      "comprador": {
        "id": "string (UUID)",
        "nombre": "string", 
        "apellido": "string"
      } | null
    }
  }
}
```

### PUT /api/operaciones/:id
**Descripción:** Actualizar operación existente
**Autenticación:** Requerida

**Request Body (JSON):** (todos los campos opcionales)
```json
{
  "tipo": "compra" | "venta" | "seña" | "transferencia" | "ingreso" | "entrega" | "devolucion",
  "fecha": "string (ISO date)",
  "monto": "number (positive)",
  "moneda": "ARS" | "USD" | "EUR" | "BRL",
  "estado": "pendiente" | "en_proceso" | "completada" | "cancelada" | "suspendida",
  "vehiculo_id": "string (UUID)",
  "vendedor_id": "string (UUID)",
  "comprador_id": "string (UUID)",
  "observaciones": "string (max 1000 chars)",
  "datos_especificos": "object"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Operación actualizada exitosamente",
  "data": {
    "operacion": {
      "id": "string (UUID)",
      "tipo": "string",
      "fecha": "string (ISO date)",
      "monto": "number",
      "moneda": "string", 
      "estado": "string",
      "observaciones": "string|null",
      "datos_especificos": "object|null",
      "updated_at": "string (ISO date)"
    }
  }
}
```

### DELETE /api/operaciones/:id
**Descripción:** Eliminar operación
**Autenticación:** Requerida

**Response 200:**
```json
{
  "success": true,
  "message": "Operación eliminada exitosamente",
  "data": {
    "operacion": {
      "id": "string (UUID)",
      "tipo": "string",
      "fecha": "string (ISO date)"
    }
  }
}
```

### GET /api/operaciones/resumen
**Descripción:** Obtener resumen de operaciones por tipo
**Autenticación:** Requerida

**Query Parameters:**
```
fecha_desde?: "YYYY-MM-DD"
fecha_hasta?: "YYYY-MM-DD"
```

**Response 200:**
```json
{
  "success": true,
  "message": "Resumen obtenido exitosamente",
  "data": {
    "resumen": [
      {
        "tipo": "compra" | "venta" | "seña" | "transferencia" | "ingreso" | "entrega" | "devolucion",
        "cantidad": "number",
        "monto_total": "number", 
        "monto_promedio": "number"
      }
    ]
  }
}
```

---

## 💡 NOTAS PARA OPERACIONES

### Tipos de Operaciones:
- **compra**: Adquisición de vehículos
- **venta**: Venta de vehículos a clientes
- **seña**: Reserva con anticipo
- **transferencia**: Transferencia de propiedad
- **ingreso**: Entrada de vehículo al inventario
- **entrega**: Entrega física del vehículo
- **devolucion**: Devolución de vehículo

### Estados de Operaciones:
- **pendiente**: Operación registrada pero sin iniciar
- **en_proceso**: Operación en curso
- **completada**: Operación finalizada exitosamente
- **cancelada**: Operación cancelada
- **suspendida**: Operación suspendida temporalmente

### Datos Específicos (datos_especificos):
- Campo JSON flexible que permite almacenar información específica según el tipo de operación
- Cada tipo de operación tiene su propio schema de validación
- Permite extensibilidad sin cambios en la estructura de base de datos
- Ver ejemplos por tipo de operación en la documentación de creación

### Monedas Soportadas:
- **ARS**: Peso Argentino (default)
- **USD**: Dólar Estadounidense
- **EUR**: Euro
- **BRL**: Real Brasileño

### Filtros Avanzados:
- Combinar múltiples filtros para búsquedas específicas
- `search` busca texto libre en observaciones
- Usar rangos de fechas para períodos específicos
- Filtrar por entidades relacionadas (vehículo, vendedor, comprador)

### Multi-empresa:
- Todas las operaciones están filtradas automáticamente por la empresa del usuario
- Usuarios no pueden ver operaciones de otras empresas
- Administradores generales pueden ver todas las operaciones