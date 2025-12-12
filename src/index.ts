import { serve } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import authRouter from './routes/auth'
import todoRouter from './routes/todo'
import imageRouter from './routes/image'
import { getPackageJson } from './utils/packageJson'
import { connectToDatabase } from './db/connection'
import { loggerMiddleware } from './middleware/logger.middleware'
import { errorHandler } from './middleware/error.middleware'
import { logger } from './lib/logger'
import { config } from './config'

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: result.error.issues,
        },
        400,
      )
    }
  },
})

// Global error handler
app.onError(errorHandler)

// Logger middleware
app.use('/*', loggerMiddleware)

// CORS middleware manual
app.use('/*', async (c, next) => {
  // Handle preflight
  if (c.req.method === 'OPTIONS') {
    c.header('Access-Control-Allow-Origin', '*')
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    c.header('Access-Control-Max-Age', '600')
    return c.text('', 204)
  }

  await next()

  // Add CORS headers to all responses
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
})

// Healthcheck público
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

// Ruta raíz
app.get('/', (c) => {
  return c.json({
    message: 'Bienvenido a la API con Hono',
    documentation: '/docs',
    openapi: '/openapi.json',
    endpoints: {
      health: '/health',
      auth: {
        register: '/auth/register',
        login: '/auth/login',
      },
      todos: '/todos (requiere autenticación)',
      images: '/images (requiere autenticación)',
    },
  })
})

// Router de autenticación (público)
app.route('/auth', authRouter)

// Router de todos (requiere autenticación)
app.route('/todos', todoRouter)

// Router de imágenes (requiere autenticación)
app.route('/images', imageRouter)

// Endpoint personalizado para OpenAPI JSON con security schemes
app.get('/openapi.json', (c) => {
  // Obtener el spec base generado por OpenAPIHono
  const spec = app.getOpenAPIDocument({
    openapi: '3.0.0',
    info: {
      version: getPackageJson().version,
      title: 'Todo List API',
      description: 'API REST completa con autenticación JWT, gestión de todos con MongoDB e imágenes con Cloudflare R2',
    },
    servers: [
      {
        url: 'http://localhost:8787',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://todo-list.dobleb.cl',
        description: 'Servidor de producción',
      },
    ],
    tags: [
      { name: 'Health', description: 'Health check endpoints' },
      { name: 'Auth', description: 'Autenticación y gestión de usuarios' },
      { name: 'Todos', description: 'CRUD de tareas' },
      { name: 'Images', description: 'Gestión de imágenes con R2' },
    ],
  })

  // Agregar security schemes globalmente
  spec.components = spec.components || {}
  spec.components.securitySchemes = {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Token JWT obtenido del endpoint /auth/login',
    },
  }

  return c.json(spec)
})

// Swagger UI
app.get('/docs', swaggerUI({ url: '/openapi.json' }))

// Conectar a MongoDB y arrancar el servidor
const startServer = async () => {
  try {
    await connectToDatabase()

    serve({
      fetch: app.fetch,
      port: config.port,
    })

    logger.info(`🚀 Server running on http://localhost:${config.port}`)
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app
