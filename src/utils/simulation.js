export function estimateParameters(history) {
  const closes = history.filter(h => h.close != null).map(h => h.close)
  const logReturns = []
  for (let i = 1; i < closes.length; i++) {
    logReturns.push(Math.log(closes[i] / closes[i - 1]))
  }

  const mean = logReturns.reduce((sum, r) => sum + r, 0) / logReturns.length
  const variance =
    logReturns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / (logReturns.length - 1)
  const weeklyVolatility = Math.sqrt(variance)

  return {
    drift: mean * 52,
    volatility: weeklyVolatility * Math.sqrt(52)
  }
}

function randomNormal() {
  const u1 = Math.random()
  const u2 = Math.random()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

function simulateOnePath(startPrice, drift, volatility, days) {
  const dt = 1 / 252
  const path = [startPrice]
  let price = startPrice

  for (let d = 0; d < days; d++) {
    const z = randomNormal()
    price = price * Math.exp((drift - 0.5 * volatility ** 2) * dt + volatility * Math.sqrt(dt) * z)
    path.push(price)
  }

  return path
}

export function runSimulation(startPrice, drift, volatility, days = 252, simulations = 500) {
  const paths = []
  for (let s = 0; s < simulations; s++) {
    paths.push(simulateOnePath(startPrice, drift, volatility, days))
  }
  return paths
}

export function computePercentiles(paths, percentiles = [10, 50, 90]) {
  const days = paths[0].length
  const result = []

  for (let d = 0; d < days; d++) {
    const valuesAtDay = paths.map(p => p[d]).sort((a, b) => a - b)
    const entry = { day: d }
    for (const p of percentiles) {
      const index = Math.floor((p / 100) * (valuesAtDay.length - 1))
      entry[`p${p}`] = valuesAtDay[index]
    }
    result.push(entry)
  }

  return result
}

// Tæller, hvor mange af de simulerede forløb der ender OVER den nuværende
// kurs efter simuleringsperioden, og omregner det til en procentdel.
// Det er dét tal, vi bruger til sætningen "X% af simuleringerne forventer..."
export function probabilityAboveCurrent(paths, currentPrice) {
  const finalPrices = paths.map(p => p[p.length - 1])
  const above = finalPrices.filter(price => price > currentPrice).length
  return (above / finalPrices.length) * 100
}