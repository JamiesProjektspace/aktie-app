import { useState, useEffect, useMemo } from 'react'
import { fetchStock } from '../utils/stockApi'
import { getRecommendation } from '../utils/recommendation'
import { estimateParameters, runSimulation, computePercentiles, probabilityAboveCurrent } from '../utils/simulation'
import PriceSimulation from './PriceSimulation'

function StockCard({ ticker, name, currency, totalQuantity, gak, purchases, onDelete }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStock(ticker)
      .then(setData)
      .catch(err => setError(err.message))
  }, [ticker])

  const simulation = useMemo(() => {
    if (!data) return null
    const { drift, volatility } = estimateParameters(data.history)
    const paths = runSimulation(data.currentPrice, drift, volatility, 21, 500)
    const chartData = computePercentiles(paths, [10, 50, 90])
    const final = chartData[chartData.length - 1]
    const probabilityIncrease = probabilityAboveCurrent(paths, data.currentPrice)
    return { chartData, final, probabilityIncrease }
  }, [data])

  if (error) return <div className="stock-card error">Fejl: {error}</div>
  if (!data || !simulation) return <div className="stock-card">Henter {ticker}...</div>

  const gainPercent = ((data.currentPrice - gak) / gak) * 100
  const recommendation = getRecommendation(gainPercent)

  return (
    <div className="stock-card">
      <h2>{name} ({ticker})</h2>

      <p className="recommendation-headline">
        <strong>{recommendation.label}</strong> — {recommendation.reason}
        {' '}({simulation.probabilityIncrease.toFixed(0)}% af simuleringerne forventer en højere kurs om en måned)
      </p>

      <details>
        <summary>Se detaljer</summary>

        <p>Aktuel kurs: {data.currentPrice} {currency}</p>
        <p>Antal aktier: {totalQuantity}</p>
        {purchases.length > 1 ? (
          <p>GAK: {gak.toFixed(2)} {currency}</p>
        ) : (
          <p>Indkøbspris: {gak.toFixed(2)} {currency}</p>
        )}
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
        <PriceSimulation
          ticker={ticker}
          chartData={simulation.chartData}
          final={simulation.final}
          currency={currency}
        />

        <div className="purchase-management">
          <p className="purchase-management-label">Køb ({purchases.length})</p>
          <ul>
            {purchases.map(p => (
              <li key={p.id}>
                <span>{p.buyDate}: {p.quantity} stk. à {p.buyPrice} {currency}</span>
                <button className="delete-button" onClick={() => onDelete(p.id)}>Slet</button>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  )
}

export default StockCard