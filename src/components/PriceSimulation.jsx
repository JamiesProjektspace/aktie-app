import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function PriceSimulation({ ticker, chartData, final, currency }) {
  return (
    <div className="simulation">
      <h3>Simuleret kursudvikling — 1 måned frem</h3>
      <p className="simulation-note">
        500 simulerede forløb (Geometrisk Brownsk Bevægelse), baseret på {ticker}'s egen historiske volatilitet
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            tickFormatter={d => `dag ${d}`}
            tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
          />
          <YAxis tick={{ fill: 'var(--color-muted)', fontSize: 11 }} width={50} />
          <Tooltip
            contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            labelFormatter={d => `${d} børsdage frem`}
          />
          <Line type="monotone" dataKey="p90" stroke="var(--color-muted)" strokeDasharray="4 4" dot={false} name="10% chance over" />
          <Line type="monotone" dataKey="p50" stroke="var(--color-accent)" strokeWidth={2} dot={false} name="Median" />
          <Line type="monotone" dataKey="p10" stroke="var(--color-muted)" strokeDasharray="4 4" dot={false} name="10% chance under" />
        </LineChart>
      </ResponsiveContainer>
      <div className="simulation-percentiles">
        <p>10% sandsynlighed over: <strong>{final.p90.toFixed(2)} {currency}</strong></p>
        <p>Median (50%): <strong>{final.p50.toFixed(2)} {currency}</strong></p>
        <p>10% sandsynlighed under: <strong>{final.p10.toFixed(2)} {currency}</strong></p>
      </div>
    </div>
  )
}

export default PriceSimulation