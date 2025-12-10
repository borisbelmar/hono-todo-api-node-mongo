import bcrypt from 'bcryptjs'

export const hashPassword = async (password: string, salt: string): Promise<string> => {
  // Combinar password y salt para generar el hash
  const combined = password + salt
  return await bcrypt.hash(combined, 10)
}

export const verifyPassword = async (password: string, hash: string, salt: string): Promise<boolean> => {
  // Combinar password y salt de la misma manera
  const combined = password + salt
  return await bcrypt.compare(combined, hash)
}
