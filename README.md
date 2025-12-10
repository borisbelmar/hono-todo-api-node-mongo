# Todo List API with Hono and MongoDB

API REST completa construida con Hono, TypeScript, Node.js, MongoDB y Cloudflare R2.

## 🚀 Características

- ✅ **Autenticación JWT** con bcryptjs para hashing de passwords
- 🔒 **Sistema de usuarios** con registro y login
- 📝 **CRUD de Todos** privado por usuario (aislamiento de datos)
- 🖼️ **Gestión de imágenes** con Cloudflare R2 via AWS SDK (upload, download, delete)
- 🌐 **Acceso público a imágenes** sin necesidad de autenticación
- 🗄️ **MongoDB** como base de datos con Mongoose
- ✨ **Validación con Zod** en todas las rutas
- 📖 **Documentación OpenAPI/Swagger** interactiva
- 🎯 **TypeScript** con ESLint (Standard JS)
- 🔑 **Configuración centralizada** sin dependencia de c.env
- 🐳 **Docker y Docker Compose** para desarrollo y producción
- 📊 **Logging con Winston** (consola)
- 📦 **Build con tsup** (ESM)
- 🚀 **CI/CD con GitHub Actions** (build, lint, push a GHCR)

## 📋 Stack Tecnológico

- **Framework:** Hono con OpenAPIHono
- **Runtime:** Node.js 20 con @hono/node-server
- **Base de datos:** MongoDB con Mongoose
- **Almacenamiento:** Cloudflare R2 via AWS S3 SDK
- **Autenticación:** JWT (jose) + bcryptjs
- **Validación:** Zod + @hono/zod-openapi
- **Logging:** Winston
- **Build:** tsup (ESM)
- **Containerización:** Docker multi-stage
- **CI/CD:** GitHub Actions
- **Package Manager:** Yarn 1.22.22

## 📁 Estructura del Proyecto

```
src/
├── config/              # Configuración centralizada
│   └── index.ts         # Exports config object (mongodb, auth, r2, server)
├── lib/                 # Bibliotecas e inicializaciones
│   ├── logger.ts        # Winston logger con handlers globales
│   └── r2.ts            # S3Client configurado para R2
├── db/                  # Conexión a base de datos
│   └── connection.ts    # MongoDB connection manager
├── models/              # Modelos Mongoose
│   ├── user.model.ts    # User schema con auto-generated ID
│   └── todo.model.ts    # Todo schema con auto-generated ID
├── controllers/         # Lógica de negocio (MVC)
│   ├── auth/           # Registro y login
│   ├── todo/           # CRUD de todos (6 controladores)
│   └── image/          # Gestión de imágenes R2 (3 controladores)
├── routes/             # Routers Hono (un archivo por endpoint)
│   ├── auth/
│   ├── todo/
│   └── image/
├── middleware/         # Middlewares
│   ├── auth.middleware.ts    # JWT validation
│   ├── logger.middleware.ts  # Request/response logging
│   └── error.middleware.ts   # Global error handler
├── schemas/            # Schemas de validación Zod
├── types/              # Tipos TypeScript
├── utils/              # Utilidades
│   ├── jwt.ts          # JWT generation/verification
│   ├── crypto.ts       # Password hashing con bcryptjs
│   └── r2.ts           # R2 utilities (upload, get, delete, exists)
└── index.ts            # Entry point con middleware chain
```

## 🛠️ Instalación y Desarrollo

### Prerequisitos

- Node.js 20+
- Yarn 1.22.22
- MongoDB (local, Docker, o MongoDB Atlas)
- Cuenta de Cloudflare R2 (para almacenamiento de imágenes)

### Configuración Inicial

```bash
# Instalar dependencias
yarn install

# Configurar variables de entorno
cp .env.example .env  # Editar con tus valores
```

### Variables de Entorno

Crear archivo `.env` en la raíz:

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/todo-list
# O MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/todo-list

# Autenticación
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PASSWORD_SALT=your-password-salt-change-in-production

# Servidor
PORT=8787

# Cloudflare R2 (AWS S3 Compatible)
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=todo-images
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev  # URL pública de tu bucket
```

### Base de Datos

La aplicación usa Mongoose para MongoDB:
- Los modelos incluyen auto-generación de IDs con nanoid
- Conexión automática al iniciar con logging
- Manejo de errores de conexión
- Shutdown graceful

### Comandos Disponibles

```bash
# Desarrollo con hot reload
yarn dev

# Build para producción
yarn build

# Ejecutar en producción
yarn start

