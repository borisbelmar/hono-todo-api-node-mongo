import winston from 'winston'

const logLevel = process.env.LOG_LEVEL || 'info'

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`

    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta, null, 2)}`
    }

    return msg
  }),
)

export const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
  exitOnError: false,
})

// Manejo global de errores no capturados
process.on('uncaughtException', (error: Error) => {
  logger.error('❌ Uncaught Exception:', {
    message: error.message,
    stack: error.stack,
    name: error.name,
  })
  // Dar tiempo al logger para escribir antes de salir
  setTimeout(() => {
    process.exit(1)
  }, 1000)
})

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  logger.error('❌ Unhandled Rejection:', {
    reason: reason instanceof Error ? {
      message: reason.message,
      stack: reason.stack,
      name: reason.name,
    } : reason,
    promise: promise.toString(),
  })
})

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  logger.info('⚠️  SIGTERM signal received: closing HTTP server')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('⚠️  SIGINT signal received: closing HTTP server')
  process.exit(0)
})

export default logger
