import YahooFinance from 'yahoo-finance2'

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] })

export async function getStockData(ticker) {
  const quote = await yahooFinance.quote(ticker)

  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

  const chart = await yahooFinance.chart(ticker, {
    period1: oneYearAgo,
    interval: '1wk'
  })

  const summary = await yahooFinance.quoteSummary(ticker, {
    modules: ['recommendationTrend']
  })

  return {
    ticker,
    currentPrice: quote.regularMarketPrice,
    currency: quote.currency,
    history: chart.quotes.map(q => ({
      date: q.date,
      close: q.close
    })),
    recommendation: summary.recommendationTrend?.trend?.[0] || null
  }
}