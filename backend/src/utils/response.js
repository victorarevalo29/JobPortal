export const sendSuccess = (res, { data = null, message = 'Operación exitosa', meta = null, statusCode = 200 }) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta
  })
}

export const sendCreated = (res, payload) => sendSuccess(res, { statusCode: 201, ...payload })
