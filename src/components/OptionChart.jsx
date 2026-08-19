import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

function OptionChart({ chartData, strike, currency }) {
  return (
    <div className="simulation">
      <h3>Simuleret kursudvikling frem til udløb</h3>
      <p className="simulation-note">
        500 simulerede forløb for den underliggende aktie. Den røde stiplede linje er strike-prisen ({strike} {currency}).
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis dataKey="dateLabel" tick={{ fill: 'var(--color-muted)', fontSize: 11 }} />
          <YAxis tick={{ fill: 'var(--color-muted)', fontSize: 11 }} width={50} />
          <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} />
          <ReferenceLine y={strike} stroke="var(--color-negative)" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="p90" stroke="var(--color-muted)" strokeDasharray="4 4" dot={false} />
          <Line type="monotone" dataKey="p50" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="p10" stroke="var(--color-muted)" strokeDasharray="4 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default OptionChart