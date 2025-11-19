import { Router } from 'express'
import { body, param, query } from 'express-validator'
import {
  createReviewController,
  deleteReviewController,
  getReviewController,
  listReviewsController,
  updateReviewController
} from '../controllers/reviewController.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import { validateRequest } from '../middleware/validateRequest.js'

const router = Router()

router.get(
  '/',
  [query('company').optional().isMongoId(), query('author').optional().isMongoId()],
  validateRequest,
  listReviewsController
)

router.get('/:id', [param('id').isMongoId().withMessage('ID inválido')], validateRequest, getReviewController)

router.post(
  '/',
  requireAuth,
  [
    body('company').isMongoId().withMessage('Empresa inválida'),
    body('author').isMongoId().withMessage('Autor inválido'),
    body('rating').isFloat({ min: 1, max: 5 }).withMessage('Puntuación entre 1 y 5'),
    body('comment').optional().isLength({ max: 2000 })
  ],
  validateRequest,
  createReviewController
)

router.patch(
  '/:id',
  requireAuth,
  [
    param('id').isMongoId().withMessage('ID inválido'),
    body('rating').optional().isFloat({ min: 1, max: 5 }),
    body('comment').optional().isLength({ max: 2000 })
  ],
  validateRequest,
  updateReviewController
)

router.delete('/:id', requireAuth, [param('id').isMongoId().withMessage('ID inválido')], validateRequest, deleteReviewController)

export default router
