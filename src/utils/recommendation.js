export function getRecommendation(gainPercent) {
  if (gainPercent >= 50) {
    return { label: 'Overvej salg', reason: 'Kursen er steget markant siden dit køb' }
  }
  if (gainPercent <= -20) {
    return { label: 'Overvej at vente', reason: 'Kursen er faldet betydeligt siden dit køb' }
  }
  return { label: 'Behold', reason: 'Ingen af dine grænser er nået endnu' }
}