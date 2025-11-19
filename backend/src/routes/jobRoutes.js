import { Router } from 'express'
import { body, param, query } from 'express-validator'
import {
  createJobController,
  deleteJobController,
  getJobController,
  listJobsController,
  updateJobController
} from '../controllers/jobController.js'
import { requireAuth, requireRole } from '../middleware/authMiddleware.js'
import { validateRequest } from '../middleware/validateRequest.js'

const router = Router()

const createValidators = [
  body('title').isLength({ min: 4 }).withMessage('Título muy corto'),
  body('contractType').isIn(['full-time', 'part-time', 'contract', 'internship', 'temporary']),
  body('description').isLength({ min: 40 }).withMessage('Descripción muy corta'),
  body('status').optional().isIn(['draft', 'active', 'paused', 'closed']),
  body('salaryRange.min').optional().isNumeric(),
  body('salaryRange.max').optional().isNumeric()
]

const updateValidators = [
  param('id').isMongoId().withMessage('ID inválido'),
  body('company').optional().isMongoId(),
  body('title').optional().isLength({ min: 4 }),
  body('contractType').optional().isIn(['full-time', 'part-time', 'contract', 'internship', 'temporary']),
  body('description').optional().isLength({ min: 40 }),
  body('status').optional().isIn(['draft', 'active', 'paused', 'closed']),
  body('salaryRange.min').optional().isNumeric(),
  body('salaryRange.max').optional().isNumeric()
]

router.get(
  '/',
  [
    query('status').optional().isIn(['draft', 'active', 'paused', 'closed']),
    query('company').optional().isMongoId()
  ],
  validateRequest,
  listJobsController
)

router.get('/:id', [param('id').isMongoId().withMessage('ID inválido')], validateRequest, getJobController)

router.post('/', requireAuth, requireRole('employer'), createValidators, validateRequest, createJobController)

router.patch(
  '/:id',
  requireAuth,
  requireRole('employer'),
  updateValidators,
  validateRequest,
  updateJobController
)

router.delete(
  '/:id',
  requireAuth,
  requireRole('employer'),
  [param('id').isMongoId().withMessage('ID inválido')],
  validateRequest,
  deleteJobController
)

export default router