# Linting
yarn lint
yarn lint:fix
```

## 🐳 Docker

La aplicación incluye configuración Docker multi-stage optimizada y Docker Compose para desarrollo y producción.

### Desarrollo con Docker Compose

```bash
# Iniciar API en desarrollo (hot reload con tsx watch)
docker-compose -f docker-compose.dev.yml up

# Segundo plano
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Detener
docker-compose -f docker-compose.dev.yml down
```

### Producción con Docker Compose

```bash
# Build y ejecutar
docker-compose up --build

# Segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

### Build Manual

```bash
# Build imagen
docker build -t todo-api .

# Ejecutar
docker run -p 8787:8787 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/todo-list \
  -e JWT_SECRET=secret \
  -e PASSWORD_SALT=salt \
  -e R2_ACCOUNT_ID=xxx \
  -e R2_ACCESS_KEY_ID=xxx \
  -e R2_SECRET_ACCESS_KEY=xxx \
  -e R2_BUCKET_NAME=images \
  todo-api
```

**Características Docker:**
- ✅ Multi-stage build (builder + runtime)
- 🔄 Hot reload en dev con volumes
- 💚 Health checks
- 📦 Imagen optimizada (~100MB)
- 🔐 Non-root user
- ☁️ MongoDB externo (no incluido en compose)

## 🚀 CI/CD

GitHub Actions configurado para:

1. ✅ **Lint** en cada push
2. 🐳 **Build de imagen Docker**
3. 📦 **Push a GitHub Container Registry** (ghcr.io)
4. 🏷️ **Tags automáticos**: latest, sha, branch

### Usar la Imagen

```bash
# Pull desde GHCR
docker pull ghcr.io/<tu-usuario>/todo-list-hono-api:latest

# Ejecutar
docker run -p 8787:8787 \
  -e MONGODB_URI=... \
  -e JWT_SECRET=... \
  ghcr.io/<tu-usuario>/todo-list-hono-api:latest
```

### Configuración Requerida

En tu repositorio de GitHub:
- **Settings → Actions → General → Workflow permissions**
- Seleccionar: "Read and write permissions"

## 📚 API Reference

### 📖 Documentación Interactiva

La API incluye documentación interactiva con Swagger UI y esquema de autenticación global:

- **Swagger UI:** [http://localhost:8787/docs](http://localhost:8787/docs) (desarrollo)
- **OpenAPI JSON:** `/openapi.json`

**Características de la documentación:**
- ✨ Explorar todos los endpoints disponibles
- 📝 Esquemas de request/response con Zod
- 🧪 Probar las rutas directamente desde el navegador
- 🔐 Autenticación JWT integrada en la documentación
- 🔐 **Autenticación global:** Botón "Authorize" para configurar el token JWT una sola vez
- 🏷️ Endpoints organizados por tags (Auth, Todos, Images)
- 📋 Ejemplos de uso en cada endpoint

### Base URL

- **Local:** `http://localhost:8787`
- **Producción:** `https://basic-hono-api.borisbelmarm.workers.dev`

### Endpoints Públicos

#### Healthcheck

```bash
GET /health
```

**Respuesta:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-24T10:00:00.000Z"
}
```

#### Información de la API

```bash
GET /
```

**Respuesta:**
```json
{
  "message": "Bienvenido a la API con Hono",
  "documentation": "/docs",
  "openapi": "/openapi.json",
  "endpoints": {
    "health": "/health",
    "auth": {
      "register": "/auth/register",
      "login": "/auth/login"
    },
    "todos": "/todos (requiere autenticación)",
    "images": "/images (requiere autenticación)"
  }
}
```
```

---

### 🔐 Autenticación

**Todas las rutas protegidas requieren:**
```
Authorization: Bearer {token}
```

**En Swagger UI:** Usa el botón "Authorize" (🔒) en la parte superior para configurar el token una sola vez. Se aplicará automáticamente a todos los endpoints protegidos.

#### Registrar Usuario

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validaciones:**
- Email válido
- Password mínimo 6 caracteres

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "abc123",
      "email": "user@example.com",
      "createdAt": "2025-11-24T10:00:00.000Z",
      "updatedAt": "2025-11-24T10:00:00.000Z"
    },
    "token": "eyJhbGc..."
  }
}
```

#### Iniciar Sesión

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "user": { /* mismo formato que register */ },
    "token": "eyJhbGc..."
  }
}
```

---

### 📝 Todos (Requiere Autenticación)

