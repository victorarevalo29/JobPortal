import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { AppError } from './AppError.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export const signToken = (payload, options = {}) => {
  const jti = randomUUID()
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    jwtid: jti,
    ...options
  })
  const decoded = jwt.decode(token)
  const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : null
  return { token, jti, expiresAt }
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new AppError('Token inválido o expirado', 401)
  }
}
