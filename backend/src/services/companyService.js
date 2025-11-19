import { Company } from '../models/Company.js'
import { AppError } from '../utils/AppError.js'

export const createCompany = (payload) => Company.create(payload)

export const listCompanies = async (filters = {}) => {
  const query = {}
  if (filters.industry) {
    query.industry = filters.industry
  }
  return Company.find(query).sort('name')
}

export const getCompanyById = async (id) => {
  const company = await Company.findById(id)
  if (!company) {
    throw new AppError('Empresa no encontrada', 404)
  }
  return company
}

export const updateCompanyById = async (id, payload) => {
  const updated = await Company.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
  if (!updated) {
    throw new AppError('Empresa no encontrada', 404)
  }
  return updated
}

export const deleteCompanyById = async (id) => {
  const deleted = await Company.findByIdAndDelete(id)
  if (!deleted) {
    throw new AppError('Empresa no encontrada', 404)
  }
  return deleted
}
