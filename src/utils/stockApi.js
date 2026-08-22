const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export async function fetchStock(ticker) {
  const response = await fetch(`${API_BASE_URL}/api/stock/${ticker}`)
  if (!response.ok) {
    throw new Error(`Kunne ikke hente data for ${ticker}`)
  }
  return response.json()
}

export async function searchStocks(query) {
  if (!query || query.length < 1) return []
  const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`)
  if (!response.ok) return []
  return response.json()
}