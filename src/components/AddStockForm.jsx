import { useState, useRef } from 'react'
import { searchStocks } from '../utils/stockApi'

function AddStockForm({ onAdd }) {
  const [ticker, setTicker] = useState('')
  const [name, setName] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
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

    // "Debounce": vent 300ms efter sidste tastetryk, før vi rent faktisk søger,
    // så vi ikke sender et kald for hvert eneste bogstav mens du taster hurtigt
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
      buyPrice: parseFloat(buyPrice),
      quantity: parseFloat(quantity),
      buyDate,
      currency
    })
    setTicker('')
    setName('')
    setBuyPrice('')
    setQuantity('')
    setBuyDate('')
    setSuggestions([])
    setSubmitting(false)
  }

  return (
    <form className="add-stock-form" onSubmit={handleSubmit}>
      <div className="ticker-input-wrapper">
        <input
          placeholder="Ticker eller firmanavn"
          value={ticker}
          onChange={e => handleTickerChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          required
        />
        {suggestions.length > 0 && (
          <ul className="ticker-suggestions">
            {suggestions.map((s, i) => (
              <li
                key={s.symbol}
                className={i === highlightedIndex ? 'highlighted' : ''}
                onMouseDown={() => selectSuggestion(s)}
              >
                <strong>{s.symbol}</strong> — {s.name} <span className="exchange">{s.exchange}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <input placeholder="Navn" value={name} onChange={e => setName(e.target.value)} required />
      <input type="number" step="0.01" placeholder="Indkøbspris" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} required />
      <input type="number" step="1" placeholder="Antal" value={quantity} onChange={e => setQuantity(e.target.value)} required />
      <input type="date" value={buyDate} onChange={e => setBuyDate(e.target.value)} required />
      <select value={currency} onChange={e => setCurrency(e.target.value)}>
        <option value="USD">USD</option>
        <option value="DKK">DKK</option>
        <option value="EUR">EUR</option>
      </select>
      <button type="submit" disabled={submitting}>{submitting ? 'Tilføjer...' : 'Tilføj aktie'}</button>
    </form>
  )
}

export default AddStockForm