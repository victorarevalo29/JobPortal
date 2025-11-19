import { Resource } from '../models/Resource.js'
import { AppError } from '../utils/AppError.js'

export const createResource = (payload) => Resource.create(payload)

export const listResources = async (filters = {}) => {
  const query = {}
  if (filters.category) query.category = filters.category
  return Resource.find(query).sort('-publishedAt')
}

export const getResourceById = async (id) => {
  const resource = await Resource.findById(id)
  if (!resource) {
    throw new AppError('Recurso no encontrado', 404)
  }
  return resource
}

export const updateResourceById = async (id, payload) => {
  const updated = await Resource.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
  if (!updated) {
    throw new AppError('Recurso no encontrado', 404)
  }
  return updated
}

export const deleteResourceById = async (id) => {
  const deleted = await Resource.findByIdAndDelete(id)
  if (!deleted) {
    throw new AppError('Recurso no encontrado', 404)
  }
  return deleted
}
