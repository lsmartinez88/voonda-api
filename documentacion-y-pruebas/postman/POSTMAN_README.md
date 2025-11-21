# 📮 Voonda API - Colección de Postman Completa

## 🎯 Casos de Prueba Incluidos

Esta colección contiene **casos de prueba exhaustivos** organizados en 3 categorías principales:

### ✅ **Casos de Éxito** (6 ejemplos)
1. **Campos Obligatorios Mínimos** - Solo campos requeridos
2. **Con Campos Opcionales Básicos** - Algunos campos adicionales  
3. **Estado EN_REPARACION** - Prueba estados dinámicos + arrays
4. **Con Publicaciones Completas** - Todas las opciones disponibles
5. **Reutilizar Vendedor Existente** - Validar lógica de vendedor duplicado
6. **CRUD Completo** - Obtener/Actualizar/Eliminar

### ❌ **Casos de Error** (11 validaciones)
1. **Campo Obligatorio Faltante** (marca)
2. **Email Vendedor Inválido** (formato incorrecto)
3. **Año Vehículo Muy Antiguo** (< 1950)
4. **Año Vehículo Futuro** (> año actual + 1)
5. **Nombre Vendedor Muy Corto** (< 2 caracteres)
6. **Teléfono Muy Corto** (< 8 caracteres) 
7. **Valor Negativo** (< 0)
8. **Kilómetros Negativos** (< 0)
9. **Estado Inexistente** (no existe en BD)
10. **Sin Autenticación** (401 error)
11. **Publicación con Plataforma Inválida**

### � **Casos de Búsqueda** (5 ejemplos)
1. **Listar Sin Filtros** - Paginación básica
2. **Buscar por Marca** - Filtro simple
3. **Buscar por Estado** - Filtro de estado
4. **Rango de Precios** - Filtros numéricos
5. **Búsqueda Combinada** - Múltiples filtros

## 🚀 Configuración Inicial

### 1. **Importar la Colección**
- Abrir Postman
- Clic en **"Import"** (botón superior izquierdo)
- Arrastrar o seleccionar el archivo: `Voonda-API.postman_collection.json`

### 2. **Importar el Environment**
- Clic en **"Import"** nuevamente
- Arrastrar o seleccionar el archivo: `Voonda-API-Local.postman_environment.json`
- En la esquina superior derecha, seleccionar **"Voonda API - Local"**

## 🔑 Proceso de Autenticación

### **Paso 1: Login**
1. Ir a **🔐 Autenticación > Login (Admin)**
2. Ejecutar la request (Send)
3. ✅ **El token se guarda automáticamente** en variables de entorno

### **Paso 2: Verificar autenticación**
- Ejecutar **🔐 Autenticación > Me (Usuario actual)** para verificar que el token funciona

## 📋 Flujo de Prueba Recomendado

### 1️⃣ **Configuración Inicial**
```
🔐 Autenticación → Login (Admin)
📊 Dashboard → Obtener Marcas Disponibles  
📊 Dashboard → Listar Estados de Vehículos
```

### 2️⃣ **Casos de Éxito (En orden)**
```
✅ Crear Vehículo (Campos Obligatorios Mínimos)
✅ Crear Vehículo (Con Campos Opcionales Básicos)
✅ Crear Vehículo (Estado EN_REPARACION) 
✅ Crear Vehículo (Con Publicaciones Completas)
✅ Crear Vehículo (Reutilizar Vendedor Existente)
```

### 3️⃣ **Verificar Creaciones**
```
🔍 Listar Vehículos (Sin filtros)
🔍 Buscar por Marca (Toyota)
🔍 Buscar por Estado (salon)
```

### 4️⃣ **Probar Validaciones**
```
❌ Error - Campo Obligatorio Faltante (marca)
❌ Error - Email Vendedor Inválido
❌ Error - Año Vehículo Inválido (muy antiguo)
❌ Error - Estado Inexistente
❌ Error - Sin Autenticación
```

### 5️⃣ **CRUD Completo**
```
🚗 Obtener Vehículo por ID
🚗 Actualizar Vehículo
🚗 Eliminar Vehículo
```

## 🎯 Qué Esperar en Cada Caso

### ✅ **Casos de Éxito** - Deben retornar:
- **Status Code:** 201 (Created) para creación, 200 (OK) para consultas
- **Response:** JSON con el vehículo creado/consultado
- **Auto-save:** `vehiculo_id` se guarda automáticamente para usar en otros endpoints
- **Campos incluidos:** `id`, `marca`, `modelo`, `vendedor`, `publicaciones`, etc.

### ❌ **Casos de Error** - Deben retornar:
- **Status Code:** 400 (Bad Request) o 401 (Unauthorized)
- **Response:** JSON con mensaje de error específico
- **Ejemplo:**
  ```json
  {
    "error": "\"marca\" es obligatorio"
  }
  ```

