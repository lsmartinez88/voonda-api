# Voonda API Project

Este es un proyecto API completo usando Next.js con autenticación JWT y CRUD de vehículos, conectado a Supabase como base de datos.

## Estructura del proyecto
- **Autenticación**: JWT con endpoints de login, register, logout, me
- **CRUD Vehículos**: Operaciones completas con filtros, paginación y búsqueda
- **Base de datos**: Supabase con tablas de vehículos y modelo_autos
- **Validaciones**: Joi para validación de datos
- **Middleware**: Autenticación y CORS
- **Puerto**: 3001

## Variables de entorno requeridas
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY  
- JWT_SECRET
- PORT=3001

## Importante
- cada vez que se realiza un cambio en routes hay que actualizar la informacion del swagger correspondiente. 
- cuando se cambia alguna definicion de la api hay que actualizar el archivo frontend-api-docs.md
- Siempre que se cambie alguna definicion en la api hay que actulizar el archivo Voonda-API.postman_collection.json
- TODOS LOS DOCUMENTOS EN LA CARPETA documentacion-y-pruebas, tienen que estar al dia y actualizados con los cambios realizados en la api.