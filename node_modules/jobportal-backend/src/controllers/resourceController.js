import { asyncHandler } from '../utils/asyncHandler.js'
import { sendCreated, sendSuccess } from '../utils/response.js'
import { createResource, deleteResourceById, getResourceById, listResources, updateResourceById } from '../services/resourceService.js'

/**
 * @route POST /api/resources
 * @description Publica un recurso educativo.
 */
export const createResourceController = asyncHandler(async (req, res) => {
  const resource = await createResource(req.body)
  return sendCreated(res, { message: 'Recurso creado', data: resource })
})

/**
 * @route GET /api/resources
 * @description Lista recursos por categoría.
 */
export const listResourcesController = asyncHandler(async (req, res) => {
  const resources = await listResources(req.query)
  return sendSuccess(res, { data: resources })
})

/**
 * @route GET /api/resources/:id
 * @description Recupera un recurso individual.
 */
export const getResourceController = asyncHandler(async (req, res) => {
  const resource = await getResourceById(req.params.id)
  return sendSuccess(res, { data: resource })
})

/**
 * @route PATCH /api/resources/:id
 * @description Actualiza contenido de un recurso.
 */
export const updateResourceController = asyncHandler(async (req, res) => {
  const resource = await updateResourceById(req.params.id, req.body)
  return sendSuccess(res, { message: 'Recurso actualizado', data: resource })
})

/**
 * @route DELETE /api/resources/:id
 * @description Elimina un recurso.
 */
export const deleteResourceController = asyncHandler(async (req, res) => {
  await deleteResourceById(req.params.id)
  return sendSuccess(res, { message: 'Recurso eliminado' })
})
