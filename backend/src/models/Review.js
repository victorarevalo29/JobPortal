import mongoose from 'mongoose'

const { Schema, model, Types } = mongoose

// Company feedback authored by verified users.
const reviewSchema = new Schema({
  author: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: Types.ObjectId,
    ref: 'Company',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

reviewSchema.index({ company: 1, publishedAt: -1 })
reviewSchema.index({ author: 1, company: 1 }, { unique: true })

export const Review = model('Review', reviewSchema)
