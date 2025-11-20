import { asyncHandler } from '../utils/asyncHandler.js'
import { sendCreated, sendSuccess } from '../utils/response.js'
import { createReview, deleteReviewById, getReviewById, listReviews, updateReviewById } from '../services/reviewService.js'

/**
 * @route POST /api/reviews
 * @description Un usuario califica una empresa.
 */
export const createReviewController = asyncHandler(async (req, res) => {
  const review = await createReview(req.body)
  return sendCreated(res, { message: 'Valoración creada', data: review })
})

/**
 * @route GET /api/reviews
 * @description Lista reseñas filtradas por empresa o autor.
 */
export const listReviewsController = asyncHandler(async (req, res) => {
  const reviews = await listReviews(req.query)
  return sendSuccess(res, { data: reviews })
})

/**
 * @route GET /api/reviews/:id
 * @description Recupera una reseña específica.
 */
export const getReviewController = asyncHandler(async (req, res) => {
  const review = await getReviewById(req.params.id)
  return sendSuccess(res, { data: review })
})

/**
 * @route PATCH /api/reviews/:id
 * @description Actualiza el comentario o puntaje.
 */
export const updateReviewController = asyncHandler(async (req, res) => {
  const review = await updateReviewById(req.params.id, req.body)
  return sendSuccess(res, { message: 'Valoración actualizada', data: review })
})

/**
 * @route DELETE /api/reviews/:id
 * @description Elimina una reseña.
 */
export const deleteReviewController = asyncHandler(async (req, res) => {
  await deleteReviewById(req.params.id)
  return sendSuccess(res, { message: 'Valoración eliminada' })
})
