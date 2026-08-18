import StockCard from './components/StockCard'
import portfolio from '../data/portfolio.json'
import './App.css'

function App() {
  return (
    <div className="app">
      <h1>Mine aktier</h1>
      {portfolio.map(stock => (
        <StockCard key={stock.ticker} {...stock} />
      ))}
    </div>
  )
}

export default App