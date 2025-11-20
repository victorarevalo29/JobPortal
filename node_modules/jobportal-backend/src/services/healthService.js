export const getHealthSnapshot = () => ({
  uptime: process.uptime(),
  environment: process.env.NODE_ENV || 'development',
  timestamp: Date.now()
})
