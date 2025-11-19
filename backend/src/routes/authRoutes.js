import { Router } from 'express'
import { body } from 'express-validator'
import { register, login, currentProfile, logout, updateProfile } from '../controllers/authController.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = Router()

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Nombre requerido'),
    body('email').isEmail().withMessage('Correo inválido'),
    body('password').isLength({ min: 8 }).withMessage('Contraseña mínima de 8 caracteres'),
    body('role').optional().isIn(['user', 'employer']).withMessage('Rol inválido'),
    body('company').optional().isObject().withMessage('Datos de empresa inválidos'),
    body('company.name')
      .if(body('role').equals('employer'))
      .isLength({ min: 2 })
      .withMessage('Nombre de empresa requerido'),
    body('company.description').optional().isLength({ max: 1500 }).withMessage('Descripción muy larga'),
    body('company.location').optional().isLength({ max: 200 }).withMessage('Ubicación inválida'),
    body('company.industry').optional().isLength({ max: 120 }).withMessage('Industria inválida'),
    body('company.logoUrl').optional({ checkFalsy: true }).isURL().withMessage('Logo debe ser una URL válida')
  ],
  validateRequest,
  register
)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Correo inválido'),
    body('password').notEmpty().withMessage('Contraseña requerida')
  ],
  validateRequest,
  login
)

router.get('/profile', requireAuth, currentProfile)
router.patch(
  '/profile',
  requireAuth,
  [
    body('name').optional().isLength({ min: 2 }).withMessage('Nombre demasiado corto'),
    body('email').optional().isEmail().withMessage('Correo inválido'),
    body('bio').optional().isLength({ max: 400 }).withMessage('Bio demasiado larga'),
    body('photoUrl').optional({ checkFalsy: true }).isURL().withMessage('Foto debe ser una URL válida'),
    body('resumeUrl').optional({ checkFalsy: true }).isURL().withMessage('CV debe ser una URL válida'),
    body('skills').optional().isArray({ max: 25 }).withMessage('Skills debe ser un arreglo de máximo 25 elementos'),
    body('skills.*').optional().isString().withMessage('Cada skill debe ser texto'),
    body('company').optional().isObject().withMessage('Datos de empresa inválidos'),
    body('company.name').optional().isLength({ min: 2 }).withMessage('Nombre de empresa muy corto'),
    body('company.description').optional().isLength({ max: 1500 }).withMessage('Descripción muy larga'),
    body('company.location').optional().isLength({ max: 200 }).withMessage('Ubicación inválida'),
    body('company.industry').optional().isLength({ max: 120 }).withMessage('Industria inválida'),
    body('company.logoUrl').optional({ checkFalsy: true }).isURL().withMessage('Logo debe ser una URL válida')
  ],
  validateRequest,
  updateProfile
)
router.post('/logout', requireAuth, logout)

export default router