### 🔍 **Casos de Búsqueda** - Deben retornar:
- **Status Code:** 200 (OK)
- **Response:** Array de vehículos + metadata de paginación
- **Filtros aplicados:** Según parámetros enviados

## 🔧 Variables de Entorno

```javascript
{
  "baseUrl": "http://localhost:3001",
  "token": "", // Se actualiza automáticamente al hacer login
  "vehiculo_id": "", // Se actualiza al crear un vehículo
  "adminEmail": "admin@test.com",
  "adminPassword": "123456"
}
```

## ⚠️ Validaciones Importantes

### **Campos Obligatorios**
```javascript
{
  "marca": "String (min 1 carácter)",
  "modelo": "String (min 1 carácter)",
  "version": "String (min 1 carácter)", 
  "vehiculo_ano": "Number (1950 ≤ año ≤ año_actual+1)",
  "vendedor_nombre": "String (min 2 caracteres)",
  "vendedor_apellido": "String (min 2 caracteres)",
  "vendedor_telefono": "String (min 8 caracteres)",
  "vendedor_email": "Email válido"
}
```

### **Campos Opcionales con Validaciones**
```javascript
{
  "valor": "Number positivo",
  "kilometros": "Number ≥ 0", 
  "estado_codigo": "String existente en BD",
  "vendedor_dni": "String (3-20 caracteres)",
  "patente": "String (3-20 caracteres)",
  "publicaciones": "Array de objetos con plataforma válida"
}
```

### **Plataformas Válidas para Publicaciones**
- `"facebook"`, `"web"`, `"mercadolibre"`, `"instagram"`, `"whatsapp"`, `"olx"`, `"autocosmos"`, `"otro"`

## � Solución de Problemas

### Error 500: "estadoDefecto is not defined"
- ✅ **SOLUCIONADO** - Era un error en el código del backend

### Error 400: "Estado EN_REPARACION no válido"
- ✅ **SOLUCIONADO** - Se implementó validación dinámica de estados

### Error 401: "Token inválido"
- 🔄 **Solución:** Ejecutar nuevamente "Login (Admin)" para obtener token fresco

### Error de Conexión
- ✅ **Verificar:** El servidor está corriendo en `http://localhost:3001`
- ✅ **Comando:** `npm run dev` en el directorio del proyecto

### Vehículo ID no encontrado
- 🔄 **Solución:** Crear un vehículo primero para obtener un ID válido
- 🔄 **Automático:** La variable `vehiculo_id` se actualiza automáticamente

## 💡 Notas Técnicas

- **Auto-creación de Vendedores:** Si un email ya existe, se reutiliza el vendedor
- **Auto-creación de Modelos:** Si marca+modelo no existe, se crea automáticamente
- **Estados Dinámicos:** Se validan contra la tabla `EstadoVehiculo` en tiempo real
- **Publicaciones:** Array opcional, cada elemento requiere `plataforma` y `titulo` como mínimo
- **Pendientes Flexibles:** `pendientes_preparacion` acepta múltiples formatos:
  - **Array de strings**: `["Revisión mecánica", "Limpieza", "Documentos"]`
  - **String multilínea**: `"Revisión mecánica\\nLimpieza\\nDocumentos"`
  - **String simple**: `"Revisión mecánica"`
  - **Vacío**: `null`, `""`, `[]`

## ✨ Ejemplos de Respuesta

