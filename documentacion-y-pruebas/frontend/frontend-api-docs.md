# Voonda API - Documentación de Endpoints para Frontend# Voonda API - Documentación de Endpoints para Frontend



## Base URL: https://api.fratelli.voonda.net## Base URL: https://api.fratelli.voonda.net



## Autenticación## Autenticación

Todos los endpoints (excepto login y health checks) requieren header:Todos los endpoints (excepto login y health checks) requieren header:

``````

Authorization: Bearer <JWT_TOKEN>Authorization: Bearer <JWT_TOKEN>

``````



------



## 🔐 AUTENTICACIÓN## 🔐 AUTENTICACIÓN



### POST /api/auth/login### POST /api/auth/login

**Descripción:** Iniciar sesión y obtener token JWT**Descripción:** Iniciar sesión y obtener token JWT

**Autenticación:** No requerida**Autenticación:** No requerida



**Request Body (JSON):****Request Body (JSON):**

```json```json

{{

  "email": "string (required, email format)",   "email": "string (required, email format)", 

  "password": "string (required, min 6 chars)"  "password": "string (required, min 6 chars)"

}}

``````



**Response 200:****Response 200:**

```json```json

{{

  "success": true,  "success": true,

  "message": "Inicio de sesión exitoso",  "message": "Inicio de sesión exitoso",

  "token": "string (JWT token)",  "token": "string (JWT token)",

  "user": {  "user": {

    "id": "string (UUID)",    "id": "string (UUID)",

    "email": "string",    "email": "string",

    "nombre": "string",     "nombre": "string", 

    "apellido": "string",    "apellido": "string",

    "telefono": "string|null",    "telefono": "string|null",

    "empresa": {    "empresa": {

      "id": "string (UUID)",      "id": "string (UUID)",

      "nombre": "string",      "nombre": "string",

      "descripcion": "string|null",      "descripcion": "string|null",

      "logo_url": "string|null",      "logo_url": "string|null",

      "activa": "boolean"      "activa": "boolean"

    } | null,    } | null,

    "rol": {    "rol": {

      "id": "string (UUID)",      "id": "string (UUID)",

      "nombre": "string", // "colaborador" | "administrador_empresa" | "administrador_general"      "nombre": "string", // "colaborador" | "administrador_empresa" | "administrador_general"

      "descripcion": "string",      "descripcion": "string",

      "permisos": "object",      "permisos": "object",

      "activo": "boolean"      "activo": "boolean"

    },    },

    "ultimo_login": "string (ISO date)|null",    "ultimo_login": "string (ISO date)|null",

    "created_at": "string (ISO date)"    "created_at": "string (ISO date)"

  }  }

}}

``````



### GET /api/auth/me### GET /api/auth/me

**Descripción:** Obtener información del usuario autenticado**Descripción:** Obtener información del usuario autenticado

**Autenticación:** Requerida**Autenticación:** Requerida



### POST /api/auth/logout**Response 200:**

**Descripción:** Cerrar sesión del usuario```json

**Autenticación:** Requerida{

  "success": true,

---  "message": "Información del usuario obtenida exitosamente",

  "user": {

## 🚗 VEHÍCULOS    // Mismo formato que POST /api/auth/login

  }

### GET /api/vehiculos}

**Descripción:** Obtener lista de vehículos con filtros y paginación```

**Autenticación:** Requerida

### POST /api/auth/logout

**Query Parameters (todos opcionales):****Descripción:** Cerrar sesión del usuario

```**Autenticación:** Requerida

page: number (default: 1, min: 1)

limit: number (default: 12, min: 1, max: 100)  **Response 200:**

orderBy: string (default: "created_at")```json

order: string (default: "desc") // "asc" | "desc"{

estado_codigo: string  "success": true,

yearFrom: number (min: 1950, max: current year + 1)  "message": "Sesión cerrada exitosamente"

yearTo: number (min: 1950, max: current year + 1)}

priceFrom: number (positive)```

priceTo: number (positive) 

search: string (max: 100 chars, busca en marca/modelo)---

```

## 🚗 VEHÍCULOS

**Response 200:**

