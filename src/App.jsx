import StockCard from './components/StockCard'
import { groupPortfolio } from './utils/portfolio'
import portfolio from '../data/portfolio.json'
import './App.css'

function App() {
  const grouped = groupPortfolio(portfolio)

  return (
    <div className="app">
      <h1>Mine aktier</h1>
      {grouped.map(stock => (
        <StockCard key={stock.ticker} {...stock} />
      ))}
    </div>
  )
}

export default App