**Todas las rutas de todos requieren el header:**
```
Authorization: Bearer {token}
```

#### Listar Todos del Usuario

```bash
GET /todos
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "xyz789",
      "userId": "abc123",
      "title": "Comprar leche",
      "completed": false,
      "location": {
        "latitude": 40.7128,
        "longitude": -74.0060
      },
      "photoUri": "https://example.com/photo.jpg",
      "createdAt": "2025-11-24T10:00:00.000Z",
      "updatedAt": "2025-11-24T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### Obtener Todo por ID

```bash
GET /todos/:id
Authorization: Bearer {token}
```

#### Crear Todo

```bash
POST /todos
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Comprar leche",
  "completed": false,
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "photoUri": "https://example.com/photo.jpg"
}
```

**Validaciones:**
- `title`: string, requerido, mínimo 1 carácter
- `completed`: boolean, opcional (default: false)
- `location.latitude`: number, -90 a 90
- `location.longitude`: number, -180 a 180
- `photoUri`: string, URL válida, opcional

#### Actualizar Todo (PUT - Reemplazo Completo)

```bash
PUT /todos/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Comprar pan",
  "completed": true,
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "photoUri": "https://example.com/new-photo.jpg"
}
```

#### Actualizar Todo (PATCH - Parcial)

```bash
PATCH /todos/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "completed": true
}
```

**Nota:** Al menos un campo debe ser proporcionado

#### Eliminar Todo

```bash
DELETE /todos/:id
Authorization: Bearer {token}
```

---

### 🖼️ Imágenes

**Rutas protegidas (requieren token):**
- POST `/images` - Subir imagen
- DELETE `/images/:userId/:imageId` - Eliminar imagen

**Rutas públicas:**
- GET `/images/:userId/:imageId` - Obtener imagen (sin autenticación)

#### Subir Imagen

```bash
POST /images
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
  image: [archivo de imagen]
```

**Validaciones:**
- Tamaño máximo: 5MB
- Formatos permitidos: JPEG, PNG, WebP, GIF

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "url": "/images/abc123/xyz789.jpg",
    "key": "abc123/xyz789.jpg",
    "size": 245678,
    "contentType": "image/jpeg"
  }
}
```

#### Obtener Imagen (Público)

```bash
GET /images/:userId/:imageId
```

**⚠️ Nota:** Este endpoint es **público** y no requiere autenticación.

**Respuesta:** Archivo de imagen con headers de cache

**Headers de respuesta:**
- `Content-Type`: Tipo MIME de la imagen (image/jpeg, image/png, etc.)
- `Cache-Control`: `public, max-age=31536000` (1 año)

**Ejemplo:**
```bash
curl http://localhost:8787/images/user123/abc123.jpg -o imagen.jpg
```

#### Eliminar Imagen

```bash
DELETE /images/:userId/:imageId
Authorization: Bearer {token}
```

**Nota:** Solo el dueño de la imagen puede eliminarla.

**🧹 Limpieza automática:**
- Al actualizar el `photoUri` de un todo, la imagen anterior se elimina automáticamente de R2
- Al eliminar un todo, su imagen asociada se elimina automáticamente de R2
- Previene acumulación de archivos huérfanos

---

## 📊 Logging

Winston configurado con:
- ✅ Output a consola con colores
- 📝 Request/response logging automático
- ❌ Error logging con stack traces
- 🔄 Uncaught exception/rejection handlers
- 🎨 Formato timestamp y colorizado

Los logs incluyen:
- HTTP requests (método, path, status, duración)
- Errores de aplicación con contexto
- Conexiones de MongoDB
- Operaciones R2

---

## 🗄️ Base de Datos

### Modelos Mongoose

#### User Model
```typescript
{
  id: string          // Auto-generated con nanoid
  email: string       // Unique, lowercase
  passwordHash: string // bcrypt hash
  createdAt: Date
  updatedAt: Date
}
```

#### Todo Model
```typescript
{
  id: string          // Auto-generated con nanoid
  userId: string      // Foreign key
  title: string
  completed: boolean
  location?: {
    latitude: number
    longitude: number
  }
  photoUri?: string
  createdAt: Date
  updatedAt: Date
}
```

### Índices

- User: `email` (unique), `id` (unique)
- Todo: `userId`, `id` (unique)

---

## ☁️ Cloudflare R2

### Configuración

R2 se usa via AWS S3 SDK con endpoint compatible:

```typescript
// src/lib/r2.ts
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.r2.accessKeyId,
    secretAccessKey: config.r2.secretAccessKey,
  },
})
```

