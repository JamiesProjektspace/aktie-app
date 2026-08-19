import { runSimulation, computePercentiles } from './simulation'

const RISK_FREE_RATE = 0.03 // antaget "risikofri rente" (fx statsobligationer), fast tal til Black-Scholes
const CONTRACT_MULTIPLIER = 100 // én kontrakt repræsenterer typisk 100 aktier

// Den kumulative normalfordeling — et matematisk "opslagsværk" Black-Scholes
// bruger til at omregne d1/d2 til sandsynligheder. Denne tilnærmelse
// (Abramowitz-Stegun) er standard, når man ikke har adgang til et statistik-bibliotek.
function cumulativeNormal(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x))
  const d = 0.3989423 * Math.exp((-x * x) / 2)
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  if (x > 0) prob = 1 - prob
  return prob
}

// Black-Scholes: den klassiske formel for hvad en option "burde" være værd lige nu,
// ud fra fem input — aktuel kurs, strike, tid til udløb, volatilitet og renten.
export function blackScholesPrice({ spot, strike, daysToExpiration, volatility, optionType }) {
  const T = daysToExpiration / 365
  if (T <= 0) {
    // Optionen er udløbet — værdien er kun den "indre værdi", ingen tid tilbage
    return optionType === 'call' ? Math.max(spot - strike, 0) : Math.max(strike - spot, 0)
  }

  const r = RISK_FREE_RATE
  const d1 = (Math.log(spot / strike) + (r + (volatility ** 2) / 2) * T) / (volatility * Math.sqrt(T))
  const d2 = d1 - volatility * Math.sqrt(T)

  if (optionType === 'call') {
    return spot * cumulativeNormal(d1) - strike * Math.exp(-r * T) * cumulativeNormal(d2)
  }
  return strike * Math.exp(-r * T) * cumulativeNormal(-d2) - spot * cumulativeNormal(-d1)
}

// Monte Carlo-simulering: genbruger den samme GBM-motor som aktie-simuleringen,
// men kører frem til optionens udløbsdato i stedet for fast én måned, og regner
// gevinst/tab ud for hvert af de 500 simulerede forløb — med hensyn til om du har
// KØBT eller SOLGT optionen, da de to situationer har modsat gevinst-billede.
export function simulateOption({ spot, strike, daysToExpiration, drift, volatility, optionType, position, premium, quantity }) {
  const tradingDays = Math.max(1, Math.round(daysToExpiration * (252 / 365)))
  const paths = runSimulation(spot, drift, volatility, tradingDays, 500)
  const chartData = computePercentiles(paths, [10, 50, 90])

  const finalPrices = paths.map(p => p[p.length - 1])
  const payoffs = finalPrices.map(price =>
    optionType === 'call' ? Math.max(price - strike, 0) : Math.max(strike - price, 0)
  )

  const profits = payoffs.map(payoff => {
    const perShareResult = position === 'long' ? payoff - premium : premium - payoff
    return perShareResult * quantity * CONTRACT_MULTIPLIER
  })

  const probabilityITM = (payoffs.filter(p => p > 0).length / payoffs.length) * 100
  const probabilityOfProfit = (profits.filter(p => p > 0).length / profits.length) * 100
  const sortedProfits = [...profits].sort((a, b) => a - b)
  const medianProfit = sortedProfits[Math.floor(sortedProfits.length / 2)]

  return { chartData, probabilityITM, probabilityOfProfit, medianProfit }
}