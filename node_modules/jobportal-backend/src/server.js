import './config/loadEnv.js'
import app from './app.js'
import { connectDatabase } from './database/connect.js'

const port = process.env.PORT || 5000

const bootstrap = async () => {
  try {
    await connectDatabase()
    app.listen(port, () => {
      console.log(`🚀 API lista en http://localhost:${port}`)
    })
  } catch (error) {
    console.error('No fue posible iniciar el servidor.')
  }
}

bootstrap()
