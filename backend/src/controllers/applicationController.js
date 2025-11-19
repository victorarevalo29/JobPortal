import { asyncHandler } from '../utils/asyncHandler.js'
import { sendCreated, sendSuccess } from '../utils/response.js'
import { createApplication, deleteApplicationById, getApplicationById, listApplications, updateApplicationById } from '../services/applicationService.js'

/**
 * @route POST /api/applications
 * @description Un candidato aplica a una vacante.
 */
export const createApplicationController = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    candidate: req.body.candidate || req.user?.id
  }
  const application = await createApplication(payload)
  return sendCreated(res, { message: 'Postulación enviada', data: application })
})

/**
 * @route GET /api/applications
 * @description Lista postulaciones filtradas por usuario o vacante.
 */
export const listApplicationsController = asyncHandler(async (req, res) => {
  const applications = await listApplications(req.query)
  return sendSuccess(res, { data: applications })
})

/**
 * @route GET /api/applications/:id
 * @description Detalle completo de una postulación.
 */
export const getApplicationController = asyncHandler(async (req, res) => {
  const application = await getApplicationById(req.params.id)
  return sendSuccess(res, { data: application })
})

/**
 * @route PATCH /api/applications/:id
 * @description Actualiza estado o mensaje de la postulación.
 */
export const updateApplicationController = asyncHandler(async (req, res) => {
  const application = await updateApplicationById(req.params.id, req.body)
  return sendSuccess(res, { message: 'Postulación actualizada', data: application })
})

/**
 * @route DELETE /api/applications/:id
 * @description Elimina una postulación.
 */
export const deleteApplicationController = asyncHandler(async (req, res) => {
  await deleteApplicationById(req.params.id)
  return sendSuccess(res, { message: 'Postulación eliminada' })
})
