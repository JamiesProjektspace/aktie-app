import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { getStockData } from './api/stock.js'
import { searchTickers } from './api/search.js'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'stock-api-middleware',
      configureServer(server) {
        server.middlewares.use('/api/stock', async (req, res) => {
          const ticker = req.url.replace('/', '')
          try {
            const data = await getStockData(ticker)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err.message }))
          }
        })

        server.middlewares.use('/api/search', async (req, res) => {
          const url = new URL(req.url, 'http://localhost')
          const query = url.searchParams.get('q')
          try {
            const results = await searchTickers(query)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(results))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err.message }))
          }
        })
      }
    }
  ]
})