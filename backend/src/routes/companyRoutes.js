import { Router } from 'express'
import { body, param, query } from 'express-validator'
import {
  createCompanyController,
  deleteCompanyController,
  getCompanyController,
  listCompaniesController,
  updateCompanyController
} from '../controllers/companyController.js'
import { requireAuth, requireRole } from '../middleware/authMiddleware.js'
import { validateRequest } from '../middleware/validateRequest.js'

const router = Router()

router.get(
  '/',
  [query('industry').optional().isString().withMessage('Industria inválida')],
  validateRequest,
  listCompaniesController
)

router.get('/:id', [param('id').isMongoId().withMessage('ID inválido')], validateRequest, getCompanyController)

router.post(
  '/',
  requireAuth,
  requireRole('employer'),
  [
    body('name').isLength({ min: 2 }).withMessage('Nombre requerido'),
    body('description').optional().isLength({ max: 1500 }).withMessage('Descripción muy larga'),
    body('industry').optional().isString(),
    body('location').optional().isString()
  ],
  validateRequest,
  createCompanyController
)

router.patch(
  '/:id',
  requireAuth,
  requireRole('employer'),
  [
    param('id').isMongoId().withMessage('ID inválido'),
    body('description').optional().isLength({ max: 1500 }),
    body('industry').optional().isString(),
    body('location').optional().isString(),
    body('avgRating').optional().isFloat({ min: 0, max: 5 })
  ],
  validateRequest,
  updateCompanyController
)

router.delete(
  '/:id',
  requireAuth,
  requireRole('employer'),
  [param('id').isMongoId().withMessage('ID inválido')],
  validateRequest,
  deleteCompanyController
)

export default router
