export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500
  const message = error.message || 'Algo salió mal'

  if (process.env.NODE_ENV !== 'test') {
    console.error(error)
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: error.details,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  })
}
