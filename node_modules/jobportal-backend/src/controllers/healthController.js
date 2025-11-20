import { getHealthSnapshot } from '../services/healthService.js'
import { sendSuccess } from '../utils/response.js'

export const healthController = (req, res) => {
  return sendSuccess(res, {
    message: 'API saludable',
    data: {
      service: 'JobPortal API',
      snapshot: getHealthSnapshot()
    }
  })
}
