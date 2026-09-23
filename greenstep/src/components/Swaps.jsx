import { ACTIVITIES } from '../lib/factors.js'
import { plural, round, treesToOffset } from '../lib/calc.js'

export default function Swaps({ swaps, pledges, onPledge, onRemove }) {
  const pledged = (s) => pledges.some((p) => p.from === s.from && p.to === s.to)
  const yearly = pledges.reduce((sum, p) => sum + p.perWeek * 52, 0)

  return (
    <section className="card" aria-labelledby="swap-h">
      <h2 id="swap-h">Your best swaps</h2>
      <p className="muted">Based on what you actually logged in the last 7 days. Take a pledge to lock in the change.</p>

      {swaps.length === 0 ? (
        <p className="empty">Log a few days of activity and your personalised swaps will appear here.</p>
      ) : (
        <ul className="swap-list">
          {swaps.slice(0, 4).map((s) => {
            const a = ACTIVITIES[s.from], b = ACTIVITIES[s.to]
            const done = pledged(s)
            return (
              <li key={`${s.from}>${s.to}`} className="swap">
                <div className="swap-main">
                  <div className="swap-title">
                    <span aria-hidden="true">{a.icon}</span> {a.label} <span className="arrow" aria-label="to">→</span> <span aria-hidden="true">{b.icon}</span> {b.label}
                  </div>
                  <div className="muted small">{s.count}× this week ({plural(round(s.amount, 0), a.unit)}). {s.tip}</div>
                </div>
                <div className="swap-save">
                  <strong>−{round(s.saved)} kg</strong>
                  <span className="muted small">per week</span>
                </div>
                <button type="button" className={done ? 'btn ghost small' : 'btn primary small'} aria-pressed={done}
                  onClick={() => (done ? onRemove(s) : onPledge(s))}>
                  {done ? '✓ Pledged' : 'Pledge'}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {pledges.length > 0 && (
        <div className="impact">
          <div><strong>{round(yearly, 0)} kg</strong><span> CO₂e saved per year if you keep your pledges</span></div>
          <div className="muted">≈ the yearly absorption of <strong>{round(treesToOffset(yearly), 1)}</strong> mature trees 🌳</div>
        </div>
      )}
    </section>
  )
}
