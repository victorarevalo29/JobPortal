import { deepTrim } from '../utils/sanitize.js'

export const sanitizeRequest = (req, res, next) => {
  if (req.body && Object.keys(req.body).length) {
    req.body = deepTrim(req.body)
  }

  if (req.query && Object.keys(req.query).length) {
    req.query = deepTrim(req.query)
  }

  next()
}
