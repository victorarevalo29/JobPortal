import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import { signToken } from '../utils/token.js'
import { createUser, getUserById } from './userService.js'
import { blacklistToken } from './tokenService.js'
import { createCompany, deleteCompanyById } from './companyService.js'

const sanitizeCompanyPayload = (payload = {}) => {
  const fields = ['name', 'description', 'location', 'industry', 'logoUrl']
  return fields.reduce((acc, field) => {
    if (typeof payload[field] === 'string') {
      const value = payload[field].trim()
      if (value) acc[field] = value
    }
    return acc
  }, {})
}

export const registerUser = async (payload) => {
  const existing = await User.findOne({ email: payload.email })
  if (existing) {
    throw new AppError('El correo ya está registrado', 409)
  }

  const { company: companyInput, ...userPayload } = payload
  let createdCompany = null

  try {
    if (userPayload.role === 'employer') {
      const companyPayload = sanitizeCompanyPayload(companyInput)
      createdCompany = await createCompany(companyPayload)
      userPayload.company = createdCompany._id
    }

    const user = await createUser(userPayload)
    const hydratedUser = await getUserById(user.id)
    const { token, expiresAt, jti } = signToken({ id: hydratedUser.id, role: hydratedUser.role, email: hydratedUser.email })
    return { user: hydratedUser, token, expiresAt, jti }
  } catch (error) {
    if (createdCompany) {
      await deleteCompanyById(createdCompany._id)
    }
    throw error
  }
}

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash')
  if (!user) {
    throw new AppError('Credenciales inválidas', 401)
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) {
    throw new AppError('Credenciales inválidas', 401)
  }

  const hydratedUser = await getUserById(user.id)
  const { token, expiresAt, jti } = signToken({ id: user.id, role: user.role, email: user.email })
  return { user: hydratedUser, token, expiresAt, jti }
}

export const logoutUser = async ({ jti, exp }) => {
  const expiresAt = exp ? new Date(exp * 1000) : new Date()
  await blacklistToken({ jti, expiresAt })
  return true
}
