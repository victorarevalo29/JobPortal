import mongoose from 'mongoose'

const { Schema, model } = mongoose

// Learning material curated for career growth.
const resourceSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 160
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80
  },
  content: {
    type: String,
    required: true,
    minlength: 20
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

resourceSchema.index({ category: 1, publishedAt: -1 })

export const Resource = model('Resource', resourceSchema)
