import type { Context } from 'hono'
import { logger } from '../lib/logger'

export const errorHandler = (err: Error, c: Context) => {
  logger.error('❌ Error Handler:', {
    message: err.message,
    stack: err.stack,
    name: err.name,
    path: c.req.path,
    method: c.req.method,
  })

  // Determinar el código de estado según el tipo de error
  const status = err.name === 'ValidationError' ? 400 : 500

  return c.json(
    {
      success: false,
      error: process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
    status,
  )
}
