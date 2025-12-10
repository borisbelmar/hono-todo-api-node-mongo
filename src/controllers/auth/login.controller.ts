import { Context } from 'hono'
import type { User } from '../../types/user.types'
import type { LoginInput } from '../../schemas/auth.schema'
import { verifyPassword } from '../../utils/crypto'
import { generateToken } from '../../utils/jwt'
import { UserModel } from '../../models/user.model'
import { logger } from '../../lib/logger'
import { MongooseError } from 'mongoose'
import { config } from '../../config'

export const loginController = async (c: Context) => {
  try {
    const body = await c.req.json() as LoginInput

    // Buscar usuario
    const userDoc = await UserModel.findOne({ email: body.email.toLowerCase() })

    if (!userDoc) {
      return c.json({
        success: false,
        error: 'Invalid credentials',
      }, 401)
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(
      body.password,
      userDoc.passwordHash,
      config.auth.passwordSalt,
    )

    if (!isValidPassword) {
      return c.json({
        success: false,
        error: 'Invalid credentials',
      }, 401)
    }

    const user: User = {
      id: userDoc.id,
      email: userDoc.email,
      createdAt: userDoc.createdAt.toISOString(),
      updatedAt: userDoc.updatedAt.toISOString(),
    }

    // Generar token
    const token = await generateToken(user.id, user.email, config.auth.jwtSecret)

    return c.json({
      success: true,
      data: {
        user,
        token,
      },
    })
  } catch (error) {
    if (error instanceof MongooseError) {
      logger.error('Mongoose error during login:', error)
    } else {
      logger.error('Unexpected error during login:', error)
    }
    return c.json({
      success: false,
      error: 'Login failed',
    }, 500)
  }
}
