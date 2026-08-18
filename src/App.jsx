import { useState, useEffect } from 'react'
import StockCard from './components/StockCard'
import AddStockForm from './components/AddStockForm'
import { groupPortfolio } from './utils/portfolio'
import { getPurchases, addPurchase, deletePurchase } from './utils/portfolioApi'
import './App.css'

function App() {
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadPortfolio() {
    try {
      const data = await getPurchases()
      setPortfolio(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPortfolio()
  }, [])

  async function handleAdd(purchase) {
    await addPurchase(purchase)
    await loadPortfolio()
  }

  async function handleDelete(id) {
    await deletePurchase(id)
    await loadPortfolio()
  }

  const grouped = groupPortfolio(portfolio)

  return (
    <div className="app">
      <h1>Mine aktier</h1>
      <AddStockForm onAdd={handleAdd} />
      {loading && <p>Henter portefølje...</p>}
      {error && <p className="error-message">Fejl: {error}</p>}
      <div className="stock-list">
        {grouped.map(stock => (
          <StockCard key={stock.ticker} {...stock} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}

export default App