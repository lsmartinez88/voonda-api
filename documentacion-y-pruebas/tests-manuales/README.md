# 🧪 Tests Manuales - Voonda API

Esta carpeta contiene scripts de prueba manual para validar la funcionalidad de la API en diferentes entornos.

## 📋 Scripts Disponibles

### `test-crear-vehiculo.js`
**Propósito:** Prueba la creación de vehículos en entorno local
- ✅ Valida campos obligatorios
- ✅ Prueba auto-creación de vendedores
- ✅ Verifica respuesta del endpoint

**Uso:**
```bash
node documentacion-y-pruebas/tests-manuales/test-crear-vehiculo.js
```

### `test-crear-vehiculo-prod.js`
**Propósito:** Prueba la creación de vehículos en entorno de producción
- ✅ Valida contra URL de producción
- ✅ Usa autenticación real
- ✅ Verifica respuesta en ambiente productivo

**Uso:**
```bash
node documentacion-y-pruebas/tests-manuales/test-crear-vehiculo-prod.js
```

### `test-actualizar-vehiculo.js`
**Propósito:** Prueba la actualización de vehículos existentes
- ✅ Valida modificación de campos
- ✅ Prueba validaciones de estado
- ✅ Verifica manejo de errores

**Uso:**
```bash
node documentacion-y-pruebas/tests-manuales/test-actualizar-vehiculo.js
```

## ⚙️ Configuración

### Variables de Entorno Requeridas
```bash
# Para tests locales
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"

# Para tests de producción (test-crear-vehiculo-prod.js)
PROD_API_URL="https://api.fratelli.voonda.net"
PROD_TOKEN="your-production-token"
```

### Dependencias
Los tests usan las siguientes dependencias que deben estar instaladas:
- `axios` - Para requests HTTP
- `dotenv` - Para variables de entorno
- `prisma` - Para conexión a BD (tests locales)

## 🚀 Ejecución

### Tests Locales
```bash
# Asegurar que el servidor local está corriendo
npm run dev

# En otra terminal, ejecutar tests
node documentacion-y-pruebas/tests-manuales/test-crear-vehiculo.js
node documentacion-y-pruebas/tests-manuales/test-actualizar-vehiculo.js
```

### Tests de Producción
```bash
# No requiere servidor local
node documentacion-y-pruebas/tests-manuales/test-crear-vehiculo-prod.js
```

## 🎯 Casos de Uso

### **Durante Desarrollo**
- Ejecutar `test-crear-vehiculo.js` después de cambios en controllers
- Usar `test-actualizar-vehiculo.js` para validar modificaciones

### **Antes de Deploy**
- Ejecutar todos los tests locales
- Verificar que no hay errores de conexión o validación

### **Post-Deploy**
- Ejecutar `test-crear-vehiculo-prod.js` para validar producción
- Verificar que la API responde correctamente en el entorno real

## 🔧 Personalización

### Agregar Nuevos Tests
1. Crear archivo `test-nueva-funcionalidad.js`
2. Seguir el patrón de los tests existentes:
   ```javascript
   require('dotenv/config');
   const axios = require('axios');
   
   async function testNuevaFuncionalidad() {
     try {
       // Lógica del test
       console.log('✅ Test pasó');
     } catch (error) {
       console.error('❌ Test falló:', error.message);
     }
   }
   
   testNuevaFuncionalidad();
   ```

### Modificar Tests Existentes
- **URL Base:** Cambiar en las variables del archivo
- **Datos de Prueba:** Modificar objetos de payload
- **Validaciones:** Agregar más verificaciones en el catch/try

## 🚨 Troubleshooting

### Error: "ECONNREFUSED"
- ✅ **Solución:** Verificar que el servidor esté corriendo en `http://localhost:3001`

### Error: "Database connection failed"
- ✅ **Solución:** Verificar `DATABASE_URL` en `.env`

### Error: "Token inválido"
- ✅ **Solución:** Generar nuevo token usando endpoint `/api/auth/login`

### Error de Validación
- ✅ **Solución:** Verificar que los datos de prueba cumplan las validaciones actuales

## 📝 Notas

- **Tests Destructivos:** Estos tests crean datos reales en la base de datos
- **Cleanup:** Considera limpiar datos de prueba después de ejecutar
- **Tokens:** Los tokens de producción expiran, generar nuevos según necesidad
- **Entornos:** Nunca ejecutar tests de producción contra base de datos local

---

💡 **Recomendación:** Usar estos tests en conjunto con la [colección de Postman](../postman/) para cobertura completa de testing.