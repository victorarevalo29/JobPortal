import mongoose from 'mongoose'

const { Schema, model, Types } = mongoose

// Job offers linked to a company with searchable text fields.
const jobSchema = new Schema({
  company: {
    type: Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 140
  },
  location: {
    type: String,
    trim: true,
    maxlength: 200
  },
  salaryRange: {
    min: { type: Number, min: 0 },
    max: { type: Number, min: 0 },
    currency: { type: String, default: 'USD', uppercase: true, maxlength: 4 }
  },
  contractType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
    required: true
  },
  description: {
    type: String,
    required: true,
    minlength: 40,
    maxlength: 5000
  },
  requiredExperience: {
    type: String,
    trim: true,
    maxlength: 300
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed'],
    default: 'draft'
  }
}, {
  timestamps: true
})

jobSchema.index({ title: 'text', description: 'text' })
jobSchema.index({ company: 1, status: 1 })
jobSchema.index({ contractType: 1 })

export const Job = model('Job', jobSchema)
