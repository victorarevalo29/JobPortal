import { asyncHandler } from '../utils/asyncHandler.js'
import { sendCreated, sendSuccess } from '../utils/response.js'
import { createCompany, deleteCompanyById, getCompanyById, listCompanies, updateCompanyById } from '../services/companyService.js'

/**
 * @route POST /api/companies
 * @description Registra una nueva empresa.
 */
export const createCompanyController = asyncHandler(async (req, res) => {
  const company = await createCompany(req.body)
  return sendCreated(res, { message: 'Empresa creada', data: company })
})

/**
 * @route GET /api/companies
 * @description Lista empresas filtrables por industria.
 */
export const listCompaniesController = asyncHandler(async (req, res) => {
  const companies = await listCompanies(req.query)
  return sendSuccess(res, { data: companies })
})

/**
 * @route GET /api/companies/:id
 * @description Consulta detalles de una empresa.
 */
export const getCompanyController = asyncHandler(async (req, res) => {
  const company = await getCompanyById(req.params.id)
  return sendSuccess(res, { data: company })
})

/**
 * @route PATCH /api/companies/:id
 * @description Actualiza información de la empresa.
 */
export const updateCompanyController = asyncHandler(async (req, res) => {
  const company = await updateCompanyById(req.params.id, req.body)
  return sendSuccess(res, { message: 'Empresa actualizada', data: company })
})

/**
 * @route DELETE /api/companies/:id
 * @description Elimina una empresa.
 */
export const deleteCompanyController = asyncHandler(async (req, res) => {
  await deleteCompanyById(req.params.id)
  return sendSuccess(res, { message: 'Empresa eliminada' })
})
