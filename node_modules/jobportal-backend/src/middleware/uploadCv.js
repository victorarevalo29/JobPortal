import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { AppError } from '../utils/AppError.js'

const uploadsRoot = path.join(process.cwd(), 'uploads', 'cv')
if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsRoot)
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now()
    const randomSegment = Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname) || '.pdf'
    const safeExt = ext.slice(0, 8) || '.pdf'
    cb(null, `${timestamp}-${randomSegment}${safeExt}`)
  }
})

const allowedMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
])

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    cb(new AppError('Formato de CV no soportado. Sube un PDF o DOC.', 400))
    return
  }
  cb(null, true)
}

export const uploadCv = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
})
