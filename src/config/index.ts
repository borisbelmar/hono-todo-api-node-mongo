import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

export const config = {
  port: parseInt(process.env.PORT || '8787', 10),
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || '8787'}`,
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',

  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI || '',
  },

  // JWT & Auth
  auth: {
    jwtSecret: process.env.JWT_SECRET || '',
    passwordSalt: process.env.PASSWORD_SALT || '',
  },

  // R2 Storage (opcional)
  r2: {
    accountId: process.env.R2_ACCOUNT_ID || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucketName: process.env.R2_BUCKET_NAME || 'todo-images',
    publicUrl: process.env.R2_PUBLIC_URL || '',
  },
} as const

// Validar configuración requerida
const validateConfig = () => {
  const required = {
    'MONGODB_URI': config.mongodb.uri,
    'JWT_SECRET': config.auth.jwtSecret,
    'PASSWORD_SALT': config.auth.passwordSalt,
  }

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

validateConfig()

export default config
