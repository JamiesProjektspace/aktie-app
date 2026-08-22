import YahooFinance from 'yahoo-finance2'

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] })

export async function searchTickers(query) {
  const results = await yahooFinance.search(query, { quotesCount: 8 })

  return results.quotes
    .filter(q => q.symbol && q.shortname)
    .map(q => ({
      symbol: q.symbol,
      name: q.shortname,
      exchange: q.exchange
    }))
}