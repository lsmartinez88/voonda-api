# 📚 Documentación y Pruebas - Voonda API

Esta carpeta contiene toda la documentación técnica, archivos de prueba y configuraciones relacionadas con la API de Voonda.

## 📁 Estructura de Carpetas

```
documentacion-y-pruebas/
├── README.md                    # Este archivo - Índice general
├── frontend/                    # Documentación para desarrolladores frontend
│   └── frontend-api-docs.md     # Documentación completa de endpoints
├── postman/                     # Colecciones y configuraciones de Postman
│   ├── Voonda-API.postman_collection.json      # Colección completa con casos de prueba
│   ├── Voonda-API-Local.postman_environment.json # Variables de entorno para desarrollo
│   └── POSTMAN_README.md        # Guía de uso de la colección Postman
├── swagger/                     # Configuración y documentación Swagger
│   └── swagger.config.js        # Configuración de Swagger UI
├── tests-manuales/             # Scripts de prueba manual para desarrollo
│   ├── test-crear-vehiculo.js   # Test creación local
│   ├── test-crear-vehiculo-prod.js # Test creación producción
│   ├── test-actualizar-vehiculo.js # Test actualización
│   └── README.md               # Guía de tests manuales
├── deployment/                 # Documentación de despliegue
│   └── VERCEL_DEPLOYMENT.md    # Guía de deploy en Vercel
└── prisma/                     # Documentación de base de datos
    └── README-PRISMA.md        # Guía de Prisma ORM
```

## 🎯 ¿Qué encontrarás aquí?

### 👩‍💻 **Para Desarrolladores Frontend** (`frontend/`)
- **`frontend-api-docs.md`**: Documentación completa de todos los endpoints
  - Campos obligatorios y opcionales
  - Ejemplos de request y response
  - Códigos de error y validaciones
  - Autenticación y autorización

### 🧪 **Para Testing con Postman** (`postman/`)
- **`Voonda-API.postman_collection.json`**: Colección completa con:
  - ✅ 6 casos de éxito (campos mínimos, completos, estados especiales)
  - ❌ 11 casos de error (validaciones específicas)
  - 🔍 5 casos de búsqueda y filtrado
- **`Voonda-API-Local.postman_environment.json`**: Variables de entorno para desarrollo local
- **`POSTMAN_README.md`**: Guía paso a paso para usar la colección

### �️ **Para Tests Manuales** (`tests-manuales/`)
- **Scripts de Node.js** para testing directo:
  - `test-crear-vehiculo.js` - Test creación local
  - `test-crear-vehiculo-prod.js` - Test producción
  - `test-actualizar-vehiculo.js` - Test actualización
- **`README.md`**: Guía de uso de scripts manuales

### �📖 **Para Documentación Swagger** (`swagger/`)
- **`swagger.config.js`**: Configuración de Swagger UI
- Acceso: `http://localhost:3001/api-docs` (cuando el servidor está corriendo)

### 🚀 **Para Deployment** (`deployment/`)
- **`VERCEL_DEPLOYMENT.md`**: Guía completa de deploy en Vercel
- Configuración de variables de entorno
- Troubleshooting de producción

### 🗄️ **Para Base de Datos** (`prisma/`)
- **`README-PRISMA.md`**: Documentación de Prisma ORM
- Schema, migraciones y queries
- Relaciones entre tablas

## 🚀 Inicio Rápido

### 1. **Testing Inmediato con Postman**
```bash
# 1. Importar archivos en Postman:
#    - postman/Voonda-API.postman_collection.json
#    - postman/Voonda-API-Local.postman_environment.json

# 2. Seguir guía en:
#    postman/POSTMAN_README.md
```

### 2. **Testing Manual con Scripts Node.js**
```bash
# Tests locales (requiere servidor corriendo en :3001)
node documentacion-y-pruebas/tests-manuales/test-crear-vehiculo.js
node documentacion-y-pruebas/tests-manuales/test-actualizar-vehiculo.js

# Tests de producción
node documentacion-y-pruebas/tests-manuales/test-crear-vehiculo-prod.js

# Ver guía completa:
open documentacion-y-pruebas/tests-manuales/README.md
```

### 3. **Consultar Documentación API**
```bash
# Para desarrolladores frontend:
open documentacion-y-pruebas/frontend/frontend-api-docs.md

# Para documentación interactiva (con servidor corriendo):
open http://localhost:3001/api-docs
```

### 4. **Deploy y Configuración**
```bash
# Guía de deployment en Vercel:
open documentacion-y-pruebas/deployment/VERCEL_DEPLOYMENT.md

# Documentación de Prisma ORM:
open documentacion-y-pruebas/prisma/README-PRISMA.md
```

## 🎭 Casos de Uso por Perfil

### **🧪 QA/Tester**
1. Importa la colección de `postman/`
2. Ejecuta casos de éxito y error siguiendo `postman/POSTMAN_README.md`
3. Usa scripts manuales en `tests-manuales/` para testing directo
4. Valida todas las validaciones de negocio

### **🔧 Backend Developer**
1. Actualiza documentación en `frontend/` al cambiar endpoints
2. Agrega nuevos casos en `postman/` al crear funcionalidades
3. Crea scripts de test en `tests-manuales/` para validación rápida
4. Mantiene `swagger/swagger.config.js` actualizado
5. Actualiza `deployment/` y `prisma/` según cambios

### **👥 Product Owner**
1. Consulta `frontend/frontend-api-docs.md` para entender capacidades
2. Revisa casos de prueba en `postman/POSTMAN_README.md`
3. Usa `deployment/VERCEL_DEPLOYMENT.md` para entender el deployment
4. Valida que los endpoints cumplan los requerimientos

### **🚀 DevOps/Deploy**
1. Sigue `deployment/VERCEL_DEPLOYMENT.md` para deployments
2. Usa `tests-manuales/test-crear-vehiculo-prod.js` para validar producción
3. Consulta `prisma/README-PRISMA.md` para configuración de BD

## 📋 Checklist de Mantenimiento

### ✅ **Al agregar/modificar endpoints:**
- [ ] Actualizar `frontend/frontend-api-docs.md`
- [ ] Agregar casos en `postman/Voonda-API.postman_collection.json`
- [ ] Actualizar `swagger/swagger.config.js` si es necesario
- [ ] Verificar que los casos de prueba pasen

### ✅ **Al cambiar validaciones:**
- [ ] Actualizar ejemplos en `frontend/frontend-api-docs.md`
- [ ] Crear casos de error específicos en Postman
- [ ] Documentar nuevas validaciones

### ✅ **Al cambiar autenticación:**
- [ ] Actualizar todas las documentaciones
- [ ] Modificar scripts de autenticación en Postman
- [ ] Verificar que Swagger tenga la configuración correcta

## 🔗 Enlaces Útiles

- **Servidor Local**: http://localhost:3001
- **Swagger UI**: http://localhost:3001/api-docs
- **Repositorio**: https://github.com/lsmartinez88/voonda-api

## 📞 Soporte

Si tienes preguntas sobre la documentación o encontraste algún error:

1. **Revisa** primero la documentación correspondiente
2. **Prueba** con los casos de Postman incluidos
3. **Consulta** los ejemplos en `frontend-api-docs.md`
4. **Contacta** al equipo de backend si el problema persiste

---

💡 **Tip**: Esta estructura mantiene toda la documentación organizada y facilita el mantenimiento. Cada cambio en el código debe reflejarse en la documentación correspondiente.