import { asyncHandler } from '../utils/asyncHandler.js'
import { sendCreated, sendSuccess } from '../utils/response.js'
import { createJob, deleteJobById, getJobById, listJobs, updateJobById } from '../services/jobService.js'
import { getUserById } from '../services/userService.js'
import { AppError } from '../utils/AppError.js'

const resolveEmployerCompany = async (userId) => {
  const user = await getUserById(userId)
  const companyId = user?.company?.id || user?.company?._id?.toString()
  if (!companyId) {
    throw new AppError('Registra tu empresa antes de publicar vacantes', 400)
  }
  return companyId
}

/**
 * @route POST /api/jobs
 * @description Crea una vacante vinculada a una empresa.
 */
export const createJobController = asyncHandler(async (req, res) => {
  const companyId = await resolveEmployerCompany(req.user.id)
  const job = await createJob({ ...req.body, company: companyId })
  return sendCreated(res, { message: 'Empleo creado', data: job })
})

/**
 * @route GET /api/jobs
 * @description Lista empleos con filtros por estado y empresa.
 */
export const listJobsController = asyncHandler(async (req, res) => {
  const jobs = await listJobs(req.query)
  return sendSuccess(res, { data: jobs })
})

/**
 * @route GET /api/jobs/:id
 * @description Obtiene detalles completos de una vacante.
 */
export const getJobController = asyncHandler(async (req, res) => {
  const job = await getJobById(req.params.id)
  return sendSuccess(res, { data: job })
})

/**
 * @route PATCH /api/jobs/:id
 * @description Actualiza una vacante existente.
 */
export const updateJobController = asyncHandler(async (req, res) => {
  const companyId = await resolveEmployerCompany(req.user.id)
  const job = await updateJobById(req.params.id, { ...req.body, company: companyId }, companyId)
  return sendSuccess(res, { message: 'Empleo actualizado', data: job })
})

/**
 * @route DELETE /api/jobs/:id
 * @description Elimina una vacante.
 */
export const deleteJobController = asyncHandler(async (req, res) => {
  const companyId = await resolveEmployerCompany(req.user.id)
  await deleteJobById(req.params.id, companyId)
  return sendSuccess(res, { message: 'Empleo eliminado' })
})
