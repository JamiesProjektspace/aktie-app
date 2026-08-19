import { useState, useEffect } from 'react'
import StockCard from './components/StockCard'
import OptionCard from './components/OptionCard'
import AddStockForm from './components/AddStockForm'
import AddOptionForm from './components/AddOptionForm'
import { groupPortfolio } from './utils/portfolio'
import { getPurchases, addPurchase, deletePurchase } from './utils/portfolioApi'
import { getOptions, addOption, deleteOption } from './utils/optionsApi'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('stocks')

  const [portfolio, setPortfolio] = useState([])
  const [loadingStocks, setLoadingStocks] = useState(true)
  const [stockError, setStockError] = useState(null)

  const [options, setOptions] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [optionError, setOptionError] = useState(null)

  async function loadPortfolio() {
    try {
      const data = await getPurchases()
      setPortfolio(data)
    } catch (err) {
      setStockError(err.message)
    } finally {
      setLoadingStocks(false)
    }
  }

  async function loadOptions() {
    try {
      const data = await getOptions()
      setOptions(data)
    } catch (err) {
      setOptionError(err.message)
    } finally {
      setLoadingOptions(false)
    }
  }

  useEffect(() => {
    loadPortfolio()
    loadOptions()
  }, [])

  async function handleAddStock(purchase) {
    await addPurchase(purchase)
    await loadPortfolio()
  }

  async function handleDeleteStock(id) {
    await deletePurchase(id)
    await loadPortfolio()
  }

  async function handleAddOption(option) {
    await addOption(option)
    await loadOptions()
  }

  async function handleDeleteOption(id) {
    await deleteOption(id)
    await loadOptions()
  }

  const grouped = groupPortfolio(portfolio)

  return (
    <div className={activeTab === 'options' ? 'app app-options' : 'app'}>
      <h1>Mine investeringer</h1>

      <div className="tabs">
        <button className={activeTab === 'stocks' ? 'tab active' : 'tab'} onClick={() => setActiveTab('stocks')}>
          Aktier
        </button>
        <button className={activeTab === 'options' ? 'tab active' : 'tab'} onClick={() => setActiveTab('options')}>
          Optioner
        </button>
      </div>

      {activeTab === 'stocks' && (
        <>
          <AddStockForm onAdd={handleAddStock} />
          {loadingStocks && <p>Henter portefølje...</p>}
          {stockError && <p className="error-message">Fejl: {stockError}</p>}
          <div className="stock-list">
            {grouped.map(stock => (
              <StockCard key={stock.ticker} {...stock} onDelete={handleDeleteStock} />
            ))}
          </div>
        </>
      )}

      {activeTab === 'options' && (
        <>
          <AddOptionForm onAdd={handleAddOption} />
          {loadingOptions && <p>Henter optioner...</p>}
          {optionError && <p className="error-message">Fejl: {optionError}</p>}
          <div className="stock-list">
            {options.map(option => (
              <OptionCard key={option.id} {...option} onDelete={handleDeleteOption} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App