### Operaciones

```typescript
// Upload
await uploadToR2(key, buffer, contentType)

// Download
const { body, contentType } = await getFromR2(key)

// Delete
await deleteFromR2(key)

// Exists
const exists = await existsInR2(key)
```

### Estructura de Keys

```
{userId}/{imageId}.{ext}
```

Ejemplo: `abc123/xyz789.jpg`

### URL Pública

Si configuras `R2_PUBLIC_URL`, las imágenes se retornan con URL completa:

```
https://pub-xxxxx.r2.dev/abc123/xyz789.jpg
```

---

## 📦 Deployment

### Opción 1: Docker (Recomendado)

La aplicación se puede desplegar en cualquier plataforma que soporte Docker:

#### Railway / Render / Fly.io

1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno
3. La plataforma detectará el `Dockerfile` automáticamente
4. Deploy automático en cada push

#### Variables de Entorno Requeridas

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/todo-list
JWT_SECRET=your-production-jwt-secret
PASSWORD_SALT=your-production-password-salt
R2_ACCOUNT_ID=your-r2-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=todo-images
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
PORT=8787
```

### Opción 2: Usar Imagen de GHCR

```bash
# Pull imagen desde GitHub Container Registry
docker pull ghcr.io/<tu-usuario>/todo-list-hono-api:latest

# Ejecutar
docker run -p 8787:8787 \
  -e MONGODB_URI=mongodb+srv://... \
  -e JWT_SECRET=... \
  -e PASSWORD_SALT=... \
  -e R2_ACCOUNT_ID=... \
  -e R2_ACCESS_KEY_ID=... \
  -e R2_SECRET_ACCESS_KEY=... \
  -e R2_BUCKET_NAME=images \
  -e R2_PUBLIC_URL=https://... \
  ghcr.io/<tu-usuario>/todo-list-hono-api:latest
```

### Generar Secretos Seguros

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Node.js:**
```javascript
require('crypto').randomBytes(32).toString('base64')
```

### Configurar MongoDB Atlas

1. Crea un cluster en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist IPs o permite acceso desde cualquier IP (0.0.0.0/0)
3. Crea un usuario de base de datos
4. Obtén la connection string
5. Configúrala en `MONGODB_URI`

### Configurar Cloudflare R2

1. Ve a Cloudflare Dashboard → R2
2. Crea un bucket para imágenes
3. Genera API tokens en R2 settings
4. Configura Custom Domain (opcional) para URL pública
5. Agrega las credenciales a variables de entorno

---

## 🏗️ Arquitectura

### Flujo de Request

```
Request → Logger Middleware
       → Error Handler
       → Auth Middleware (rutas protegidas)
       → Route Handler
       → Controller
       → Model (Mongoose)
       → MongoDB / R2
       → Response
```

### Configuración Centralizada

Todo el código accede a configuración via:

```typescript
import { config } from './config'

config.mongodb.uri
config.auth.jwtSecret
config.auth.passwordSalt
config.r2.accountId
config.server.port
```

Esto elimina dependencias de `c.env` y facilita testing.

### Logging

Winston captura:
- HTTP requests/responses
- Errores de aplicación
- Conexiones de base de datos
- Operaciones R2
- Uncaught exceptions/rejections

---

## 📚 Dependencias Principales

```json
{
  "@hono/node-server": "^1.13.7",
  "@hono/zod-openapi": "^1.1.5",
  "@aws-sdk/client-s3": "^3.948.0",
  "bcryptjs": "^3.0.3",
  "dotenv": "^16.4.7",
  "hono": "^4.10.6",
  "jose": "^6.1.2",
  "mongoose": "^8.9.3",
  "nanoid": "^5.0.9",
  "winston": "^3.17.0",
  "zod": "^4.1.13"
}
```

---

# Ver logs en tiempo real
npx wrangler tail

# Verificar estado del Worker
curl https://basic-hono-api.borisbelmarm.workers.dev/health
```

---

## 🧪 Testing

### Suite de Tests

El proyecto incluye una suite completa de tests con **143 tests** y **88.83% de coverage**:

```bash
# Ejecutar todos los tests
yarn test --run

# Modo watch (desarrollo)
yarn test

# UI interactivo con coverage
yarn test:ui
```

### Estructura de Tests

