import { useState, useRef } from 'react'
import { searchStocks } from '../utils/stockApi'

function AddOptionForm({ onAdd }) {
  const [ticker, setTicker] = useState('')
  const [name, setName] = useState('')
  const [optionType, setOptionType] = useState('call')
  const [position, setPosition] = useState('long')
  const [strike, setStrike] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [premium, setPremium] = useState('')
  const [quantity, setQuantity] = useState('')
  const [buyDate, setBuyDate] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [submitting, setSubmitting] = useState(false)

  const [suggestions, setSuggestions] = useState([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchTimeout = useRef(null)

  async function handleTickerChange(value) {
    setTicker(value)
    setHighlightedIndex(-1)
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(async () => {
      const results = await searchStocks(value)
      setSuggestions(results)
    }, 300)
  }

  function selectSuggestion(suggestion) {
    setTicker(suggestion.symbol)
    setName(suggestion.name)
    setSuggestions([])
    setHighlightedIndex(-1)
  }

  function handleKeyDown(e) {
    if (suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault()
      selectSuggestion(suggestions[highlightedIndex])
    } else if (e.key === 'Escape') {
      setSuggestions([])
      setHighlightedIndex(-1)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    await onAdd({
      ticker: ticker.toUpperCase(),
      name,
      optionType,
      position,
      strike: parseFloat(strike),
      expirationDate,
      premium: parseFloat(premium),
      quantity: parseFloat(quantity),
      buyDate,
      currency
    })
    setTicker('')
    setName('')
    setStrike('')
    setExpirationDate('')
    setPremium('')
    setQuantity('')
    setBuyDate('')
    setSuggestions([])
    setSubmitting(false)
  }

  return (
    <form className="add-stock-form" onSubmit={handleSubmit}>
      <div className="field ticker-input-wrapper">
        <label>Ticker</label>
        <input
          placeholder="fx AAPL"
          value={ticker}
          onChange={e => handleTickerChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          required
        />
        {suggestions.length > 0 && (
          <ul className="ticker-suggestions">
            {suggestions.map((s, i) => (
              <li key={s.symbol} className={i === highlightedIndex ? 'highlighted' : ''} onMouseDown={() => selectSuggestion(s)}>
                <strong>{s.symbol}</strong> — {s.name} <span className="exchange">{s.exchange}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="field">
        <label>Type</label>
        <select value={optionType} onChange={e => setOptionType(e.target.value)}>
          <option value="call">Call</option>
          <option value="put">Put</option>
        </select>
      </div>
      <div className="field">
        <label>Position</label>
        <select value={position} onChange={e => setPosition(e.target.value)}>
          <option value="long">Købt</option>
          <option value="short">Solgt</option>
        </select>
      </div>
      <div className="field">
        <label>Strike</label>
        <input type="number" step="0.01" placeholder="0.00" value={strike} onChange={e => setStrike(e.target.value)} required />
      </div>
      <div className="field">
        <label>Udløbsdato</label>
        <input type="date" value={expirationDate} onChange={e => setExpirationDate(e.target.value)} required />
      </div>
      <div className="field">
        <label>Præmie pr. aktie</label>
        <input type="number" step="0.01" placeholder="0.00" value={premium} onChange={e => setPremium(e.target.value)} required />
      </div>
      <div className="field">
        <label>Antal kontrakter</label>
        <input type="number" step="1" placeholder="0" value={quantity} onChange={e => setQuantity(e.target.value)} required />
      </div>
      <div className="field">
        <label>Købsdato</label>
        <input type="date" value={buyDate} onChange={e => setBuyDate(e.target.value)} required />
      </div>
      <div className="field">
        <label>Valuta</label>
        <select value={currency} onChange={e => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value="DKK">DKK</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
      <button type="submit" disabled={submitting}>{submitting ? 'Tilføjer...' : 'Tilføj option'}</button>
    </form>
  )
}

export default AddOptionForm