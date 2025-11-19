import { Review } from '../models/Review.js'
import { AppError } from '../utils/AppError.js'

export const createReview = async (payload) => {
  try {
    return await Review.create(payload)
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Ya existe una reseña para esta empresa', 409)
    }
    throw error
  }
}

export const listReviews = async (filters = {}) => {
  const query = {}
  if (filters.company) query.company = filters.company
  if (filters.author) query.author = filters.author
  return Review.find(query)
    .populate('author', 'name role')
    .populate('company', 'name')
    .sort('-createdAt')
}

export const getReviewById = async (id) => {
  const review = await Review.findById(id)
    .populate('author', 'name')
    .populate('company', 'name')
  if (!review) {
    throw new AppError('Valoración no encontrada', 404)
  }
  return review
}

export const updateReviewById = async (id, payload) => {
  const updated = await Review.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
  if (!updated) {
    throw new AppError('Valoración no encontrada', 404)
  }
  return updated
}

export const deleteReviewById = async (id) => {
  const deleted = await Review.findByIdAndDelete(id)
  if (!deleted) {
    throw new AppError('Valoración no encontrada', 404)
  }
  return deleted
}
