## Seguridad, autenticación y pruebas (implementado)

He agregado varias mejoras de seguridad, autenticación y utilidades de prueba para dejar la API lista para uso más serio. A continuación se enlistan las medidas implementadas, por qué existen, y dónde buscarlas en el repositorio.

- **Autenticación segura (JWT + Refresh tokens):**
   - Implementado: `POST /auth/login`, `POST /auth/register` (solo administradores), `POST /auth/refresh-token`, `POST /auth/logout`.
   - Uso de `jsonwebtoken` para `access tokens` (corto plazo) y `refresh tokens` (largo plazo).
   - Los refresh tokens se guardan en la tabla `RefreshToken` para poder revocarlos (modelo: `models/refreshToken.js`).
   - Código principal: `controllers/authController.js`.

- **Passwords hasheadas con bcrypt:**
   - Todas las contraseñas se almacenan usando `bcrypt` (salt + rounds). Ver: `controllers/authController.js` y `controllers/usuarioController.js`.

- **Validación de inputs:**
   - Validaciones básicas para email, password y `rol_id` en controladores.
   - Evita crashes y reduce vectores de inyección (además del uso del ORM). Archivos: `controllers/authController.js`, `controllers/usuarioController.js`.

- **Headers de seguridad (`helmet`):**
   - `app.js` incluye `app.use(helmet())` para añadir cabeceras de seguridad (XSS, HSTS, X-Frame-Options, etc.).

- **Rate limiting:**
   - Limitador global: en `app.js` hay un rate limiter general (15 min / 100 req por IP) para reducir abuso general.
   - Limitador específico en login: en `routes/authRoutes.js` se añadió `loginLimiter` (15 min / 5 intentos por IP) para mitigar fuerza bruta.

- **Variables de entorno:**
   - Todas las credenciales y secretos deben estar en `.env` (ej.: `JWT_SECRET`, `JWT_REFRESH_SECRET`, `DB_*`). No se deben versionar.
   - Archivo de ejemplo/actual: `.env`.

- **Logs de seguridad (winston):**
   - Se registran accesos, intentos fallidos y errores en `utils/logger.js`.
   - Logs en `logs/combined.log` y `logs/error.log`.

- **Documentación y pruebas:**
   - Swagger UI disponible en `/api-docs` (configuración en `conexion/swagger.js`).
   - Archivo de pruebas HTTP para VSCode REST Client: `api.http`. Incluye:
      - Secuencia de login/register.
      - Prueba de rate limit en `/auth/login` (6 intentos; el 6º debe devolver 429).
      - Pruebas para `refresh-token`, `logout`, intento de `refresh` con token revocado y prueba de token malformado.

- **Modelos y scripts:**
   - Nuevo modelo: `models/refreshToken.js`.
   - Relaciones actualizadas en `models/index.js` para relacionar `Usuario` ↔ `RefreshToken`.
   - Scripts: `scripts/seedRoles.js` (crear roles), `scripts/createAdmin.js` (crear admin si hace falta).

## Cómo probar localmente (rápido)

1. Instalar dependencias:

```bash
npm install
```

2. Configurar `.env` con credenciales y secretos (ejemplo mínimo):

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TuPassword
DB_NAME=trailerflix
JWT_SECRET=una-clave-secreta-larga
JWT_REFRESH_SECRET=una-clave-refresh-muy-secreta
```

3. Iniciar la base de datos y sincronizar modelos (opción rápida):

```bash
# sincroniza modelos (crea tabla RefreshToken automáticamente)
node -e "const {sequelize}=require('./models'); sequelize.sync({alter:true}).then(()=>console.log('sync ok')).catch(console.error)"
```

4. Correr la app:

```bash
npm run dev
# o
npm start
```

5. Probar endpoints con la extensión REST Client abriendo `api.http` y ejecutando:
   - Ejecutá la secuencia `RL1..RL6` para comprobar que al sexto intento obtienes 429.
   - Haz un login válido (`/auth/login`), copia `refreshToken` y prueba `/auth/refresh-token` y `/auth/logout`.

También podés usar curl o PowerShell (`Invoke-RestMethod`) para las mismas requests.

## Qué evitar y recomendaciones operativas

- Usar HTTPS en producción (TLS obligatorio).
- Guardar los secretos en un gestor seguro (Vault, AWS Secrets Manager, etc.).
- Rotar `JWT_REFRESH_SECRET` si hay evidencia de leak y ofrecer endpoint para invalidar tokens de usuarios comprometidos.
- Para despliegues con múltiples réplicas, mover el store del rate limiter a Redis.

Si querés que documente esto en formato más corto para el GitHub README principal (por ejemplo, una sección 'Security' más resumida), lo dejo preparado y lo recorto. También puedo abrir un PR con estos cambios.
