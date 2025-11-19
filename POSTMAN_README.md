# 📮 Voonda API - Colección de Postman

## 🚀 Importar en Postman

### 1. **Importar la Colección**
- Abrir Postman
- Clic en **"Import"** (botón superior izquierdo)
- Arrastrar o seleccionar el archivo: `Voonda-API.postman_collection.json`

### 2. **Importar el Environment**
- Clic en **"Import"** nuevamente
- Arrastrar o seleccionar el archivo: `Voonda-API-Local.postman_environment.json`
- En la esquina superior derecha, seleccionar **"Voonda API - Local Development"**

## 🔑 Autenticación

### **Paso 1: Login**
1. Ir a **🔐 Autenticación > Login**
2. El body ya tiene credenciales predeterminadas:
   ```json
   {
     "email": "admin@voonda.com",
     "password": "123456"
   }
   ```
3. Ejecutar la request (Send)
4. ✅ **El token se guarda automáticamente** en la variable de environment

### **Paso 2: Verificar autenticación**
- Ejecutar **🔐 Autenticación > Me (Usuario actual)** para verificar que el token funciona

## 🚗 Probar Creación de Vehículos

### **Opción 1: Ejemplo Mínimo**
- **🚗 Vehículos > Crear Vehículo (Ejemplo Mínimo)**
- Solo campos obligatorios:
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

### **Opción 2: Ejemplo Completo**
- **🚗 Vehículos > Crear Vehículo (Ejemplo Completo)**
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