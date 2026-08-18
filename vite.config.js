import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { getStockData } from './api/stock.js'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'stock-api-middleware',
      configureServer(server) {
        server.middlewares.use('/api/stock', async (req, res) => {
          const ticker = req.url.replace('/', '') // fx "/SOFI" -> "SOFI"
          try {
            const data = await getStockData(ticker)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err.message }))
          }
        })
      }
    }
  ]
})