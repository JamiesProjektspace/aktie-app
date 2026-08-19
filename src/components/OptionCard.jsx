import { useState, useEffect, useMemo } from 'react'
import { fetchStock } from '../utils/stockApi'
import { estimateParameters } from '../utils/simulation'
import { blackScholesPrice, simulateOption } from '../utils/optionPricing'
import OptionChart from './OptionChart'

function OptionCard({ id, ticker, name, optionType, position, strike, expirationDate, premium, quantity, currency, onDelete }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStock(ticker)
      .then(setData)
      .catch(err => setError(err.message))
  }, [ticker])

  const daysToExpiration = useMemo(() => {
    const today = new Date()
    const expiry = new Date(expirationDate)
    return Math.max(0, Math.ceil((expiry - today) / (1000 * 60 * 60 * 24)))
  }, [expirationDate])

  const analysis = useMemo(() => {
    if (!data) return null
    const { drift, volatility } = estimateParameters(data.history)

    const theoreticalValue = blackScholesPrice({
      spot: data.currentPrice,
      strike,
      daysToExpiration,
      volatility,
      optionType
    })

    const simulation = simulateOption({
      spot: data.currentPrice,
      strike,
      daysToExpiration,
      drift,
      volatility,
      optionType,
      position,
      premium,
      quantity
    })

    const totalSimulatedDays = simulation.chartData[simulation.chartData.length - 1].day
    const today = new Date()
    const chartDataWithDates = simulation.chartData.map(point => {
      const calendarOffset = totalSimulatedDays > 0
        ? Math.round((point.day / totalSimulatedDays) * daysToExpiration)
        : 0
      const date = new Date(today)
      date.setDate(date.getDate() + calendarOffset)
      const dateLabel = date.toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' })
      return { ...point, dateLabel }
    })

    return { ...simulation, chartData: chartDataWithDates, theoreticalValue }
  }, [data, daysToExpiration, strike, optionType, position, premium, quantity])

  if (error) return <div className="stock-card option-card error">Fejl: {error}</div>
  if (!data || !analysis) return <div className="stock-card option-card">Henter {ticker}...</div>

  const optionLabel = `${optionType === 'call' ? 'Call' : 'Put'} — ${position === 'long' ? 'Købt' : 'Solgt'}`
  const totalPremium = premium * quantity * 100

  return (
    <div className="stock-card option-card">
      <h2>{name} ({ticker})</h2>
      <p className="option-type-badge">{optionLabel}</p>

      <p className="recommendation-headline">
        {analysis.probabilityITM.toFixed(0)}% sandsynlighed for at udløbe "in the money" — median resultat: {analysis.medianProfit >= 0 ? '+' : ''}{analysis.medianProfit.toFixed(0)} {currency} ({analysis.probabilityOfProfit.toFixed(0)}% sandsynlighed for profit)
      </p>

      <details>
        <summary>Se detaljer</summary>

        <p>Underliggende kurs: {data.currentPrice.toFixed(2)} {currency}</p>
        <p>Strike: {strike.toFixed(2)} {currency}</p>
        <p>Udløb: {expirationDate} ({daysToExpiration} dage)</p>
        <p>Præmie pr. kontrakt: {premium.toFixed(2)} {currency}</p>
        <p>Antal kontrakter: {quantity}</p>
        <p>
            Samlet præmie: {totalPremium.toFixed(2)} {currency}
            <span className="calculation-hint"> ({premium.toFixed(2)} × 100 × {quantity})</span>
        </p>
        <p>Black-Scholes teoretisk værdi: {analysis.theoreticalValue.toFixed(2)} {currency}</p>

        <OptionChart chartData={analysis.chartData} strike={strike} currency={currency} />

        <div className="purchase-management">
          <button className="delete-button" onClick={() => onDelete(id)}>Slet option</button>
        </div>
      </details>
    </div>
  )
}

export default OptionCard