import { getStockData } from '../_lib/stockService.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { ticker } = req.query
  try {
    const data = await getStockData(ticker)
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}