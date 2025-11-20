import { Router } from 'express'
import { body, param, query } from 'express-validator'
import {
  createResourceController,
  deleteResourceController,
  getResourceController,
  listResourcesController,
  updateResourceController
} from '../controllers/resourceController.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import { validateRequest } from '../middleware/validateRequest.js'

const router = Router()

router.get(
  '/',
  [query('category').optional().isString()],
  validateRequest,
  listResourcesController
)

router.get('/:id', [param('id').isMongoId().withMessage('ID inválido')], validateRequest, getResourceController)

router.post(
  '/',
  requireAuth,
  [
    body('title').isLength({ min: 4 }).withMessage('Título muy corto'),
    body('category').isLength({ min: 3 }),
    body('content').isLength({ min: 20 })
  ],
  validateRequest,
  createResourceController
)

router.patch(
  '/:id',
  requireAuth,
  [
    param('id').isMongoId().withMessage('ID inválido'),
    body('title').optional().isLength({ min: 4 }),
    body('category').optional().isLength({ min: 3 }),
    body('content').optional().isLength({ min: 20 })
  ],
  validateRequest,
  updateResourceController
)

router.delete('/:id', requireAuth, [param('id').isMongoId().withMessage('ID inválido')], validateRequest, deleteResourceController)

export default router
