import { asyncHandler } from '../utils/asyncHandler.js'
import { sendCreated, sendSuccess } from '../utils/response.js'
import { addCommentToPost, createForumPost, deleteForumPostById, getForumPostById, listForumPosts, updateForumPostById } from '../services/forumService.js'

/**
 * @route POST /api/forum
 * @description Publica una nueva discusión en el foro.
 */
export const createForumPostController = asyncHandler(async (req, res) => {
  const post = await createForumPost(req.body)
  return sendCreated(res, { message: 'Publicación creada', data: post })
})

/**
 * @route GET /api/forum
 * @description Lista hilos del foro por categoría.
 */
export const listForumPostsController = asyncHandler(async (req, res) => {
  const posts = await listForumPosts(req.query)
  return sendSuccess(res, { data: posts })
})

/**
 * @route GET /api/forum/:id
 * @description Devuelve un hilo con comentarios.
 */
export const getForumPostController = asyncHandler(async (req, res) => {
  const post = await getForumPostById(req.params.id)
  return sendSuccess(res, { data: post })
})

/**
 * @route PATCH /api/forum/:id
 * @description Edita el contenido o categoría de un hilo.
 */
export const updateForumPostController = asyncHandler(async (req, res) => {
  const post = await updateForumPostById(req.params.id, req.body)
  return sendSuccess(res, { message: 'Publicación actualizada', data: post })
})

/**
 * @route DELETE /api/forum/:id
 * @description Elimina un hilo.
 */
export const deleteForumPostController = asyncHandler(async (req, res) => {
  await deleteForumPostById(req.params.id)
  return sendSuccess(res, { message: 'Publicación eliminada' })
})

/**
 * @route POST /api/forum/:id/comments
 * @description Agrega un comentario a un hilo determinado.
 */
export const addCommentController = asyncHandler(async (req, res) => {
  const post = await addCommentToPost(req.params.id, req.body)
  return sendSuccess(res, { statusCode: 201, message: 'Comentario agregado', data: post })
})
