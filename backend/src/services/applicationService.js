import { Application } from '../models/Application.js'
import { AppError } from '../utils/AppError.js'

export const createApplication = async (payload) => {
  try {
    return await Application.create(payload)
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Ya aplicaste a esta vacante', 409)
    }
    throw error
  }
}

export const listApplications = async (filters = {}) => {
  const query = {}
  if (filters.candidate) query.candidate = filters.candidate
  if (filters.job) query.job = filters.job
  return Application.find(query)
    .populate('candidate', 'name email role')
    .populate('job', 'title company')
    .sort('-createdAt')
}

export const getApplicationById = async (id) => {
  const application = await Application.findById(id)
    .populate('candidate', 'name email')
    .populate({ path: 'job', populate: { path: 'company', select: 'name' } })

  if (!application) {
    throw new AppError('Postulación no encontrada', 404)
  }
  return application
}

export const updateApplicationById = async (id, payload) => {
  const application = await Application.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
  if (!application) {
    throw new AppError('Postulación no encontrada', 404)
  }
  return application
}

export const deleteApplicationById = async (id) => {
  const deleted = await Application.findByIdAndDelete(id)
  if (!deleted) {
    throw new AppError('Postulación no encontrada', 404)
  }
  return deleted
}
