import mongoose from 'mongoose'

const { Schema, model } = mongoose

const tokenBlacklistSchema = new Schema({
  jti: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
})

tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const TokenBlacklist = model('TokenBlacklist', tokenBlacklistSchema)
