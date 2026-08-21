export function getRecommendation(gainPercent, probabilityIncrease) {
  if (gainPercent >= 50) {
    if (probabilityIncrease < 50) {
      return {
        label: 'Overvej salg',
        reason: 'Kursen er steget markant, og simuleringen forventer overvejende fald fremover'
      }
    }
    return {
      label: 'Behold',
      reason: 'Kursen er steget markant, men simuleringen forventer fortsat opadgående potentiale'
    }
  }
  if (gainPercent <= -20) {
    return { label: 'Overvej at vente', reason: 'Kursen er faldet betydeligt siden dit køb' }
  }
  return { label: 'Behold', reason: 'Ingen af dine grænser er nået endnu' }
}