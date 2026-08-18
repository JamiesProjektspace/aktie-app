export async function fetchStock(ticker) {
  const response = await fetch(`/api/stock/${ticker}`)
  if (!response.ok) {
    throw new Error(`Kunne ikke hente data for ${ticker}`)
  }
  return response.json()
}

export async function searchStocks(query) {
  if (!query || query.length < 1) return []
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
  if (!response.ok) return []
  return response.json()
}