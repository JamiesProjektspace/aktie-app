export function groupPortfolio(portfolio) {
  const groups = {}

  for (const purchase of portfolio) {
    if (!groups[purchase.ticker]) {
      groups[purchase.ticker] = {
        ticker: purchase.ticker,
        name: purchase.name,
        currency: purchase.currency,
        purchases: []
      }
    }
    groups[purchase.ticker].purchases.push(purchase)
  }

  return Object.values(groups).map(group => {
    const totalQuantity = group.purchases.reduce((sum, p) => sum + p.quantity, 0)
    const totalCost = group.purchases.reduce((sum, p) => sum + p.quantity * p.buyPrice, 0)
    const gak = totalCost / totalQuantity

    return { ...group, totalQuantity, gak }
  })
}