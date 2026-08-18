import YahooFinance from 'yahoo-finance2'

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] })

// Søger efter tickers/firmanavne der matcher det brugeren har skrevet indtil videre
export async function searchTickers(query) {
  const results = await yahooFinance.search(query, { quotesCount: 8 })

  return results.quotes
    .filter(q => q.symbol && q.shortname) // springer resultater uden navn/symbol over
    .map(q => ({
      symbol: q.symbol,
      name: q.shortname,
      exchange: q.exchange
    }))
}