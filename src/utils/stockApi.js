export async function fetchStock(ticker) {
  const response = await fetch(`/api/stock/${ticker}`)
  if (!response.ok) {
    throw new Error(`Kunne ikke hente data for ${ticker}`)
  }
  return response.json()
}