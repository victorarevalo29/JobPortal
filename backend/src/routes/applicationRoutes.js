import { Router } from 'express'
import { body, param, query } from 'express-validator'
import {
  createApplicationController,
  deleteApplicationController,
  getApplicationController,
  listApplicationsController,
  updateApplicationController
} from '../controllers/applicationController.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import { validateRequest } from '../middleware/validateRequest.js'

const router = Router()

router.use(requireAuth)

router.post(
  '/',
  [
    body('candidate').optional().isMongoId().withMessage('Usuario inválido'),
    body('job').isMongoId().withMessage('Vacante inválida'),
    body('message').optional().isLength({ max: 1500 })
  ],
  validateRequest,
  createApplicationController
)

router.get(
  '/',
  [query('candidate').optional().isMongoId(), query('job').optional().isMongoId()],
  validateRequest,
  listApplicationsController
)

router.get('/:id', [param('id').isMongoId().withMessage('ID inválido')], validateRequest, getApplicationController)

router.patch(
  '/:id',
  [
    param('id').isMongoId().withMessage('ID inválido'),
    body('status').optional().isIn(['submitted', 'in-review', 'interview', 'offer', 'rejected']),
    body('message').optional().isLength({ max: 1500 })
  ],
  validateRequest,
  updateApplicationController
)

router.delete('/:id', [param('id').isMongoId().withMessage('ID inválido')], validateRequest, deleteApplicationController)

export default router
