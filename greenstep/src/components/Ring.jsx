import { round } from '../lib/calc.js'

/** Progress ring: today's footprint against the daily budget. Status is text + icon, never colour alone. */
export default function Ring({ total, budget }) {
  const r = 70
  const c = 2 * Math.PI * r
  const ratio = budget > 0 ? total / budget : 0
  const shown = Math.min(ratio, 1)
  const over = total > budget
  const empty = total === 0
  return (
    <div className="ring" role="img" aria-label={`${round(total)} of ${round(budget)} kilograms CO2e daily budget used`}>
      <svg viewBox="0 0 180 180" width="180" height="180" aria-hidden="true">
        <circle cx="90" cy="90" r={r} className="ring-track" />
        <circle
          cx="90" cy="90" r={r}
          className={`ring-fill ${over ? 'is-over' : 'is-ok'}`}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown)}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div className="ring-center">
        <span className="ring-value">{round(total)}</span>
        <span className="ring-unit">kg CO₂e</span>
        <span className={`ring-status ${empty ? '' : over ? 'is-over' : 'is-ok'}`}>
          {empty ? 'Nothing logged' : over ? `▲ ${round(total - budget)} over` : `✓ ${round(budget - total)} left`}
        </span>
      </div>
    </div>
  )
}