```json### GET /api/vehiculos

{**Descripción:** Obtener lista de vehículos con filtros y paginación

  "success": true,**Autenticación:** Requerida

  "message": "Vehículos obtenidos exitosamente",**Permisos:** vehiculos.leer

  "vehiculos": [

    {**Query Parameters (todos opcionales):**

      "id": "string (UUID)",```

      "empresa_id": "string (UUID)",page: number (default: 1, min: 1)

      "modelo_id": "string (UUID)", limit: number (default: 12, min: 1, max: 100)  

      "patente": "string|null",orderBy: string (default: "created_at") // "created_at" | "valor" | "vehiculo_ano" | "kilometros"

      "vehiculo_ano": "number",order: string (default: "desc") // "asc" | "desc"

      "kilometros": "number",estado_codigo: string // "salon" | "consignacion" | "pyc" | "preparacion" | "vendido" | "entregado"

      "valor": "string (decimal)|null",yearFrom: number (min: 1950, max: current year + 1)

      "moneda": "string",yearTo: number (min: 1950, max: current year + 1)

      "estado_id": "string (UUID)|null",priceFrom: number (positive)

      "pendientes_preparacion": "array[string]|null",priceTo: number (positive) 

      "comentarios": "string|null",search: string (max: 100 chars, busca en marca/modelo)

      "vendedor_id": "string (UUID)|null",```

      "comprador_id": "string (UUID)|null",

      "activo": "boolean",**Response 200:**

      "created_at": "string (ISO date)",```json

      "updated_at": "string (ISO date)",{

      "modelo_auto": {  "success": true,

        "marca": "string",  "message": "Vehículos obtenidos exitosamente",

        "modelo": "string",   "vehiculos": [

        "modelo_ano": "number",    {

        "combustible": "string",      "id": "string (UUID)",

        "caja": "string",      "empresa_id": "string (UUID)",

        "equipamiento": "array[string]",      "modelo_id": "string (UUID)", 

        "asistencias_manejo": "array[string]"      "patente": "string|null",

      },      "vehiculo_ano": "number",

      "estado": {      "kilometros": "number",

        "id": "string (UUID)",      "valor": "string (decimal)|null",

        "codigo": "string",      "moneda": "string",

        "nombre": "string",      "estado_id": "string (UUID)|null",

        "descripcion": "string"      "tipo_operacion": "string|null",

      } | null,      "fecha_ingreso": "string (ISO date)|null",

      "vendedor": {      "observaciones": "string|null",

        "id": "string (UUID)",      "pendientes_preparacion": "array[string]|null",

        "nombre": "string",      "comentarios": "string|null",

        "apellido": "string|null",      "vendedor_id": "string (UUID)|null",

        "telefono": "string|null"      "comprador_id": "string (UUID)|null",

      } | null,      "activo": "boolean",

      "comprador": {      "created_at": "string (ISO date)",

        "id": "string (UUID)",      "updated_at": "string (ISO date)",

        "nombre": "string",       "modelo_auto": {

        "apellido": "string|null",        "marca": "string",

        "telefono": "string|null"        "modelo": "string", 

      } | null,        "modelo_ano": "number",

      "imagenes": [        "combustible": "string",

        {        "caja": "string",

          "id": "string (UUID)",        "equipamiento": "array[string]",

          "url": "string",        "asistencias_manejo": "array[string]"

          "descripcion": "string|null",      },

          "orden": "number",      "estado": {

          "es_principal": "boolean"        "id": "string (UUID)",

        }        "codigo": "string",

      ],        "nombre": "string",

      "publicaciones": [        "descripcion": "string"

        {      } | null,

          "id": "string (UUID)",      "vendedor": {

          "plataforma": "string",        "id": "string (UUID)",

          "titulo": "string",        "nombre": "string",

          "activo": "boolean"        "apellido": "string|null",

        }        "telefono": "string|null",

      ]        "email": "string|null"

    }      } | null,

  ],      "comprador": {

  "pagination": {        "id": "string (UUID)",

    "total": "number",        "nombre": "string",

    "page": "number",         "apellido": "string|null",

    "limit": "number",        "telefono": "string|null",

    "pages": "number"        "email": "string|null"

  }      } | null,

}      "imagenes": [

```        {

          "id": "string (UUID)",

### GET /api/vehiculos/{id}          "url": "string",

**Descripción:** Obtener un vehículo por ID con información detallada          "descripcion": "string|null",

          "orden": "number",

### POST /api/vehiculos          "es_principal": "boolean"

**Descripción:** Crear nuevo vehículo        }

      ]

### PUT /api/vehiculos/{id}    }

**Descripción:** Actualizar un vehículo existente  ],

  "pagination": {

### DELETE /api/vehiculos/{id}    "total": "number",

**Descripción:** Eliminar un vehículo (soft delete)    "page": "number", 

    "limit": "number",

---    "pages": "number"

  }

## 👤 VENDEDORES}

```

### GET /api/vendedores

**Descripción:** Obtener lista de vendedores (personas que venden vehículos a la empresa)### GET /api/vehiculos/{id}

**Autenticación:** Requerida**Descripción:** Obtener un vehículo por ID con información detallada

**Autenticación:** Requerida

**Query Parameters (todos opcionales):****Permisos:** vehiculos.leer

```

page: number (default: 1, min: 1)**Path Parameters:**

limit: number (default: 12, min: 1, max: 100)```

orderBy: string (default: "created_at")id: string (UUID, required)

order: string (default: "desc")```

search: string (busca en nombre, apellido, teléfono, email, DNI)

```**Response 200:**

```json

**Response 200:**{

```json  "success": true,

{  "message": "Vehículo obtenido exitosamente", 

  "success": true,  "vehiculo": {

  "message": "Vendedores obtenidos exitosamente",    "id": "string (UUID)",

  "vendedores": [    "empresa_id": "string (UUID)",

    {    "modelo_id": "string (UUID)",

      "id": "string (UUID)",    "patente": "string|null",

      "empresa_id": "string (UUID)",    "vehiculo_ano": "number",

      "nombre": "string",    "kilometros": "number", 

      "apellido": "string|null",    "valor": "string (decimal)|null",

      "telefono": "string|null",    "moneda": "string",

      "email": "string|null",    "estado_id": "string (UUID)|null",

      "dni": "string|null",    "tipo_operacion": "string|null",

      "ciudad": "string|null",    "fecha_ingreso": "string (ISO date)|null",

      "provincia": "string|null",    "observaciones": "string|null",

      "origen": "string|null",    "pendientes_preparacion": "array[string]|null",

      "activo": "boolean",    "comentarios": "string|null",

      "created_at": "string (ISO date)",    "vendedor_id": "string (UUID)|null",

      "updated_at": "string (ISO date)",    "comprador_id": "string (UUID)|null",

      "_count": {    "activo": "boolean",

        "vehiculos": "number",    "created_at": "string (ISO date)",

        "operaciones": "number"    "updated_at": "string (ISO date)",

      }    "empresa": {

    }      "id": "string (UUID)",

  ],      "nombre": "string",

  "pagination": {      "descripcion": "string|null"

    "total": "number",    },

    "page": "number",    "modelo_auto": {

    "limit": "number",      "id": "string (UUID)",

    "pages": "number"      "marca": "string",

  }      "modelo": "string",

}      "version": "string|null",

```      "modelo_ano": "number", 

      "combustible": "string",

### GET /api/vendedores/{id}      "caja": "string",

**Descripción:** Obtener un vendedor por ID con información detallada      "equipamiento": "array[string]",

      "asistencias_manejo": "array[string]",

### POST /api/vendedores      "motorizacion": "string|null",

**Descripción:** Crear nuevo vendedor      "traccion": "string|null",

      "puertas": "number|null",

### PUT /api/vendedores/{id}      "segmento_modelo": "string|null",

**Descripción:** Actualizar un vendedor existente      "cilindrada": "number|null",

      "potencia_hp": "number|null",

### DELETE /api/vendedores/{id}      "torque_nm": "number|null"

**Descripción:** Eliminar un vendedor (soft delete)    },

    "estado": {

---      "id": "string (UUID)",

      "codigo": "string", 

## 🛒 COMPRADORES      "nombre": "string",

      "descripcion": "string"

### GET /api/compradores    } | null,

**Descripción:** Obtener lista de compradores (personas que compran vehículos de la empresa)    "vendedor": {

**Autenticación:** Requerida      "id": "string (UUID)",

      "nombre": "string",

**Response 200:**      "apellido": "string|null",

```json      "telefono": "string|null",

{      "email": "string|null",

  "success": true,      "dni": "string|null",

  "message": "Compradores obtenidos exitosamente",      "ciudad": "string|null",

  "compradores": [      "provincia": "string|null"

    {    } | null,

      "id": "string (UUID)",    "comprador": {

      "empresa_id": "string (UUID)",      "id": "string (UUID)",

      "nombre": "string",      "nombre": "string",

      "apellido": "string|null",      "apellido": "string|null",

      "telefono": "string|null",      "telefono": "string|null",

      "email": "string|null",      "email": "string|null",

      "dni": "string|null",      "dni": "string|null",

      "ciudad": "string|null",      "ciudad": "string|null",

      "provincia": "string|null",      "provincia": "string|null"

      "origen": "string|null",    } | null,

      "activo": "boolean",    "imagenes": [

      "created_at": "string (ISO date)",      {

      "updated_at": "string (ISO date)",        "id": "string (UUID)",

      "_count": {        "url": "string",

        "vehiculos": "number",        "descripcion": "string|null",

        "operaciones": "number"        "orden": "number",

      }        "es_principal": "boolean",

    }        "created_at": "string (ISO date)"

  ],      }

  "pagination": {    ],

    "total": "number",    "publicaciones": [

    "page": "number",      {

    "limit": "number",        "id": "string (UUID)",

    "pages": "number"        "vehiculo_id": "string (UUID)",

  }        "plataforma": "string",

}        "url_publicacion": "string|null",

```        "id_publicacion": "string|null",

        "titulo": "string",

### POST /api/compradores        "ficha_breve": "string|null",

**Descripción:** Crear nuevo comprador        "activo": "boolean",

        "created_at": "string (ISO date)",

### Otros endpoints CRUD para compradores (GET /{id}, PUT, DELETE)        "updated_at": "string (ISO date)"

      }

---    ]

  }

## 💼 OPERACIONES}

```

### GET /api/operaciones

**Descripción:** Obtener lista de operaciones (compras y ventas) con filtros y paginación### POST /api/vehiculos

**Autenticación:** Requerida**Descripción:** Crear nuevo vehículo

**Autenticación:** Requerida

**Query Parameters (todos opcionales):****Permisos:** vehiculos.crear

```

page: number (default: 1, min: 1)**Request Body (JSON):**

limit: number (default: 12, min: 1, max: 100)```json

orderBy: string (default: "created_at"){

order: string (default: "desc")  "modelo_id": "string (UUID, required)",

tipo: string // "compra" | "venta"  "vehiculo_ano": "number (required, min: 1950, max: current year + 1)",

estado: string // "pendiente" | "completada" | "cancelada"  "estado_codigo": "string (optional)",

fechaFrom: string (ISO date)  "estado_id": "string (UUID, optional)",

fechaTo: string (ISO date)  "patente": "string (optional, max: 15 chars)",

vendedor_id: string (UUID)  "kilometros": "number (optional, min: 0, default: 0)",

comprador_id: string (UUID)  "valor": "number (optional, positive)",

vehiculo_id: string (UUID)  "moneda": "string (optional, max: 10 chars, default: 'ARS')",

search: string (busca en observaciones)  "tipo_operacion": "string (optional)",

```  "fecha_ingreso": "string (ISO date, optional)",

  "observaciones": "string (optional, max: 1000 chars)",

**Response 200:**  "pendientes_preparacion": "array[string] (optional)",

```json  "comentarios": "string (optional, max: 2000 chars)",

{  "vendedor_id": "string (UUID, optional)",

  "success": true,  "comprador_id": "string (UUID, optional)"

  "message": "Operaciones obtenidas exitosamente",}

  "operaciones": [```

    {

      "id": "string (UUID)",**Response 201:**

      "empresa_id": "string (UUID)",```json

      "vehiculo_id": "string (UUID)",{

      "vendedor_id": "string (UUID)|null",  "success": true,

      "comprador_id": "string (UUID)|null",  "message": "Vehículo creado exitosamente",

      "tipo": "string", // "compra" | "venta"  "vehiculo": {

      "precio": "string (decimal)",    // Mismo formato que GET /api/vehiculos/{id}

      "moneda": "string",  }

      "fecha": "string (ISO date)",}

      "estado": "string", // "pendiente" | "completada" | "cancelada"```

      "metodo_pago": "string|null",

      "observaciones": "string|null",### PUT /api/vehiculos/{id}

      "datos_especificos": "object|null",**Descripción:** Actualizar un vehículo existente

      "activo": "boolean",**Autenticación:** Requerida

      "created_at": "string (ISO date)",**Permisos:** vehiculos.editar

      "updated_at": "string (ISO date)",

      "vehiculo": {**Path Parameters:**

        "id": "string (UUID)",```

        "patente": "string|null",id: string (UUID, required)

        "modelo_auto": {```

          "marca": "string",

          "modelo": "string",**Request Body (JSON, todos los campos opcionales):**

          "modelo_ano": "number"```json

        }{

      },  "modelo_id": "string (UUID, optional)",

      "vendedor": {  "vehiculo_ano": "number (optional, min: 1950, max: current year + 1)",

        "id": "string (UUID)",  "estado_codigo": "string (optional)", 

        "nombre": "string",  "estado_id": "string (UUID, optional)",

        "apellido": "string|null"  "patente": "string (optional, max: 15 chars)",

      } | null,  "kilometros": "number (optional, min: 0)",

      "comprador": {  "valor": "number (optional, positive)",

        "id": "string (UUID)",  "moneda": "string (optional, max: 10 chars)",

        "nombre": "string",  "tipo_operacion": "string (optional)",

        "apellido": "string|null"  "fecha_ingreso": "string (ISO date, optional)",

      } | null  "observaciones": "string (optional, max: 1000 chars)",

    }  "pendientes_preparacion": "array[string] (optional)",

  ],  "comentarios": "string (optional, max: 2000 chars)",

  "pagination": {  "vendedor_id": "string (UUID, optional)",

    "total": "number",  "comprador_id": "string (UUID, optional)"

    "page": "number",}

    "limit": "number",```

    "pages": "number"

  }### DELETE /api/vehiculos/{id}

}**Descripción:** Eliminar un vehículo (soft delete - marca como inactivo)

```**Autenticación:** Requerida

**Permisos:** vehiculos.eliminar

### GET /api/operaciones/{id}

**Descripción:** Obtener una operación por ID con información detallada---



### POST /api/operaciones## 👤 VENDEDORES

**Descripción:** Crear nueva operación (compra o venta)

### GET /api/vendedores

**Request Body (JSON):****Descripción:** Obtener lista de vendedores (personas que venden vehículos a la empresa)

```json**Autenticación:** Requerida

{**Permisos:** vendedores.leer

  "vehiculo_id": "string (UUID, required)",

  "tipo": "string (required)", // "compra" | "venta"**Query Parameters (todos opcionales):**

  "vendedor_id": "string (UUID, opcional)", // Requerido si tipo = "compra"```

  "comprador_id": "string (UUID, opcional)", // Requerido si tipo = "venta"page: number (default: 1, min: 1)

  "precio": "number (required, positive)",limit: number (default: 12, min: 1, max: 100)

  "moneda": "string (optional, default: 'ARS')",orderBy: string (default: "created_at")

  "fecha": "string (ISO date, required)",order: string (default: "desc") // "asc" | "desc"

  "estado": "string (optional, default: 'pendiente')",search: string (busca en nombre, apellido, teléfono, email, DNI)

  "metodo_pago": "string (optional)",```

  "observaciones": "string (optional)"

}**Response 200:**

``````json

{

### PUT /api/operaciones/{id}  "success": true,

**Descripción:** Actualizar una operación existente  "message": "Vendedores obtenidos exitosamente",

  "vendedores": [

### DELETE /api/operaciones/{id}    {

**Descripción:** Eliminar una operación (soft delete)      "id": "string (UUID)",

      "nombre": "string",

---      "apellido": "string|null",

      "telefono": "string|null",

## 📷 IMÁGENES      "email": "string|null",

      "dni": "string|null",

### GET /api/imagenes      "ciudad": "string|null",

**Descripción:** Obtener todas las imágenes (con filtros)      "provincia": "string|null",

**Autenticación:** Requerida      "origen": "string|null",

      "activo": "boolean",

**Query Parameters:**      "created_at": "string (ISO date)",

```      "updated_at": "string (ISO date)",

tipo: string (opcional) // "vehiculo" | "perfil" | "documento" | "logo" | "banner" | "otro"      "_count": {

vehiculo_id: string (UUID, opcional) - Solo para imágenes de vehículos        "vehiculos": "number",

page: number (default: 1)        "operaciones": "number"

limit: number (default: 12)      }

```    }

  ],

**Response 200:**  "pagination": {

```json    "total": "number",

{    "page": "number",

  "success": true,    "limit": "number",

  "message": "Imágenes obtenidas exitosamente",    "pages": "number"

  "imagenes": [  }

    {}

      "id": "string (UUID)",```

      "nombre": "string",

      "url": "string",### GET /api/vendedores/{id}

      "tipo": "string", // "vehiculo" | "perfil" | "documento" | "logo" | "banner" | "otro"**Descripción:** Obtener un vendedor por ID con información detallada

      "descripcion": "string|null",**Autenticación:** Requerida

      "tamaño": "number|null", // tamaño en bytes**Permisos:** vendedores.leer

      "formato": "string|null", // "jpg" | "png" | "pdf" | etc.

      "activo": "boolean",**Response 200:**

      "created_at": "string (ISO date)",```json

      "updated_at": "string (ISO date)"{

    }  "success": true,

  ],  "message": "Vendedor obtenido exitosamente",

  "pagination": {  "vendedor": {

    "total": "number",    "id": "string (UUID)",

    "page": "number",    "nombre": "string",

    "limit": "number",     "apellido": "string|null",

    "pages": "number"    "telefono": "string|null",

  }    "email": "string|null",

}    "dni": "string|null",

```    "direccion": "string|null",

    "ciudad": "string|null",

### GET /api/vehiculos/{vehiculo_id}/imagenes    "provincia": "string|null",

**Descripción:** Obtener todas las imágenes de un vehículo específico    "codigo_postal": "string|null",

    "origen": "string|null",

**Response 200:**    "comentarios": "string|null",

```json    "activo": "boolean",

{    "created_at": "string (ISO date)",

  "success": true,    "updated_at": "string (ISO date)",

  "message": "Imágenes obtenidas exitosamente",    "vehiculos": [

  "imagenes": [      {

    {        "id": "string (UUID)",

      "id": "string (UUID)",        "patente": "string|null",

      "vehiculo_id": "string (UUID)",        "modelo_auto": {

      "url": "string",          "marca": "string",

      "descripcion": "string|null",          "modelo": "string",

      "orden": "number",          "version": "string|null",

      "es_principal": "boolean",          "modelo_ano": "number"

      "activo": "boolean",        },

      "created_at": "string (ISO date)",        "estado": {

      "updated_at": "string (ISO date)"          "codigo": "string",

    }          "nombre": "string"

  ]        }

}      }

```    ],

    "operaciones": [

### POST /api/imagenes      {

**Descripción:** Agregar nueva imagen general        "id": "string (UUID)",

        "tipo_operacion": "string", // "compra" | "venta"

**Request Body (JSON):**        "precio": "string (decimal)",

```json        "fecha_operacion": "string (ISO date)",

{        "estado": "string", // "pendiente" | "completada" | "cancelada"

  "nombre": "string (required, max: 200 chars)",        "vehiculo": {

  "url": "string (required, URL format)",          "modelo_auto": {

  "tipo": "string (required)", // "vehiculo" | "perfil" | "documento" | "logo" | "banner" | "otro"            "marca": "string",

  "descripcion": "string (optional)",            "modelo": "string",

  "tamaño": "number (optional)", // tamaño en bytes            "modelo_ano": "number"

  "formato": "string (optional)" // "jpg" | "png" | "pdf" | etc.          },

}          "patente": "string|null"

```        }

      }

### POST /api/imagenes/vehiculo    ]

**Descripción:** Agregar nueva imagen a un vehículo  }

}

**Request Body (JSON):**```

```json

{### POST /api/vendedores

  "vehiculo_id": "string (UUID, required)",**Descripción:** Crear nuevo vendedor

  "url": "string (required, URL format)",**Autenticación:** Requerida

  "descripcion": "string (optional)",**Permisos:** vendedores.crear

  "orden": "number (optional, positive)",

  "es_principal": "boolean (optional, default: false)"**Request Body (JSON):**

}```json

```{

  "empresa_id": "string (UUID, required)",

### PATCH /api/imagenes/{id}/principal  "nombre": "string (required, min: 2 chars, max: 200 chars)",

**Descripción:** Establecer una imagen como principal (desmarca las demás del mismo vehículo)  "apellido": "string (optional, min: 2 chars, max: 200 chars)",

  "telefono": "string (optional, max: 20 chars)",

### DELETE /api/imagenes/{id}  "email": "string (optional, email format, max: 255 chars)",

**Descripción:** Eliminar una imagen (soft delete)  "dni": "string (optional, max: 20 chars)",

  "direccion": "string (optional, max: 500 chars)",

---  "ciudad": "string (optional, max: 100 chars)",

  "provincia": "string (optional, max: 100 chars)",

## 📢 PUBLICACIONES  "codigo_postal": "string (optional, max: 10 chars)",

  "origen": "string (optional, max: 100 chars)",

### GET /api/vehiculos/{vehiculo_id}/publicaciones  "comentarios": "string (optional, max: 1000 chars)"

**Descripción:** Obtener todas las publicaciones de un vehículo}

```

**Response 200:**

```json**Response 201:**

{```json

  "success": true,{

  "message": "Publicaciones obtenidas exitosamente",  "success": true,

  "publicaciones": [  "message": "Vendedor creado exitosamente",

    {  "vendedor": {

      "id": "string (UUID)",    "id": "string (UUID)",

      "vehiculo_id": "string (UUID)",    "nombre": "string",

      "plataforma": "string", // "facebook" | "web" | "mercadolibre" | "instagram" | "whatsapp" | "olx" | "autocosmos" | "otro"    "apellido": "string|null",

      "url_publicacion": "string|null",    "telefono": "string|null",

      "id_publicacion": "string|null",    "email": "string|null",

      "titulo": "string",    "dni": "string|null",

      "ficha_breve": "string|null",    "ciudad": "string|null",

      "activo": "boolean",    "provincia": "string|null",

      "created_at": "string (ISO date)",    "origen": "string|null",

      "updated_at": "string (ISO date)"    "activo": "boolean",

    }    "created_at": "string (ISO date)"

  ]  }

}}

``````



### POST /api/vehiculos/{vehiculo_id}/publicaciones### PUT /api/vendedores/{id}

**Descripción:** Crear nueva publicación para un vehículo**Descripción:** Actualizar un vendedor existente

**Autenticación:** Requerida

**Request Body (JSON):****Permisos:** vendedores.editar

```json

{### DELETE /api/vendedores/{id}

  "plataforma": "string (required)", // "facebook" | "web" | "mercadolibre" | "instagram" | "whatsapp" | "olx" | "autocosmos" | "otro"**Descripción:** Eliminar un vendedor (soft delete)

  "titulo": "string (required, max: 200 chars)",**Autenticación:** Requerida

  "url_publicacion": "string (optional, URL format)",**Permisos:** vendedores.eliminar

  "id_publicacion": "string (optional, max: 100 chars)",

  "ficha_breve": "string (optional, max: 1000 chars)",---

  "activo": "boolean (optional, default: true)"

}## 🛒 COMPRADORES

```

### GET /api/compradores

### PUT /api/publicaciones/{id}**Descripción:** Obtener lista de compradores (personas que compran vehículos de la empresa)

**Descripción:** Actualizar una publicación existente**Autenticación:** Requerida

**Permisos:** compradores.leer

### DELETE /api/publicaciones/{id}

**Descripción:** Eliminar una publicación (soft delete)**Query Parameters:** (similares a vendedores)



---**Response 200:**

```json

## 📊 ESTADOS DE VEHÍCULOS{

  "success": true,

### GET /api/estados  "message": "Compradores obtenidos exitosamente",

**Descripción:** Obtener todos los estados de vehículos disponibles  "compradores": [

**Autenticación:** Requerida    {

      "id": "string (UUID)",

**Response 200:**      "empresa_id": "string (UUID)",

```json      "nombre": "string",

{      "apellido": "string|null",

  "success": true,      "telefono": "string|null",

  "message": "Estados obtenidos exitosamente",      "email": "string|null",

  "estados": [      "dni": "string|null",

    {      "ciudad": "string|null",

      "id": "string (UUID)",      "provincia": "string|null",

      "codigo": "string", // "DISPONIBLE" | "RESERVADO" | "VENDIDO" | "EN_REPARACION" | "EN_TRANSITO" | "MANTENIMIENTO" | "BAJA"      "origen": "string|null",

      "nombre": "string", // "Disponible" | "Reservado" | "Vendido" | etc.      "activo": "boolean",

      "descripcion": "string",      "created_at": "string (ISO date)",

      "activo": "boolean"      "updated_at": "string (ISO date)",

    }      "empresa": {

  ]        "id": "string (UUID)",

}        "nombre": "string"

```      },

      "_count": {

### POST /api/estados        "vehiculos": "number",

**Descripción:** Crear nuevo estado de vehículo (solo administradores)        "operaciones": "number"

      }

**Request Body (JSON):**    }

```json  ],

{  "pagination": {

  "codigo": "string (required, unique, max: 50 chars)",    "total": "number",

  "nombre": "string (required, max: 100 chars)",    "page": "number",

  "descripcion": "string (optional)",    "limit": "number",

  "activo": "boolean (optional, default: true)"    "pages": "number"

}  }

```}

```

### PUT /api/estados/{id}

**Descripción:** Actualizar un estado existente### POST /api/compradores

**Descripción:** Crear nuevo comprador

### DELETE /api/estados/{id}**Autenticación:** Requerida

**Descripción:** Desactivar un estado (soft delete)**Permisos:** compradores.crear



---**Request Body (JSON):** (similar a vendedores)



## 🏢 EMPRESAS### Otros endpoints CRUD para compradores (GET /{id}, PUT, DELETE)



### GET /api/empresas---

**Descripción:** Obtener lista de empresas (solo admin general)

**Autenticación:** Requerida## 💼 OPERACIONES

**Permisos:** empresas.leer

### GET /api/operaciones

**Response 200:****Descripción:** Obtener lista de operaciones (compras y ventas) con filtros y paginación

```json**Autenticación:** Requerida

{**Permisos:** operaciones.leer

  "success": true,

  "message": "Empresas obtenidas exitosamente", **Query Parameters (todos opcionales):**

  "empresas": [```

    {page: number (default: 1, min: 1)

      "id": "string (UUID)",limit: number (default: 12, min: 1, max: 100)

      "nombre": "string",orderBy: string (default: "created_at") // "created_at" | "fecha_operacion" | "precio"

      "descripcion": "string|null", order: string (default: "desc") // "asc" | "desc"

      "logo_url": "string|null",tipo_operacion: string // "compra" | "venta"

      "activa": "boolean",estado: string // "pendiente" | "completada" | "cancelada"

      "created_at": "string (ISO date)",fechaFrom: string (ISO date, opcional)

      "updated_at": "string (ISO date)",fechaTo: string (ISO date, opcional)

      "_count": {vendedor_id: string (UUID, opcional)

        "usuarios": "number",comprador_id: string (UUID, opcional)

        "vehiculos": "number"vehiculo_id: string (UUID, opcional)

      }search: string (busca en observaciones, método de pago)

    }```

  ],

  "pagination": {**Response 200:**

    "total": "number",```json

    "page": "number",{

    "limit": "number",  "success": true,

    "pages": "number"  "message": "Operaciones obtenidas exitosamente",

  }  "operaciones": [

}    {

```      "id": "string (UUID)",

      "empresa_id": "string (UUID)",

---      "vehiculo_id": "string (UUID)",

      "vendedor_id": "string (UUID)|null",

## 🔍 HEALTH CHECKS      "comprador_id": "string (UUID)|null",

      "tipo_operacion": "string", // "compra" | "venta"

### GET /health      "precio": "string (decimal)",

**Descripción:** Verificar estado del servidor      "moneda": "string",

**Autenticación:** No requerida      "fecha_operacion": "string (ISO date)",

      "estado": "string", // "pendiente" | "completada" | "cancelada"

**Response 200:**      "metodo_pago": "string|null",

```json      "observaciones": "string|null",

{      "documentos_pendientes": "array[string]|null",

  "status": "OK",      "activo": "boolean",

  "message": "Voonda API with Prisma ORM is running",      "created_at": "string (ISO date)",

  "environment": "production",      "updated_at": "string (ISO date)",

  "server": "https://api.fratelli.voonda.net"      "vehiculo": {

}        "id": "string (UUID)",

```        "patente": "string|null",

        "modelo_auto": {

### GET /db-health          "marca": "string",

**Descripción:** Verificar conectividad con base de datos          "modelo": "string",

**Autenticación:** No requerida          "modelo_ano": "number"

        }

---      },

      "vendedor": {

## ⚠️ RESPUESTAS DE ERROR COMUNES        "id": "string (UUID)",

        "nombre": "string",

### 400 - Bad Request        "apellido": "string|null",

```json        "telefono": "string|null"

{      } | null,

  "success": false,      "comprador": {

  "error": "Datos inválidos",        "id": "string (UUID)",

  "message": "string",        "nombre": "string",

  "details": [        "apellido": "string|null",

    {        "telefono": "string|null"

      "field": "string",       } | null

      "message": "string"    }

    }  ],

  ]  "pagination": {

}    "total": "number",

```    "page": "number",

    "limit": "number",

### 401 - Unauthorized    "pages": "number"

```json  }

{}

  "success": false,```

  "message": "Token de acceso requerido" | "Token inválido" | "Token expirado"

}### GET /api/operaciones/{id}

```**Descripción:** Obtener una operación por ID con información detallada

**Autenticación:** Requerida

### 403 - Forbidden**Permisos:** operaciones.leer

```json

{**Response 200:**

  "success": false,```json

  "message": "No tienes permisos para realizar esta acción"{

}  "success": true,

```  "message": "Operación obtenida exitosamente",

  "operacion": {

### 404 - Not Found    "id": "string (UUID)",

```json    "empresa_id": "string (UUID)",

{    "vehiculo_id": "string (UUID)",

  "success": false,    "vendedor_id": "string (UUID)|null",

  "error": "Recurso no encontrado",    "comprador_id": "string (UUID)|null",

  "message": "string"    "tipo_operacion": "string",

}    "precio": "string (decimal)",

```    "moneda": "string",

    "fecha_operacion": "string (ISO date)",

### 500 - Internal Server Error    "estado": "string",

```json    "metodo_pago": "string|null",

{    "observaciones": "string|null",

  "success": false,    "documentos_pendientes": "array[string]|null",

  "error": "Error interno del servidor",    "activo": "boolean",

  "message": "string"    "created_at": "string (ISO date)",

}    "updated_at": "string (ISO date)",

```    "vehiculo": {

      "id": "string (UUID)",

---      "patente": "string|null",

      "vehiculo_ano": "number",

## 💡 NOTAS PARA FRONTEND      "kilometros": "number",

      "modelo_auto": {

### 🆕 NUEVAS ENTIDADES Y CARACTERÍSTICAS        "marca": "string",

        "modelo": "string",

#### **Estados de Vehículos:**        "modelo_ano": "number",

- `DISPONIBLE` - Vehículo disponible para la venta        "combustible": "string",

- `RESERVADO` - Vehículo reservado por un cliente        "caja": "string"

- `VENDIDO` - Vehículo vendido      }

- `EN_REPARACION` - Vehículo en proceso de reparación    },

- `EN_TRANSITO` - Vehículo en proceso de traslado    "vendedor": {

- `MANTENIMIENTO` - Vehículo en mantenimiento preventivo      "id": "string (UUID)",

- `BAJA` - Vehículo dado de baja del inventario      "nombre": "string",

      "apellido": "string|null",

#### **Sistema de Imágenes:**      "telefono": "string|null",

- **Imágenes Generales**: Sistema para todo tipo de imágenes (logos, banners, documentos, etc.)      "email": "string|null",

- **Imágenes de Vehículos**: Específicas para vehículos con orden y marcado de principal      "dni": "string|null"

- Tipos: `vehiculo`, `perfil`, `documento`, `logo`, `banner`, `otro`    } | null,

- Formatos soportados: `jpg`, `jpeg`, `png`, `gif`, `pdf`, `webp`    "comprador": {

      "id": "string (UUID)",

#### **Sistema de Publicaciones:**      "nombre": "string",

- Gestión de publicaciones por vehículo en múltiples plataformas      "apellido": "string|null",

- Plataformas: `facebook`, `web`, `mercadolibre`, `instagram`, `whatsapp`, `olx`, `autocosmos`, `otro`      "telefono": "string|null",

- Tracking de URLs e IDs de publicación externos      "email": "string|null",

      "dni": "string|null"

#### **Vendedores y Compradores:**    } | null

- **Vendedores**: Personas que venden vehículos a la empresa  }

- **Compradores**: Personas que compran vehículos de la empresa}

- Información completa: datos personales, contacto, ubicación, origen```

- Historial de operaciones y vehículos asociados

### POST /api/operaciones

#### **Sistema de Operaciones Unificado:****Descripción:** Crear nueva operación (compra o venta)

- **Operaciones de Compra**: empresa compra vehículo del vendedor**Autenticación:** Requerida

- **Operaciones de Venta**: empresa vende vehículo al comprador**Permisos:** operaciones.crear

- Estados: `pendiente`, `completada`, `cancelada`

- Seguimiento completo de pagos, documentos y observaciones**Request Body (JSON):**

```json

#### **Nuevos Campos en Vehículos:**{

- `pendientes_preparacion`: Array de tareas pendientes  "vehiculo_id": "string (UUID, required)",

- `comentarios`: Comentarios adicionales del vehículo  "tipo_operacion": "string (required)", // "compra" | "venta"

- `vendedor_id`/`comprador_id`: Referencias a vendedores y compradores  "vendedor_id": "string (UUID, optional)", // Requerido si tipo_operacion = "compra"

- Relaciones expandidas con `imagenes` y `publicaciones`  "comprador_id": "string (UUID, optional)", // Requerido si tipo_operacion = "venta"

  "precio": "number (required, positive)",

### 📊 EJEMPLOS DE USO  "moneda": "string (optional, default: 'ARS')",

  "fecha_operacion": "string (ISO date, required)",

#### Crear vehículo con nuevos campos:  "estado": "string (optional, default: 'pendiente')", // "pendiente" | "completada" | "cancelada"

```json  "metodo_pago": "string (optional)",

{  "observaciones": "string (optional, max: 2000 chars)",

  "modelo_id": "uuid-del-modelo",  "documentos_pendientes": "array[string] (optional)"

  "vehiculo_ano": 2023,}

  "estado_codigo": "DISPONIBLE",```

  "vendedor_id": "uuid-del-vendedor",

  "pendientes_preparacion": [**Response 201:**

    "Revisión mecánica",```json

    "Limpieza detallada",{

    "Documentos al día"  "success": true,

  ],  "message": "Operación creada exitosamente",

  "comentarios": "Vehículo en excelente estado, único dueño"  "operacion": {

}    // Mismo formato que GET /api/operaciones/{id}

```  }

}

#### Crear operación de compra:```

```json

{### PUT /api/operaciones/{id}

  "vehiculo_id": "uuid-del-vehiculo",**Descripción:** Actualizar una operación existente

  "tipo": "compra",**Autenticación:** Requerida

  "vendedor_id": "uuid-del-vendedor",**Permisos:** operaciones.editar

  "precio": 25000000,

  "moneda": "ARS",### DELETE /api/operaciones/{id}

  "fecha": "2024-11-13",**Descripción:** Eliminar una operación (soft delete)

  "metodo_pago": "Transferencia bancaria",**Autenticación:** Requerida

  "observaciones": "Compra directa, documentación al día"**Permisos:** operaciones.eliminar

}

```---



#### Crear operación de venta:## 📷 IMÁGENES DE VEHÍCULOS

```json

{### GET /api/imagenes

  "vehiculo_id": "uuid-del-vehiculo",**Descripción:** Obtener todas las imágenes (con filtros por vehículo)

  "tipo": "venta",**Autenticación:** Requerida

  "comprador_id": "uuid-del-comprador",**Permisos:** vehiculos.leer

  "precio": 28000000,

  "moneda": "ARS",**Query Parameters:**

  "fecha": "2024-11-13",```

  "metodo_pago": "Financiado 50%"vehiculo_id: string (UUID, optional) - Filtrar por vehículo específico

}page: number (default: 1)

```limit: number (default: 12)

```

#### Agregar imagen principal a vehículo:

```json### GET /api/vehiculos/{vehiculo_id}/imagenes

{**Descripción:** Obtener todas las imágenes de un vehículo específico

  "vehiculo_id": "uuid-del-vehiculo",**Autenticación:** Requerida

  "url": "https://example.com/imagen.jpg",**Permisos:** vehiculos.leer

  "descripcion": "Vista frontal",

  "es_principal": true,**Response 200:**

  "orden": 1```json

}{

```  "success": true,

  "message": "Imágenes obtenidas exitosamente",

#### Crear publicación en MercadoLibre:  "imagenes": [

```json    {

{      "id": "string (UUID)",

  "plataforma": "mercadolibre",      "vehiculo_id": "string (UUID)",

  "titulo": "Toyota Corolla 2023 - Excelente Estado",      "url": "string (URL de la imagen)",

  "url_publicacion": "https://auto.mercadolibre.com.ar/MLA-123456",      "descripcion": "string|null",

  "id_publicacion": "MLA-123456",      "orden": "number",

  "ficha_breve": "Vehículo único dueño, service oficial, financiación disponible"      "es_principal": "boolean",

}      "created_at": "string (ISO date)",

```      "updated_at": "string (ISO date)"

    }

### 🔐 AUTENTICACIÓN Y PERMISOS  ]

}

#### Credenciales de prueba:```

```

Admin General: admin@voonda.com / admin123### POST /api/imagenes

Admin Empresa: admin@fratelli.com / empresa123  **Descripción:** Agregar nueva imagen a un vehículo

```**Autenticación:** Requerida

**Permisos:** vehiculos.editar

#### Sistema Multi-Empresa:

- Admins generales (`empresa_id: null`) pueden ver todas las empresas**Request Body (JSON):**

- Admins/colaboradores de empresa solo ven datos de su empresa```json

- Los filtros por empresa se aplican automáticamente en el backend{

  "vehiculo_id": "string (UUID, required)",

#### Token JWT:  "url": "string (required, URL format)",

- Expira en 24 horas  "descripcion": "string (optional, max: 500 chars)",

- Almacenar en localStorage/sessionStorage  "orden": "number (optional, positive, default: auto-calculado)",

- Incluir en header `Authorization: Bearer {token}`  "es_principal": "boolean (optional, default: false)"

- Manejar respuestas 401 para renovar token}

```

### 🛠️ CARACTERÍSTICAS TÉCNICAS

### PATCH /api/imagenes/{id}/principal

#### Paginación:**Descripción:** Establecer una imagen como principal (desmarca las demás del mismo vehículo)

- Usar `page` y `limit` para paginación**Autenticación:** Requerida

- Response incluye objeto `pagination` con información completa**Permisos:** vehiculos.editar

- `limit` máximo es 100

---

#### Soft Delete:

- Los registros eliminados se marcan como `activo: false`## 📢 PUBLICACIONES

- Solo se muestran por defecto los registros activos

- Aplica a: vehículos, vendedores, compradores, operaciones, imágenes, publicaciones### GET /api/vehiculos/{vehiculo_id}/publicaciones

**Descripción:** Obtener todas las publicaciones de un vehículo

#### Filtros de Búsqueda:**Autenticación:** Requerida

- `search` busca en campos relevantes de cada entidad**Permisos:** vehiculos.leer

- Fechas en formato ISO (YYYY-MM-DD)

- Rangos de precios y años soportados### POST /api/vehiculos/{vehiculo_id}/publicaciones

- Filtros específicos por estado, tipo, plataforma, etc.**Descripción:** Crear nueva publicación para un vehículo

**Autenticación:** Requerida

#### Validaciones:**Permisos:** vehiculos.crear

- Campos requeridos según especificación

- Límites de longitud en strings**Request Body (JSON):**

- Formatos específicos (email, URL, UUID)```json

- Validación de rangos numéricos{

  "plataforma": "string (required)", // "facebook" | "web" | "mercadolibre" | "instagram" | "whatsapp" | "olx" | "autocosmos" | "otro"

### 📱 RECOMENDACIONES PARA UI/UX  "titulo": "string (required, max: 200 chars)",

  "url_publicacion": "string (optional, URL format)",

#### Estados de Vehículos:  "id_publicacion": "string (optional, max: 100 chars)",

- Usar colores distintivos para cada estado  "ficha_breve": "string (optional, max: 1000 chars)",

- `DISPONIBLE`: Verde, `RESERVADO`: Amarillo, `VENDIDO`: Azul, `EN_REPARACION`: Naranja, `BAJA`: Rojo  "activo": "boolean (optional, default: true)"

}

#### Imágenes:```

- Mostrar imagen principal destacada

- Galería ordenada para imágenes secundarias---

- Placeholder para vehículos sin imágenes

## 📊 ESTADOS DE VEHÍCULOS

#### Operaciones:

- Dashboard con métricas de compras vs ventas### GET /api/estados

- Timeline de operaciones por vehículo**Descripción:** Obtener todos los estados de vehículos disponibles

- Alertas para documentos pendientes**Autenticación:** Requerida

**Permisos:** vehiculos.leer

#### Publicaciones:

- Indicadores visuales por plataforma**Response 200:**

- Enlaces directos a publicaciones externas```json

- Estado de activación de publicaciones{
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

### 🆕 CARACTERÍSTICAS ACTUALES

#### **Nuevos Campos en Vehículos:**
- `pendientes_preparacion`: Array de strings con tareas pendientes
- `comentarios`: Comentarios adicionales del vehículo
- `vendedor_id`/`comprador_id`: Referencias a vendedores y compradores
- `equipamiento`: Array de elementos de equipamiento en modelo_auto
- `asistencias_manejo`: Array de asistencias de manejo en modelo_auto

#### **Entidades Principales:**
- **Vendedores**: Personas que venden vehículos a la empresa
- **Compradores**: Personas que compran vehículos de la empresa  
- **Operaciones**: Sistema unificado de compras y ventas (reemplaza tablas separadas)
- **Imágenes**: Sistema de gestión de imágenes por vehículo
- **Publicaciones**: Gestión de publicaciones en diferentes plataformas

#### **Relaciones Expandidas:**
- Vehículos incluyen `vendedor`, `comprador`, `imagenes` y `publicaciones`
- Operaciones unifican compras y ventas con referencias a vendedores/compradores
- Cada entidad mantiene contadores de relaciones (`_count`)

### 📊 ESTRUCTURA DE OPERACIONES UNIFICADA

**Operaciones de Compra:**
- `tipo_operacion`: "compra"
- `vendedor_id`: ID del vendedor (requerido)
- `comprador_id`: null
- La empresa compra el vehículo del vendedor

**Operaciones de Venta:**
- `tipo_operacion`: "venta"
- `vendedor_id`: null
- `comprador_id`: ID del comprador (requerido)
- La empresa vende el vehículo al comprador

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

### Estados de operaciones:
- `"pendiente"` - Operación pendiente de completar
- `"completada"` - Operación finalizada exitosamente
- `"cancelada"` - Operación cancelada

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

#### Crear operación de compra:
```json
{
  "vehiculo_id": "uuid-del-vehiculo",
  "tipo_operacion": "compra",
  "vendedor_id": "uuid-del-vendedor",
  "precio": 25000000,
  "moneda": "ARS",
  "fecha_operacion": "2024-11-13",
  "metodo_pago": "Transferencia bancaria",
  "observaciones": "Compra directa, documentación al día"
}
```

#### Crear operación de venta:
```json
{
  "vehiculo_id": "uuid-del-vehiculo",
  "tipo_operacion": "venta",
  "comprador_id": "uuid-del-comprador",
  "precio": 28000000,
  "moneda": "ARS",
  "fecha_operacion": "2024-11-13",
  "metodo_pago": "Financiado 50%",
  "documentos_pendientes": ["Transferencia", "Seguro"]
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
**Descripción:** Crear nuevo vehículo con información del vendedor y modelo
**Autenticación:** Requerida
**Permisos:** vehiculos.crear

**Funcionalidad Automática:**
- ✅ **Vendedor:** Se crea/reutiliza automáticamente por email+empresa
- ✅ **Modelo:** Se crea/reutiliza automáticamente por marca+modelo+versión+año
- ✅ **Estado:** Se asigna estado especificado o 'disponible' por defecto  
- ✅ **Empresa:** Se asigna automáticamente según el usuario logueado
- ✅ **Publicaciones:** Se crean opcionalmente según el array proporcionado

**Request Body (JSON):**
```json
{
  // ==================== CAMPOS OBLIGATORIOS ====================
  
  // INFORMACIÓN DEL MODELO (auto-creación en tabla modelo_autos)
  "marca": "string (required, 2-50 chars)", // Ej: "Toyota"
  "modelo": "string (required, 1-50 chars)", // Ej: "Corolla" 
  "version": "string (required, 1-50 chars)", // Ej: "XEI"
  "vehiculo_ano": "number (required, 1950 a año actual+1)", // Ej: 2024
  
  // INFORMACIÓN DEL VENDEDOR (auto-creación en tabla vendedores)
  "vendedor_nombre": "string (required, 2-50 chars)", // Ej: "Juan"
  "vendedor_apellido": "string (required, 2-50 chars)", // Ej: "Pérez"
  "vendedor_telefono": "string (required, 8-20 chars)", // Ej: "+54 9 11 1234-5678"
  "vendedor_email": "string (required, email format, max: 100 chars)", // Ej: "juan.perez@email.com"
  
  // ==================== CAMPOS OPCIONALES ====================
  
  // INFORMACIÓN ADICIONAL DEL VENDEDOR
  "vendedor_dni": "string (optional, max: 20 chars)", // Ej: "12345678"
  "vendedor_direccion": "string (optional, max: 200 chars)", // Ej: "Av. Corrientes 1234"
  "vendedor_observaciones": "string (optional, max: 500 chars)", // Ej: "Vendedor confiable"
  
  // ESTADO DEL VEHÍCULO (validado contra BD - acepta cualquier código válido)
  "estado_codigo": "string (optional, default: 'disponible')", // Ej: "disponible", "salon", "EN_REPARACION", etc.
  
  // INFORMACIÓN COMERCIAL DEL VEHÍCULO
  "patente": "string (optional, max: 15 chars)", // Ej: "ABC123"
  "kilometros": "number (optional, min: 0, default: 0)", // Ej: 15000
  "valor": "number (optional, positive, 2 decimals)", // Ej: 2500000.50
  "moneda": "string (optional, max: 10 chars, default: 'ARS')", // Ej: "ARS", "USD"
  "tipo_operacion": "string (optional)", // Ej: "Venta", "Consignación"
  "fecha_ingreso": "string (ISO date, optional, default: now)", // Ej: "2024-11-18T10:30:00Z"
  "observaciones": "string (optional, max: 1000 chars)", // Ej: "Vehículo en excelente estado"
  "pendientes_preparacion": "array|string (flexible format)", // Ver detalles de formatos más abajo
  "comentarios": "string (optional, max: 2000 chars)", // Ej: "Contactar antes del mediodía"
  
  // IDs DIRECTOS (para usar entidades existentes en lugar de auto-crear)
  "vendedor_id": "string (UUID, optional)", // Si se especifica, no se auto-crea vendedor
  "comprador_id": "string (UUID, optional)", // Para asignar comprador existente
  "estado_id": "string (UUID, optional)", // Para usar ID directo de estado
  
  // ARRAY DE PUBLICACIONES (opcional)
  "publicaciones": [
    {
      "plataforma": "string (required)", // "facebook" | "web" | "mercadolibre" | "instagram" | "whatsapp" | "olx" | "autocosmos" | "otro"
      "titulo": "string (required, 1-200 chars)", // Ej: "Toyota Corolla XEI 2024 - Impecable"
      "url_publicacion": "string (optional, URL format)", // Ej: "https://facebook.com/marketplace/item/123"
      "id_publicacion": "string (optional, max: 100 chars)", // Ej: "fb_123456", "MLA123456"
      "ficha_breve": "string (optional, max: 1000 chars)", // Ej: "Vehículo en excelente estado, único dueño"
      "activo": "boolean (optional, default: true)" // true/false
    }
  ],
  
  // CAMPO ESPECIAL PARA ADMIN GENERAL
  "empresa_id": "string (UUID, required only for admin_general role)" // Solo admin general debe especificar empresa
}
```

**Ejemplo Mínimo (Campos Obligatorios):**
```json
{
  "marca": "Toyota",
  "modelo": "Corolla", 
  "version": "XEI",
  "vehiculo_ano": 2024,
  "vendedor_nombre": "Juan",
  "vendedor_apellido": "Pérez", 
  "vendedor_telefono": "+54 9 11 1234-5678",
  "vendedor_email": "juan.perez@email.com"
}
```

**Ejemplo Completo:**
```json
{
  "marca": "Toyota",
  "modelo": "Corolla",
  "version": "XEI", 
  "vehiculo_ano": 2024,
  "vendedor_nombre": "Juan",
  "vendedor_apellido": "Pérez",
  "vendedor_telefono": "+54 9 11 1234-5678",
  "vendedor_email": "juan.perez@email.com",
  "vendedor_dni": "12345678",
  "vendedor_direccion": "Av. Corrientes 1234, CABA",
  "vendedor_observaciones": "Vendedor confiable, entrega inmediata",
  "estado_codigo": "salon",
  "patente": "ABC123",
  "kilometros": 15000,
  "valor": 2500000.00,
  "moneda": "ARS",
  "tipo_operacion": "Venta",
  "fecha_ingreso": "2024-11-18T10:30:00Z",
  "observaciones": "Vehículo en excelente estado, service al día",
  "pendientes_preparacion": ["Lavado exterior", "Revisión técnica", "Documentación"],
  "comentarios": "Contactar al vendedor solo por las mañanas",
  "publicaciones": [
    {
      "plataforma": "web",
      "titulo": "Toyota Corolla XEI 2024 - Impecable Estado",
      "ficha_breve": "Vehículo en excelente estado, único dueño, service completo en concesionario oficial"
    },
    {
      "plataforma": "facebook",
      "titulo": "Toyota Corolla XEI 2024 - Oportunidad",
      "url_publicacion": "https://facebook.com/marketplace/item/123456789",
      "id_publicacion": "fb_marketplace_123456",
      "ficha_breve": "¡No te lo pierdas! Financiación disponible"
    },
    {
      "plataforma": "mercadolibre",
      "titulo": "Toyota Corolla XEI 2024 - Financiación 100%",
      "url_publicacion": "https://articulo.mercadolibre.com.ar/MLA-987654321",
      "id_publicacion": "MLA987654321",
      "ficha_breve": "Acepto permuta, financiación hasta 60 cuotas"
    }
  ]
}
```

### 📝 **Formatos Flexibles para `pendientes_preparacion`**

El campo `pendientes_preparacion` es extremadamente flexible y acepta múltiples formatos:

#### **Formato 1: Array de Strings (Recomendado)**
```json
{
  "pendientes_preparacion": ["Revisión mecánica", "Limpieza completa", "Documentos al día"]
}
```

#### **Formato 2: String con Saltos de Línea**
```json
{
  "pendientes_preparacion": "Revisión mecánica\nLimpieza completa\nDocumentos al día"
}
```

#### **Formato 3: String Simple**
```json
{
  "pendientes_preparacion": "Revisión mecánica general"
}
```

#### **Formato 4: Valores Vacíos**
```json
{
  "pendientes_preparacion": null
}
// o
{
  "pendientes_preparacion": ""
}
// o simplemente omitir el campo
```

#### **Procesamiento Automático:**
- ✅ **Strings multilínea** se dividen automáticamente por `\n`
- ✅ **Líneas vacías** se filtran automáticamente  
- ✅ **Espacios extra** se eliminan (trim)
- ✅ **Elementos null** se filtran del resultado

#### **Validaciones:**
- **Array**: Máximo 500 caracteres por elemento
- **String**: Máximo 2000 caracteres total
- **Resultado**: Siempre se almacena como array en BD

**Response 201 (Éxito):**
```json
{
  "success": true,
  "message": "Vehículo creado exitosamente",
  "vehiculo": {
    "id": "string (UUID)",
    "empresa_id": "string (UUID)",
    "modelo_id": "string (UUID)",
    "vendedor_id": "string (UUID)",
    "estado_id": "string (UUID)",
    "comprador_id": "string (UUID)|null",
    "patente": "string|null",
    "vehiculo_ano": "number",
    "kilometros": "number",
    "valor": "string (decimal)|null",
    "moneda": "string",
    "tipo_operacion": "string|null",
    "fecha_ingreso": "string (ISO date)",
    "observaciones": "string|null",
    "pendientes_preparacion": ["string"],
    "comentarios": "string|null",
    "activo": "boolean",
    "created_at": "string (ISO date)",
    "updated_at": "string (ISO date)",
    "empresa": {
      "id": "string (UUID)",
      "nombre": "string",
      "descripcion": "string|null"
    },
    "modelo": {
      "id": "string (UUID)",
      "marca": "string",
      "modelo": "string",
      "version": "string|null",
      "modelo_ano": "number",
      "segmento_modelo": "string|null",
      "motorizacion": "string|null",
      "combustible": "string|null",
      "caja": "string|null",
      "traccion": "string|null",
      "cilindrada": "number|null",
      "potencia_hp": "number|null",
      "torque_nm": "number|null",
      "rendimiento_mixto": "string (decimal)|null",
      "equipamiento": ["string"],
      "asistencias_manejo": ["string"]
    },
    "estado": {
      "id": "string (UUID)",
      "codigo": "string",
      "nombre": "string",
      "descripcion": "string|null"
    },
    "vendedor": {
      "id": "string (UUID)",
      "nombre": "string",
      "apellido": "string|null",
      "telefono": "string|null",
      "email": "string|null"
    },
    "comprador": {
      "id": "string (UUID)",
      "nombre": "string", 
      "apellido": "string|null",
      "telefono": "string|null",
      "email": "string|null"
    }|null
  },
  "resumen": {
    "vendedor_creado": "nuevo|reutilizado", // Indica si se creó o reutilizó vendedor existente
    "modelo_creado": "nuevo|reutilizado", // Indica si se creó o reutilizó modelo existente
    "estado_asignado": "string", // Código del estado asignado al vehículo
    "publicaciones_creadas": "number" // Cantidad de publicaciones creadas exitosamente
  },
  "publicaciones": [
    {
      "id": "string (UUID)",
      "vehiculo_id": "string (UUID)",
      "plataforma": "string",
      "titulo": "string",
      "url_publicacion": "string|null",
      "id_publicacion": "string|null", 
      "ficha_breve": "string|null",
      "activo": "boolean",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)"
    }
  ]
}
```

**Response 400 (Validación):**
```json
{
  "success": false,
  "error": "Datos inválidos",
  "message": "Error en validación de datos", 
  "details": [
    {
      "field": "marca",
      "message": "La marca debe tener al menos 2 caracteres"
    },
    {
      "field": "vendedor_email", 
      "message": "El email del vendedor debe tener un formato válido"
    },
    {
      "field": "vehiculo_ano",
      "message": "El año del vehículo debe ser mayor a 1950"
    }
  ]
}
```

**Response 400 (Estado inválido):**
```json
{
  "success": false,
  "error": "Estado inválido",
  "message": "No se encontró un estado con el código: ESTADO_INEXISTENTE"
}
```

**Response 400 (Admin sin empresa):**
```json
{
  "success": false,
  "message": "Debes especificar la empresa para este vehículo"
}
```

**Response 401:**
```json
{
  "success": false,
  "error": "Token no válido",
  "message": "El token de acceso ha expirado o es inválido"
}
```

**Response 403:**
```json
{
  "success": false,
  "error": "Sin permisos",
  "message": "No tienes permisos para crear vehículos"
}
```

**Response 500:**
```json
{
  "success": false,
  "error": "Error interno del servidor",
  "message": "Error al crear vehículo: [detalle del error]"
}
```

### PUT /api/vehiculos/{id}
**Descripción:** Actualizar un vehículo existente con funcionalidad avanzada
**Autenticación:** Requerida
**Permisos:** vehiculos.editar

**Funcionalidades especiales:**
- **Auto-creación de vendedor**: Si se proporciona `vendedor_email` (y otros datos), se busca por email o se crea un nuevo vendedor
- **Auto-creación de modelo**: Si se proporciona `marca`, `modelo`, `version`, se busca o se crea el modelo_auto correspondiente
- **Gestión de publicaciones**: El array `publicaciones` reemplaza completamente las publicaciones existentes

**Path Parameters:**
```
id: string (UUID, required)
```

**Request Body (JSON, todos los campos opcionales):**
```json
{
  // Información del modelo (auto-creación/búsqueda)
  "marca": "string (optional, 2-50 chars) - Nombre de la marca",
  "modelo": "string (optional, 1-50 chars) - Nombre del modelo", 
  "version": "string (optional, 1-50 chars) - Versión del modelo",
  
  // Información del vehículo
  "vehiculo_ano": "number (optional, 1950-2025) - Año de fabricación",
  "patente": "string (optional, max 15 chars) - Patente",
  "kilometros": "number (optional, ≥0) - Kilometraje",
  "valor": "number (optional, >0) - Precio",
  "moneda": "string (optional, max 10 chars) - Moneda",
  "estado_codigo": "string (optional) - disponible|salon|consignacion|pyc|preparacion|vendido|entregado",
  "tipo_operacion": "string (optional) - Tipo de operación",
  "fecha_ingreso": "string (ISO date, optional) - Fecha de ingreso",
  "observaciones": "string (optional, max 1000 chars) - Observaciones",
  "pendientes_preparacion": "string (optional, max 2000 chars) - Pendientes",
  "comentarios": "string (optional, max 2000 chars) - Comentarios",
  
  // Información del vendedor (auto-creación/búsqueda)
  "vendedor_nombre": "string (optional, 2-50 chars) - Nombre del vendedor",
  "vendedor_apellido": "string (optional, 2-50 chars) - Apellido del vendedor",
  "vendedor_telefono": "string (optional, 8-20 chars) - Teléfono del vendedor", 
  "vendedor_email": "string (email, optional, max 100 chars) - Email del vendedor (clave para identificación)",
  "vendedor_dni": "string (optional, max 20 chars) - DNI del vendedor",
  "vendedor_direccion": "string (optional, max 200 chars) - Dirección del vendedor",
  "vendedor_observaciones": "string (optional, max 500 chars) - Observaciones del vendedor",
  
  // Array de publicaciones (reemplazo completo)
  "publicaciones": [
    {
      "plataforma": "string (required) - facebook|web|mercadolibre|instagram|whatsapp|olx|autocosmos|otro",
      "titulo": "string (required, 1-200 chars) - Título de la publicación",
      "url_publicacion": "string (optional, URI) - URL de la publicación", 
      "id_publicacion": "string (optional, max 100 chars) - ID en la plataforma",
      "ficha_breve": "string (optional, max 1000 chars) - Descripción breve",
      "activo": "boolean (optional, default: true) - Estado activo"
    }
  ],
  
  // IDs directos (compatibilidad)
  "modelo_id": "string (UUID, optional) - ID directo del modelo",
  "vendedor_id": "string (UUID, optional) - ID directo del vendedor", 
  "estado_id": "string (UUID, optional) - ID directo del estado",
  "comprador_id": "string (UUID, optional) - ID del comprador"
}
```

**Ejemplo de actualización mínima:**
```json
{
  "valor": 26000000,
  "kilometros": 52000
}
```

**Ejemplo de actualización completa con auto-creación:**
```json
{
  "marca": "Toyota",
  "modelo": "Corolla Cross",
  "version": "XEI", 
  "vehiculo_ano": 2024,
  "vendedor_nombre": "María",
  "vendedor_apellido": "García",
  "vendedor_telefono": "+54 11 9876-5432",
  "vendedor_email": "maria.garcia@email.com",
  "valor": 35000000,
  "moneda": "ARS",
  "kilometros": 15000,
  "estado_codigo": "disponible",
  "publicaciones": [
    {
      "plataforma": "web",
      "titulo": "Toyota Corolla Cross XEI 2024 - Impecable",
      "ficha_breve": "SUV compacto en excelente estado"
    },
    {
      "plataforma": "facebook",
      "titulo": "Toyota Corolla Cross XEI 2024",
      "url_publicacion": "https://facebook.com/marketplace/item/456"
    }
  ],
  "observaciones": "Vehículo actualizado completamente"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Vehículo actualizado exitosamente",
  "vehiculo": {
    // Mismo formato que GET /api/vehiculos/{id} con datos actualizados
  },
  "resumen": {
    "vehiculo_actualizado": true,
    "modelo_creado": true,
    "modelo_encontrado": false,
    "vendedor_creado": false,
    "vendedor_encontrado": true,
    "publicaciones_eliminadas": 1,
    "publicaciones_creadas": 2
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

### 🔍 ENDPOINTS DE FILTROS PARA VEHÍCULOS

### GET /api/vehiculos/filtros/marcas
**Descripción:** Obtener marcas que tienen vehículos disponibles
**Autenticación:** Requerida
**Permisos:** vehiculos.leer

**Query Parameters:** Ninguno

**Response 200:**
```json
{
  "success": true,
  "message": "Marcas disponibles obtenidas exitosamente",
  "marcas": ["Toyota", "Honda", "Ford", "Chevrolet", "Volkswagen"]
}
```

### GET /api/vehiculos/filtros/modelos
**Descripción:** Obtener modelos disponibles, opcionalmente filtrados por marca
**Autenticación:** Requerida
**Permisos:** vehiculos.leer

**Query Parameters (opcionales):**
```
marcaId: string // Filtrar modelos por marca específica
```

**Response 200:**
```json
{
  "success": true,
  "message": "Modelos disponibles obtenidos exitosamente",
  "modelos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nombre": "Corolla",
      "marca": "Toyota"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001", 
      "nombre": "Civic",
      "marca": "Honda"
    }
  ]
}
```

### GET /api/vehiculos/filtros/marcas-modelos
**Descripción:** Obtener marcas con modelos y versiones para filtros de vehículos
**Autenticación:** Requerida
**Permisos:** vehiculos.leer

**Query Parameters:** Ninguno

**Response 200:**
```json
{
  "success": true,
  "message": "Marcas y modelos obtenidos exitosamente",
  "marcas": [
    {
      "marca": "Toyota",
      "modelos": [
        {
          "modelo": "Corolla",
          "versiones": ["XEI", "XLI", "SEG"]
        },
        {
          "modelo": "Camry", 
          "versiones": ["LE", "SE", "XSE"]
        }
      ]
    },
    {
      "marca": "Honda",
      "modelos": [
        {
          "modelo": "Civic",
          "versiones": ["LX", "EX", "Sport"]
        }
      ]
    }
  ]
}
```

### GET /api/vehiculos/filtros/años
**Descripción:** Obtener años únicos de vehículos disponibles para filtros
**Autenticación:** Requerida
**Permisos:** vehiculos.leer

**Query Parameters:** Ninguno

**Response 200:**
```json
{
  "success": true,
  "message": "Años disponibles obtenidos exitosamente",
  "años": [2024, 2023, 2022, 2021, 2020, 2019, 2018]
}
```

### GET /api/vehiculos/filtros/estados
**Descripción:** Obtener todos los estados de vehículos disponibles para filtros
**Autenticación:** Requerida
**Permisos:** vehiculos.leer

**Query Parameters:** Ninguno

**Response 200:**
```json
{
  "success": true,
  "message": "Estados disponibles obtenidos exitosamente",
  "estados": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "codigo": "salon",
      "nombre": "En Salón",
      "descripcion": "Vehículo disponible para la venta en salón"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "codigo": "vendido",
      "nombre": "Vendido",
      "descripcion": "Vehículo vendido a cliente final"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "codigo": "reservado",
      "nombre": "Reservado",
      "descripcion": "Vehículo reservado por cliente"
    }
  ]
}
```

**Ejemplo de uso en Frontend - Sistema de filtros jerárquicos:**
```javascript
// 1. Obtener marcas disponibles para combo principal
const response1 = await fetch('/api/vehiculos/filtros/marcas', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { marcas } = await response1.json();

// 2. Cuando usuario selecciona marca, obtener modelos de esa marca
const selectedMarca = "Toyota";
const response2 = await fetch(`/api/vehiculos/filtros/modelos?marcaId=${selectedMarca}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { modelos } = await response2.json();

// 3. Obtener años para combo de años
const response3 = await fetch('/api/vehiculos/filtros/años', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { años } = await response3.json();

// 4. Obtener estados para combo de estados
const response4 = await fetch('/api/vehiculos/filtros/estados', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { estados } = await response4.json();

// 5. Filtrar vehículos usando los filtros seleccionados
const selectedModelo = "550e8400-e29b-41d4-a716-446655440000";
const selectedAno = 2023;
const searchTerm = "corolla";

const responseVehiculos = await fetch(
  `/api/vehiculos?marca=${selectedMarca}&modelo=${selectedModelo}&ano=${selectedAno}&search=${searchTerm}&page=1&limit=10`,
  {
    headers: { 'Authorization': `Bearer ${token}` }
  }
);
const { vehiculos, pagination } = await responseVehiculos.json();

// 6. Para combo jerárquico completo (marcas->modelos->versiones)
const response5 = await fetch('/api/vehiculos/filtros/marcas-modelos', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { marcas: marcasCompletas } = await response5.json();
```

**⚠️ IMPORTANTE - Cambios en el endpoint principal GET /api/vehiculos:**

El endpoint principal de vehículos ahora soporta los siguientes **NUEVOS** parámetros de filtro:

- **`marca`**: string - Filtrar por marca específica (ej: "Toyota")
- **`modelo`**: string - ID del modelo específico (combinar con marca o usar solo)  
- **`search`**: string - Búsqueda mejorada que incluye marca, modelo y descripción
- **`ano`**: number - Filtrar por año específico del vehículo
- **`estado`**: string - ID del estado del vehículo

**Ejemplos de filtrado en endpoint principal:**
```javascript
// Filtrar solo por marca
fetch('/api/vehiculos?marca=Toyota')

// Filtrar por marca y modelo específico  
fetch('/api/vehiculos?marca=Toyota&modelo=uuid-del-modelo')

// Búsqueda general mejorada
fetch('/api/vehiculos?search=corolla')

// Filtros múltiples
fetch('/api/vehiculos?marca=Honda&ano=2023&estado_codigo=salon&page=1')
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