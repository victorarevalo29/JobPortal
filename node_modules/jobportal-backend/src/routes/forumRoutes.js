import { Router } from 'express'
import { body, param, query } from 'express-validator'
import {
  addCommentController,
  createForumPostController,
  deleteForumPostController,
  getForumPostController,
  listForumPostsController,
  updateForumPostController
} from '../controllers/forumController.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import { validateRequest } from '../middleware/validateRequest.js'

const router = Router()

router.get(
  '/',
  [query('category').optional().isString()],
  validateRequest,
  listForumPostsController
)

router.get('/:id', [param('id').isMongoId().withMessage('ID inválido')], validateRequest, getForumPostController)

router.post(
  '/',
  requireAuth,
  [
    body('category').isLength({ min: 3 }).withMessage('Categoría requerida'),
    body('title').isLength({ min: 5 }).withMessage('Título muy corto'),
    body('content').isLength({ min: 30 }).withMessage('Contenido muy corto'),
    body('author').isMongoId().withMessage('Autor inválido')
  ],
  validateRequest,
  createForumPostController
)

router.patch(
  '/:id',
  requireAuth,
  [
    param('id').isMongoId().withMessage('ID inválido'),
    body('category').optional().isLength({ min: 3 }),
    body('title').optional().isLength({ min: 5 }),
    body('content').optional().isLength({ min: 30 })
  ],
  validateRequest,
  updateForumPostController
)

router.delete('/:id', requireAuth, [param('id').isMongoId().withMessage('ID inválido')], validateRequest, deleteForumPostController)

router.post(
  '/:id/comments',
  requireAuth,
  [
    param('id').isMongoId().withMessage('ID inválido'),
    body('author').isMongoId().withMessage('Autor inválido'),
    body('content').isLength({ min: 5 }).withMessage('Comentario muy corto')
  ],
  validateRequest,
  addCommentController
)

export default router
