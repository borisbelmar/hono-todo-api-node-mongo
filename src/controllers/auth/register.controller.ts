import { Context } from 'hono'
import { nanoid } from 'nanoid'
import type { User } from '../../types/user.types'
import type { RegisterInput } from '../../schemas/auth.schema'
import { hashPassword } from '../../utils/crypto'
import { generateToken } from '../../utils/jwt'
import { UserModel } from '../../models/user.model'
import { config } from '../../config'

export const registerController = async (c: Context) => {
  try {
    const body = await c.req.json() as RegisterInput

    // Verificar si el email ya existe
    const existingUser = await UserModel.findOne({ email: body.email.toLowerCase() })

    if (existingUser) {
      return c.json({
        success: false,
        error: 'Email already registered',
      }, 409)
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword(body.password, config.auth.passwordSalt)

    // Crear usuario
    const id = nanoid()

    console.log('Creating user with ID:', id)

    const newUser = await UserModel.create({
      id,
      email: body.email.toLowerCase(),
      passwordHash,
    })

    const user: User = {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    }

    // Generar token
    const token = await generateToken(id, user.email, config.auth.jwtSecret)

    return c.json({
      success: true,
      data: {
        user,
        token,
      },
    }, 201)
  } catch {
    return c.json({
      success: false,
      error: 'Registration failed',
    }, 500)
  }
}
