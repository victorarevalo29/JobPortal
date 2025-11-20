import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  createUserController,
  deleteUserController,
  getUserController,
  listUsersController,
  updateUserController
} from '../controllers/userController.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import { validateRequest } from '../middleware/validateRequest.js'

const router = Router()

router.use(requireAuth)

const idValidator = [param('id').isMongoId().withMessage('ID inválido')]

router.post(
  '/',
  [
    body('name').isLength({ min: 2 }).withMessage('Nombre requerido'),
    body('email').isEmail().withMessage('Correo inválido'),
    body('password').isLength({ min: 8 }).withMessage('Contraseña mínima de 8 caracteres'),
    body('role').optional().isIn(['user', 'employer']).withMessage('Rol inválido'),
    body('skills').optional().isArray().withMessage('Skills debe ser arreglo')
  ],
  validateRequest,
  createUserController
)

router.get('/', listUsersController)

router.get('/:id', idValidator, validateRequest, getUserController)

router.patch(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID inválido'),
    body('email').optional().isEmail().withMessage('Correo inválido'),
    body('password').optional().isLength({ min: 8 }).withMessage('Contraseña mínima de 8 caracteres'),
    body('role').optional().isIn(['user', 'employer']).withMessage('Rol inválido')
  ],
  validateRequest,
  updateUserController
)

router.delete('/:id', idValidator, validateRequest, deleteUserController)

export default router
