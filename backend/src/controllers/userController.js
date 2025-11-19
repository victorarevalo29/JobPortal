import { asyncHandler } from '../utils/asyncHandler.js'
import { sendCreated, sendSuccess } from '../utils/response.js'
import { createUser, deleteUserById, getUserById, listUsers, updateUserById } from '../services/userService.js'

/**
 * @route POST /api/users
 * @description Crea un usuario desde el panel de administración.
 */
export const createUserController = asyncHandler(async (req, res) => {
  const user = await createUser(req.body)
  return sendCreated(res, { message: 'Usuario creado', data: user })
})

/**
 * @route GET /api/users
 * @description Lista de usuarios registrados.
 */
export const listUsersController = asyncHandler(async (req, res) => {
  const users = await listUsers()
  return sendSuccess(res, { data: users })
})

/**
 * @route GET /api/users/:id
 * @description Recupera un usuario por su identificador.
 */
export const getUserController = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id)
  return sendSuccess(res, { data: user })
})

/**
 * @route PATCH /api/users/:id
 * @description Actualiza campos específicos de un usuario.
 */
export const updateUserController = asyncHandler(async (req, res) => {
  const user = await updateUserById(req.params.id, req.body)
  return sendSuccess(res, { message: 'Usuario actualizado', data: user })
})

/**
 * @route DELETE /api/users/:id
 * @description Elimina un usuario y sus datos asociados.
 */
export const deleteUserController = asyncHandler(async (req, res) => {
  await deleteUserById(req.params.id)
  return sendSuccess(res, { message: 'Usuario eliminado' })
})