```
src/
├── controllers/
│   ├── auth/
│   │   ├── login.controller.test.ts       # 6 tests
│   │   └── register.controller.test.ts    # 7 tests
│   ├── todo/
│   │   ├── create.controller.test.ts      # 6 tests
│   │   ├── list.controller.test.ts        # 7 tests
│   │   ├── get.controller.test.ts         # 6 tests
│   │   ├── update.controller.test.ts      # 4 tests
│   │   ├── patch.controller.test.ts       # 7 tests
│   │   └── delete.controller.test.ts      # 3 tests
│   └── image/
│       ├── upload.controller.test.ts      # 5 tests
│       ├── get.controller.test.ts         # 3 tests
│       └── delete.controller.test.ts      # 3 tests
├── middleware/
│   └── auth.middleware.test.ts            # 7 tests
├── schemas/
│   ├── auth.schema.test.ts                # 12 tests
│   ├── todo.schema.test.ts                # 22 tests
│   ├── image.schema.test.ts               # 10 tests
│   └── common.schema.test.ts              # 6 tests
├── utils/
│   ├── crypto.test.ts                     # 13 tests
│   └── jwt.test.ts                        # 16 tests
└── test/
    ├── mocks/
    │   ├── d1.mock.ts                     # Mock D1Database
    │   └── r2.mock.ts                     # Mock R2Bucket
    └── helpers/
        └── context.helper.ts              # Helper para Hono context
```

### Coverage por Módulo

| Módulo | Statements | Branches | Functions | Lines |
|--------|-----------|----------|-----------|-------|
| **Controllers** | 88.31% | 81.70% | 100% | 88.31% |
| **Middleware** | 100% | 100% | 100% | 100% |
| **Schemas** | 100% | 100% | 100% | 100% |
| **Utils** | 81.69% | 70.58% | 90% | 81.69% |
| **Total** | **88.83%** | **81.61%** | **96.42%** | **88.83%** |

### Infraestructura de Testing

**Mocks de Cloudflare:**
- `D1Database`: Mock completo con soporte para CRUD, queries complejas y PATCH parcial
- `R2Bucket`: Mock de almacenamiento con put, get, delete, head, list

**Context Helper:**
- `createMockContext()`: Simula el contexto de Hono con bindings, variables, headers
- `parseJsonResponse()`: Helper para parsear respuestas JSON
- Soporte automático para extracción de parámetros de rutas

**Características:**
- ✅ Tests unitarios para todos los controllers
- ✅ Tests de integración para auth middleware
- ✅ Validación de schemas con Zod
- ✅ Tests de utils (crypto, JWT)
- ✅ Mocks realistas de Cloudflare Workers
- ✅ UI interactivo con Vitest
- ✅ Coverage con v8 provider

### CI/CD con Tests

Los tests se ejecutan automáticamente en cada push a `main` mediante GitHub Actions:

```yaml
- Run linter
- Run tests ← Valida que todos los 143 tests pasen
- Deploy (solo si tests pasan)
```

---

## 🧪 Ejemplos de Uso

### Con Bruno API Client

El proyecto incluye una colección completa de Bruno con todos los endpoints documentados:

1. **Abrir colección:** Abre Bruno → "Open Collection" → Selecciona la carpeta `bruno/`
2. **Seleccionar entorno:** Elige "Local" o "Production"
3. **Autenticación automática:** 
   - Ejecuta "Register" o "Login"
   - El token se guarda automáticamente en la variable secreta `authToken`
   - Todos los requests siguientes usan el token automáticamente
4. **Probar endpoints:** 
   - Carpeta "Auth" - Registro y login
   - Carpeta "Todos" - CRUD de todos
   - Carpeta "Images" - Upload, obtener y eliminar imágenes

**🔐 Nota:** El token se maneja como secret y no se commitea al repositorio.

### Con cURL (Flujo Completo)

