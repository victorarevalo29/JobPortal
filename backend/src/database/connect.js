import mongoose from 'mongoose'

export const connectDatabase = async () => {
  const uri = process.env.MONGO_URI

  if (!uri) {
    console.warn('MONGO_URI no está definido. Conexión a MongoDB omitida para desarrollo local.')
    return
  }

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB_NAME || 'jobportal'
    })
    console.log('✅ MongoDB conectado correctamente')
  } catch (error) {
    console.error('❌ Error conectando a MongoDB', error)
    throw error
  }
}
