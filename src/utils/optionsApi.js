import { supabase } from './supabaseClient'

export async function getOptions() {
  const { data, error } = await supabase.from('options').select('*').order('expiration_date')
  if (error) throw new Error(error.message)

  return data
    .filter(row => row.ticker)
    .map(row => ({
      id: row.id,
      ticker: row.ticker,
      name: row.name,
      optionType: row.option_type,
      position: row.position,
      strike: row.strike,
      expirationDate: row.expiration_date,
      premium: row.premium,
      quantity: row.quantity,
      buyDate: row.buy_date,
      currency: row.currency
    }))
}

export async function addOption(option) {
  const { error } = await supabase.from('options').insert({
    ticker: option.ticker,
    name: option.name,
    option_type: option.optionType,
    position: option.position,
    strike: option.strike,
    expiration_date: option.expirationDate,
    premium: option.premium,
    quantity: option.quantity,
    buy_date: option.buyDate,
    currency: option.currency
  })
  if (error) throw new Error(error.message)
}

export async function deleteOption(id) {
  const { error } = await supabase.from('options').delete().eq('id', id)
  if (error) throw new Error(error.message)
}