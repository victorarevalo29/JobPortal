import { validationResult } from 'express-validator'
import { AppError } from '../utils/AppError.js'

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const formatted = errors.array().map(({ msg, param }) => ({ field: param, message: msg }))
    return next(new AppError('Datos inválidos', 422, formatted))
  }

  next()
}
