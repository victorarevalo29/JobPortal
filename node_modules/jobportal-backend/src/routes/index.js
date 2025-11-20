import { Router } from 'express'
import { healthController } from '../controllers/healthController.js'
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'
import companyRoutes from './companyRoutes.js'
import jobRoutes from './jobRoutes.js'
import applicationRoutes from './applicationRoutes.js'
import reviewRoutes from './reviewRoutes.js'
import resourceRoutes from './resourceRoutes.js'
import forumRoutes from './forumRoutes.js'

const router = Router()

router.get('/health', healthController)
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/companies', companyRoutes)
router.use('/jobs', jobRoutes)
router.use('/applications', applicationRoutes)
router.use('/reviews', reviewRoutes)
router.use('/resources', resourceRoutes)
router.use('/forum', forumRoutes)

export default router
