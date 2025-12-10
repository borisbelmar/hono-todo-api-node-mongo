import type { Context, Next } from 'hono'
import { logger } from '../lib/logger'

export const loggerMiddleware = async (c: Context, next: Next) => {
  const start = Date.now()
  const { method, url } = c.req

  logger.info(`→ ${method} ${url}`)

  try {
    await next()

    const duration = Date.now() - start
    const status = c.res.status

    const logLevel = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'

    logger[logLevel](`← ${method} ${url} ${status} - ${duration}ms`)
  } catch (error) {
    const duration = Date.now() - start

    logger.error('❌ Request error:', {
      method,
      url,
      duration: `${duration}ms`,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    })

    // Re-lanzar el error para que Hono lo maneje
    throw error
  }
}
