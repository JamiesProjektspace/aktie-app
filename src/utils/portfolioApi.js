import { supabase } from './supabaseClient'

export async function getPurchases() {
  const { data, error } = await supabase.from('purchases').select('*').order('buy_date')
  if (error) throw new Error(error.message)

  return data
    .filter(row => row.ticker)
    .map(row => ({
      id: row.id,
      ticker: row.ticker,
      name: row.name,
      buyPrice: row.buy_price,
      quantity: row.quantity,
      buyDate: row.buy_date,
      currency: row.currency
    }))
}

export async function addPurchase(purchase) {
  const { error } = await supabase.from('purchases').insert({
    ticker: purchase.ticker,
    name: purchase.name,
    buy_price: purchase.buyPrice,
    quantity: purchase.quantity,
    buy_date: purchase.buyDate,
    currency: purchase.currency
  })
  if (error) throw new Error(error.message)
}

export async function deletePurchase(id) {
  const { error } = await supabase.from('purchases').delete().eq('id', id)
  if (error) throw new Error(error.message)
}