```bash
# 1. Registrar usuario
curl -X POST http://localhost:8787/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Respuesta incluye token JWT

# 2. Subir una imagen
curl -X POST http://localhost:8787/images \
  -H "Authorization: Bearer eyJhbGc..." \
  -F "image=@/ruta/a/tu/imagen.jpg"

# Respuesta incluye URL de la imagen

# 3. Crear un todo con imagen
curl -X POST http://localhost:8787/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "title": "Mi primer todo",
    "completed": false,
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "photoUri": "/images/abc123/xyz789.jpg"
  }'

# 4. Listar todos
curl http://localhost:8787/todos \
  -H "Authorization: Bearer eyJhbGc..."

# 5. Actualizar todo (cambia la imagen - la anterior se elimina automáticamente)
curl -X PATCH http://localhost:8787/todos/{id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{"photoUri": "/images/abc123/nueva-imagen.jpg"}'

# 6. Eliminar todo (la imagen se elimina automáticamente de R2)
curl -X DELETE http://localhost:8787/todos/{id} \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## 🏗️ Arquitectura

### Patrón MVC con OpenAPI

El proyecto sigue una arquitectura modular y escalable:

**1. Controladores (Controllers):**
- Contienen la lógica de negocio
- Separados por dominio (auth, todo, image)
- Independientes de la capa de presentación

**2. Definiciones OpenAPI:**
- Schemas Zod reutilizables en `src/openapi/schemas/`
- Rutas OpenAPI con `createRoute()` en `src/openapi/routes/`
- Documentación centralizada y mantenible

**3. Routers (Routes):**
- Organizados por dominio en subdirectorios (`auth/`, `todo/`, `image/`)
- Cada endpoint en su propio archivo (ej: `login.route.ts`, `create.route.ts`)
- Archivo `index.ts` en cada dominio que registra todos los endpoints
- Ultra modular: fácil de encontrar y modificar endpoints específicos

**4. Middleware:**
- Autenticación JWT centralizada
- Aplicado a nivel de router completo

**5. Utilidades:**
- Funciones reutilizables (JWT, crypto, R2)
- Separación de responsabilidades

### Beneficios de esta arquitectura:

✅ **Mantenibilidad:** Código organizado y fácil de encontrar
✅ **Escalabilidad:** Agregar nuevos endpoints es simple
✅ **Reutilización:** Schemas compartidos entre rutas
✅ **Documentación:** OpenAPI auto-generado desde código
✅ **Testing:** Controladores testeables independientemente
✅ **Legibilidad:** Archivos pequeños y enfocados

---

## 📁 Estructura del Proyecto Detallada

```
basic-hono-api/
├── src/
│   ├── controllers/              # Lógica de negocio (MVC)
│   ├── openapi/                  # Definiciones OpenAPI separadas
│   │   ├── schemas/              # Schemas Zod reutilizables
│   │   └── routes/               # createRoute() por dominio
│   ├── routes/                   # Routers Hono (conectan OpenAPI + Controllers)
│   ├── middleware/               # Middlewares (auth JWT)
│   ├── schemas/                  # Schemas de validación runtime
│   ├── types/                    # Tipos TypeScript
│   ├── utils/                    # Utilidades (JWT, crypto, R2)
│   └── index.ts                  # Entry point + OpenAPI global config
├── migrations/                   # SQL migrations para D1
├── bruno/                        # Colección de requests con Bruno
│   ├── Auth/                     # Requests de autenticación
│   ├── Todos/                    # Requests CRUD de todos
│   ├── Images/                   # Requests de imágenes
│   └── environments/             # Entornos (Local, Production)
├── .github/workflows/            # CI/CD con GitHub Actions
├── wrangler.toml                 # Config Cloudflare Workers + D1 + R2
├── .dev.vars                     # Variables de entorno local
└── package.json
```

---

## 🔒 Seguridad

### Mejores Prácticas Implementadas

- ✅ **Passwords hasheados** con bcryptjs (10 rounds + salt personalizado)
- ✅ **JWT con expiración** de 7 días
- ✅ **Validación estricta** con Zod en todas las entradas
- ✅ **Configuración centralizada** sin exposición de secrets en código
- ✅ **Aislamiento de datos** por usuario con Mongoose
- ✅ **Control de permisos** en operaciones de recursos
- ✅ **Validación de archivos** (tipo y tamaño de imágenes)
- ✅ **Logging completo** con Winston para auditoría
- ✅ **Error handling global** sin exposición de stack traces en producción

### Recomendaciones

- 🔄 Rotar `JWT_SECRET` periódicamente
- 🚫 **Nunca** cambiar `PASSWORD_SALT` después del primer deploy (invalidaría passwords existentes)
- 📊 Monitorear logs en producción para detectar anomalías
- 🔐 Usar passwords fuertes (mínimo 6 caracteres por validación)
- 🌐 Considerar signed URLs para R2 si necesitas control de acceso temporal
- 🛡️ Implementar rate limiting adicional si es necesario

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

---

## 📝 License

MIT

---

## 👤 Autor

Boris Belmar - [borisbelmarm@gmail.com](mailto:borisbelmarm@gmail.com)


---

## 🔗 Links Útiles

- [Hono Documentation](https://hono.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Docker Documentation](https://docs.docker.com)
- [Vitest](https://vitest.dev)
- [Winston Logger](https://github.com/winstonjs/winston)
