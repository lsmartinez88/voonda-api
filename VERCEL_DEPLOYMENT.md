# 🚀 Guía de Deployment a Vercel - Voonda API

## Configuración Previa

### 1. Base de Datos
Tu API necesita una base de datos PostgreSQL en la nube. Opciones recomendadas:
- **Supabase** (gratis): https://supabase.com
- **Neon** (gratis): https://neon.tech  
- **Railway** (gratis limitado): https://railway.app
- **PlanetScale** (gratis limitado): https://planetscale.com

### 2. Obtener DATABASE_URL
Una vez creada tu base de datos, obtendrás una URL similar a:
```
postgresql://user:password@host:port/database
```

## Deployment en Vercel

### Opción A: Deployment directo desde GitHub

1. **Conectar GitHub a Vercel:**
   - Ve a https://vercel.com
   - Regístrate/inicia sesión con GitHub
   - Selecciona "Import Project"
   - Conecta este repositorio

2. **Configurar Variables de Entorno en Vercel:**
   ```
   DATABASE_URL = postgresql://...
   JWT_SECRET = tu-jwt-secret-aqui
   NODE_ENV = production
   FRONTEND_URL = https://tu-frontend.vercel.app
   ```

3. **Deploy automático:**
   - Vercel detectará el `vercel.json`
   - Ejecutará `npm install` y `vercel-build`
   - Tu API estará disponible en: `https://tu-proyecto.vercel.app`

### Opción B: Deployment desde CLI

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login y configurar:**
   ```bash
   vercel login
   cd /ruta/a/tu/proyecto
   vercel
   ```

3. **Configurar variables durante el setup:**
   - Vercel te preguntará por las variables de entorno
   - Agrégalas una por una

## URLs Importantes Después del Deploy

- **API Base:** `https://tu-proyecto.vercel.app`
- **Swagger Docs:** `https://tu-proyecto.vercel.app/api-docs`
- **Health Check:** `https://tu-proyecto.vercel.app/health`
- **DB Health:** `https://tu-proyecto.vercel.app/db-health`

## Variables de Entorno Requeridas

```env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key-here"
NODE_ENV="production"
FRONTEND_URL="https://yourfrontend.vercel.app"
PORT=3001
```

## Configuración de CORS

La API está configurada para aceptar requests desde:
- `localhost:3000` (desarrollo local)
- `localhost:3001` (API local)
- `voonda.com` (producción)
- La URL en `FRONTEND_URL`

Para agregar más dominios, edita el array `allowedOrigins` en `server.js`.

## Comandos Post-Deployment

### Aplicar migraciones/schema a la BD:
```bash
npx prisma db push --accept-data-loss
```

### Insertar datos iniciales:
```bash
npx prisma db seed
```

### Ver la base de datos:
```bash
npx prisma studio
```

## Swagger Documentation

Una vez deployed, tendrás acceso a:

1. **Swagger UI interactivo:** `https://tu-proyecto.vercel.app/api-docs`
   - Interfaz visual para probar endpoints
   - Documentación automática de todos los endpoints
   - Autenticación JWT integrada

2. **Documentación estática:** `https://tu-proyecto.vercel.app/frontend-api-docs.md`
   - Documentación en texto plano para frontend
   - Formatos de request/response
   - Ejemplos de uso

## Testing de la API

### 1. Health Check:
```bash
curl https://tu-proyecto.vercel.app/health
```

### 2. Login de prueba (usando datos del seed):
```bash
curl -X POST https://tu-proyecto.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin.empresa@voonda.com","password":"admin123"}'
```

### 3. Obtener estados:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://tu-proyecto.vercel.app/api/estados
```

## Arquitectura de la API

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│   Vercel API    │────│   PostgreSQL    │
│   (React/Next)  │    │   (Node.js)     │    │   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                       ┌─────────────────┐
                       │   Swagger UI    │
                       │   /api-docs     │
                       └─────────────────┘
```

## Troubleshooting

### Error "Module not found: prisma"
- Asegúrate de que `vercel-build` ejecute `prisma generate`

### Error de conexión a BD:
- Verifica que `DATABASE_URL` esté correcta
- Testea la conexión desde `/db-health`

### CORS errors:
- Agrega tu dominio frontend a `allowedOrigins` en `server.js`
- Redeploya después de cambios

### 401 Unauthorized:
- Verifica que el token JWT esté en el header: `Authorization: Bearer TOKEN`
- Testea login en `/api-docs`

## Monitoreo

Vercel provee:
- **Logs en tiempo real:** Panel de Vercel > Functions tab
- **Analytics:** Panel de Vercel > Analytics tab  
- **Error tracking:** Automático en el dashboard

Para logs más avanzados, considera integrar:
- Sentry para error tracking
- LogRocket para session replay
- New Relic para performance monitoring

## Next Steps

1. ✅ Deploy básico funcionando
2. ✅ Swagger documentation disponible
3. 🔄 Configurar dominio personalizado
4. 🔄 Implementar CI/CD con GitHub Actions
5. 🔄 Agregar tests automatizados
6. 🔄 Configurar monitoring avanzado
7. 🔄 Implementar rate limiting por usuario
8. 🔄 Agregar cache con Redis

---

¡Tu API Voonda está lista para producción! 🎉