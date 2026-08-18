import { useState, useEffect } from 'react'
import { fetchStock } from '../utils/stockApi'
import { getRecommendation } from '../utils/recommendation'

function StockCard({ ticker, name, buyPrice, currency }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStock(ticker)
      .then(setData)
      .catch(err => setError(err.message))
  }, [ticker])

  if (error) return <div className="stock-card error">Fejl: {error}</div>
  if (!data) return <div className="stock-card">Henter {ticker}...</div>

  const gainPercent = ((data.currentPrice - buyPrice) / buyPrice) * 100
  const recommendation = getRecommendation(gainPercent)

  return (
    <div className="stock-card">
      <h2>{name} ({ticker})</h2>
      <p>Aktuel kurs: {data.currentPrice} {currency}</p>
      <p>Din indkøbspris: {buyPrice} {currency}</p>
      <p className={gainPercent >= 0 ? 'gain-positive' : 'gain-negative'}>
        Afkast: {gainPercent.toFixed(1)}%
      </p>
      {data.recommendation && (
        <p>
          Analytikere: {data.recommendation.strongBuy + data.recommendation.buy} køb,{' '}
          {data.recommendation.hold} hold,{' '}
          {data.recommendation.sell + data.recommendation.strongSell} sælg
        </p>
      )}
      <p className="recommendation">
        <strong>{recommendation.label}</strong> — {recommendation.reason}
      </p>
    </div>
  )
}

export default StockCard