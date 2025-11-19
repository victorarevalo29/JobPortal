import { Job } from '../models/Job.js'
import { AppError } from '../utils/AppError.js'

export const createJob = (payload) => {
  if (!payload.company) {
    throw new AppError('Empresa obligatoria para publicar', 400)
  }
  return Job.create(payload)
}

export const listJobs = async (filters = {}) => {
  const query = {}
  if (filters.status) query.status = filters.status
  if (filters.company) query.company = filters.company
  return Job.find(query).populate('company', 'name logoUrl location').sort('-createdAt')
}

export const getJobById = async (id) => {
  const job = await Job.findById(id).populate('company', 'name logoUrl location industry')
  if (!job) {
    throw new AppError('Empleo no encontrado', 404)
  }
  return job
}

export const updateJobById = async (id, payload, companyId) => {
  const query = companyId ? { _id: id, company: companyId } : { _id: id }
  const job = await Job.findOneAndUpdate(query, payload, { new: true, runValidators: true })
  if (!job) {
    throw new AppError('Empleo no encontrado', 404)
  }
  return job
}

export const deleteJobById = async (id, companyId) => {
  const query = companyId ? { _id: id, company: companyId } : { _id: id }
  const job = await Job.findOneAndDelete(query)
  if (!job) {
    throw new AppError('Empleo no encontrado', 404)
  }
  return job
}
