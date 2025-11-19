import mongoose from 'mongoose'

const { Schema, model, Types } = mongoose

// Tracks submissions between users and job offers.
const applicationSchema = new Schema({
  candidate: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: Types.ObjectId,
    ref: 'Job',
    required: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['submitted', 'in-review', 'interview', 'offer', 'rejected'],
    default: 'submitted'
  },
  message: {
    type: String,
    trim: true,
    maxlength: 1500
  }
}, {
  timestamps: true
})

applicationSchema.index({ candidate: 1, job: 1 }, { unique: true })
applicationSchema.index({ status: 1 })

export const Application = model('Application', applicationSchema)
