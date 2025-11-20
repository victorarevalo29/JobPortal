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
  format: {
    type: String,
    enum: ['Artículo', 'Video', 'Playbook', 'Taller', 'Plantilla'],
    default: 'Artículo'
  },
  mediaType: {
    type: String,
    enum: ['article', 'video', 'playbook', 'template', 'workshop'],
    default: 'article'
  },
  mediaUrl: {
    type: String,
    trim: true,
    maxlength: 400
  },
  duration: {
    type: String,
    trim: true,
    maxlength: 40
  },
  author: {
    type: String,
    trim: true,
    maxlength: 120,
    default: 'Equipo JobPortal'
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: (value) => Array.isArray(value) && value.length <= 8,
      message: 'Máximo 8 tags por recurso'
    }
  },
  summary: {
    type: String,
    trim: true,
    maxlength: 320
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
