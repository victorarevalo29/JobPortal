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
    body('content').isLength({ min: 20 }),
    body('format').optional().isIn(['Artículo', 'Video', 'Playbook', 'Taller', 'Plantilla']).withMessage('Formato inválido'),
    body('mediaType').optional().isIn(['article', 'video', 'playbook', 'template', 'workshop']).withMessage('Tipo multimedia inválido'),
    body('mediaUrl').optional().isURL().withMessage('URL inválida'),
    body('duration').optional().isLength({ min: 2, max: 40 }),
    body('author').optional().isLength({ min: 3, max: 120 }),
    body('tags').optional().isArray({ max: 8 }).withMessage('Incluye un máximo de 8 tags'),
    body('tags.*').optional().isString().isLength({ min: 2, max: 40 }),
    body('summary').optional().isLength({ min: 20, max: 320 })
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
    body('content').optional().isLength({ min: 20 }),
    body('format').optional().isIn(['Artículo', 'Video', 'Playbook', 'Taller', 'Plantilla']),
    body('mediaType').optional().isIn(['article', 'video', 'playbook', 'template', 'workshop']),
    body('mediaUrl').optional().isURL(),
    body('duration').optional().isLength({ min: 2, max: 40 }),
    body('author').optional().isLength({ min: 3, max: 120 }),
    body('tags').optional().isArray({ max: 8 }),
    body('tags.*').optional().isString().isLength({ min: 2, max: 40 }),
    body('summary').optional().isLength({ min: 20, max: 320 })
  ],
  validateRequest,
  updateResourceController
)

router.delete('/:id', requireAuth, [param('id').isMongoId().withMessage('ID inválido')], validateRequest, deleteResourceController)

export default router
