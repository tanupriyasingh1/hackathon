import { ACTIVITIES, BENCHMARKS } from '../lib/factors.js'
import { round } from '../lib/calc.js'

const TARGETS = [
  ['13.2', 'Integrate climate change measures into policies, strategies and planning.'],
  ['13.3', 'Improve education, awareness-raising and human and institutional capacity on climate change mitigation, adaptation, impact reduction and early warning.'],
]

export default function Learn() {
  const top = Object.values(ACTIVITIES).filter((a) => a.factor >= 1).sort((a, b) => b.factor - a.factor).slice(0, 5)
  return (
    <div className="stack">
      <section className="card" aria-labelledby="sdg-h">
        <h2 id="sdg-h">Why GreenStep? SDG 13: Climate Action</h2>
        <p>
          Climate change is a systems problem, but systems are made of daily decisions. Most people can't see the carbon cost of a
          commute, a lunch, or a night with the AC on, and what you can't see you can't change. GreenStep turns invisible emissions
          into a number you can act on, and then tells you the single swap that would help <em>you</em> the most.
        </p>
        <h3>How it supports the UN targets</h3>
        <ul className="plain">
          {TARGETS.map(([n, t]) => (<li key={n}><span className="pill">Target {n}</span> {t}</li>))}
        </ul>
        <p className="muted small">
          GreenStep focuses on <strong>13.3 (awareness and education)</strong>. It also touches SDG 12 (responsible consumption) and SDG 11 (sustainable cities and transport).
        </p>
      </section>

      <section className="card" aria-labelledby="bench-h">
        <h2 id="bench-h">Where do you stand?</h2>
        <div className="bench">
          {Object.values(BENCHMARKS).map((b) => (
            <div key={b.label} className="bench-item">
              <span className="bench-val">{round(b.perDay)}</span>
              <span className="muted small">kg CO₂e / day</span>
              <span>{b.label}</span>
            </div>
          ))}
        </div>
        <p className="muted small">Yearly per-person emissions divided by 365 (Our World in Data, Global Carbon Project). The Paris-aligned figure is an illustrative budget of about 2.3 tonnes per person per year by 2030.</p>
      </section>

      <section className="card" aria-labelledby="hot-h">
        <h2 id="hot-h">Biggest single activities</h2>
        <ul className="plain">
          {top.map((a) => (<li key={a.label}><span aria-hidden="true">{a.icon}</span> {a.label}: <strong>{a.factor} kg</strong> per {a.unit.replace(/s$/, '')}</li>))}
        </ul>
      </section>

      <section className="card" aria-labelledby="method-h">
        <h2 id="method-h">Method and honesty note</h2>
        <p className="small">
          GreenStep multiplies what you log by rounded emission factors drawn from IPCC AR6, UK DEFRA conversion factors, IEA grid averages
          and Poore &amp; Nemecek (2018) food data. Real footprints vary by country, vehicle, grid and food origin, so treat numbers as a
          compass for comparing choices, not an audit. Everything stays on your device: there are no accounts and no tracking.
        </p>
      </section>
    </div>
  )
}