### Login Exitoso
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@test.com",
    "nombre": "Admin",
    "rol": "admin"
  }
}
```

### Vehículo Creado Exitosamente
```json
{
  "id": 123,
  "marca": "Toyota",
  "modelo": "Corolla",
  "version": "XEI",
  "vehiculo_ano": 2024,
  "vendedor": {
    "id": 45,
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan.perez@email.com",
    "vendedorCreado": true
  },
  "modelo_auto": {
    "id": 67,
    "nombre": "Corolla", 
    "modeloCreado": true
  },
  "publicaciones": [
    {
      "id": 1,
      "plataforma": "web",
      "titulo": "Toyota Corolla XEI 2024"
    }
  ]
}
```

### Error de Validación
```json
{
  "error": "\"vendedor_email\" debe ser un email válido"
}
```

## 🎉 Próximos Pasos

1. ✅ **Importar colección** y environment en Postman
2. ✅ **Autenticarse** con Login (Admin) 
3. 🧪 **Probar casos de éxito** para validar funcionalidad
4. ❌ **Probar casos de error** para validar validaciones
5. 🔍 **Explorar filtros** con casos de búsqueda
6. 🎨 **Personalizar** según necesidades específicas

¡La colección está lista para pruebas inmediatas! 🚀
- Incluye todos los campos opcionales y publicaciones

### **Opción 3: Estado EN_REPARACION**
- **🚗 Vehículos > Crear Vehículo (Estado EN_REPARACION)**
- Para probar que acepta estados dinámicos

## 📋 Endpoints Incluidos

### 🔐 **Autenticación**
- ✅ Login (guarda token automáticamente)
- ✅ Register 
- ✅ Me (usuario actual)
- ✅ Logout

### 🚗 **Vehículos**
- ✅ Crear Vehículo (3 ejemplos diferentes)
- ✅ Listar Vehículos
- ✅ Buscar con filtros (marca, estado, precio)
- ✅ Obtener por ID
- ✅ Actualizar
- ✅ Eliminar

### 🧑‍💼 **Vendedores**
- ✅ Listar vendedores
- ✅ Crear vendedor

### 🚙 **Modelos**
- ✅ Listar modelos
- ✅ Buscar por marca

### 🏷️ **Estados**
- ✅ Listar todos los estados disponibles

### 🏥 **Health Check**
- ✅ Status del servidor

## 🔧 Variables Configuradas

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `baseUrl` | URL base de la API | `http://localhost:3001` |
| `token` | Token JWT (se guarda automáticamente) | `""` |
| `vehiculo_id` | ID de vehículo para operaciones específicas | `""` |
| `admin_email` | Email del administrador | `admin@voonda.com` |
| `admin_password` | Password del administrador | `123456` |

## 📝 Notas Importantes

### **Auto-creación de Entidades**
- **Vendedores**: Se crean/reutilizan automáticamente por email+empresa
- **Modelos**: Se crean/reutilizan automáticamente por marca+modelo+versión+año

### **Estados Dinámicos**
- El sistema acepta cualquier `estado_codigo` válido de la base de datos
- Ejemplos: `"disponible"`, `"salon"`, `"EN_REPARACION"`, `"consignacion"`

### **Publicaciones**
- Se pueden incluir múltiples publicaciones en el array `publicaciones`
- Plataformas soportadas: `facebook`, `web`, `mercadolibre`, `instagram`, `whatsapp`, `olx`, `autocosmos`, `otro`

### **Permisos**
- La mayoría de endpoints requieren autenticación
- Los permisos dependen del rol del usuario

## 📝 Formatos Soportados para Pendientes

### **Campo `pendientes_preparacion`**

Este campo es extremadamente flexible y acepta múltiples formatos de entrada:

#### **1. Array de Strings (Recomendado)**
```json
{
  "pendientes_preparacion": ["Revisión mecánica", "Limpieza completa", "Documentos", "Cambio de aceite"]
}
```

#### **2. String con Saltos de Línea**
```json
{
  "pendientes_preparacion": "Revisión mecánica\nLimpieza completa\nDocumentos\nCambio de aceite"
}
```

#### **3. String Simple**
```json
{
  "pendientes_preparacion": "Revisión mecánica general"
}
```

#### **4. Valores Vacíos**
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

### **Procesamiento Automático**
- **Strings multilínea** se dividen automáticamente por `\n`
- **Líneas vacías** se filtran automáticamente
- **Espacios extra** se eliminan automáticamente (trim)
- **Elementos null/undefined** se filtran del resultado final

### **Ejemplos de Transformación**

| Input Frontend | Resultado en BD |
|----------------|-----------------|
| `["A", "B", "C"]` | `["A", "B", "C"]` |
| `"A\nB\nC"` | `["A", "B", "C"]` |
| `"A\n\nB\n  \nC"` | `["A", "B", "C"]` |
| `"Solo uno"` | `["Solo uno"]` |
| `""` o `null` | `[]` |

### **Validaciones**
- **Array**: Máximo 500 caracteres por elemento
- **String**: Máximo 2000 caracteres total
- **Tipos permitidos**: String, Array, null, undefined

## 🐛 Solución de Problemas

### **Error: ECONNREFUSED**
- Verificar que el servidor esté corriendo en `http://localhost:3001`
- Ejecutar: `npm start` en el directorio del proyecto

### **Error 401 Unauthorized**
- Ejecutar el endpoint de Login primero
- Verificar que el token se haya guardado en las variables

### **Error 400 Validation**
- Revisar que todos los campos obligatorios estén presentes
- Verificar el formato de emails, teléfonos y fechas

## 🎯 Flujo de Prueba Recomendado

1. **Health Check** → Verificar que el servidor funciona
2. **Login** → Autenticarse y obtener token
3. **Me** → Verificar autenticación
4. **Listar Estados** → Ver estados disponibles
5. **Crear Vehículo** → Probar creación con diferentes ejemplos
6. **Listar Vehículos** → Ver vehículos creados
7. **Actualizar/Eliminar** → Probar modificaciones

¡Listo para probar! 🚀