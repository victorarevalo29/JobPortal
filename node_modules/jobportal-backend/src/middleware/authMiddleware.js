import { verifyToken } from '../utils/token.js'
import { AppError } from '../utils/AppError.js'
import { isTokenBlacklisted } from '../services/tokenService.js'

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('Autenticación requerida', 401))
  }

  const token = header.split(' ')[1]
  const payload = verifyToken(token)

  const blacklisted = await isTokenBlacklisted(payload.jti)
  if (blacklisted) {
    return next(new AppError('Tu sesión expiró, vuelve a iniciar sesión', 401))
  }

  req.authToken = token
  req.user = payload
  next()
}

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Autenticación requerida', 401))
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError('No tienes permisos para esta acción', 403))
  }

  next()
}
