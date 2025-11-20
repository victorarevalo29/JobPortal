import { TokenBlacklist } from '../models/TokenBlacklist.js'

export const blacklistToken = async ({ jti, expiresAt }) => {
  if (!jti || !expiresAt) return
  await TokenBlacklist.updateOne({ jti }, { jti, expiresAt }, { upsert: true })
}

export const isTokenBlacklisted = async (jti) => {
  if (!jti) return false
  const exists = await TokenBlacklist.exists({ jti })
  return Boolean(exists)
}
