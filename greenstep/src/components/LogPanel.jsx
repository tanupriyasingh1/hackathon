import { useMemo, useState } from 'react'
import { ACTIVITIES, CATEGORIES, CATEGORY_ORDER } from '../lib/factors.js'
import { entryCo2, plural, round } from '../lib/calc.js'

const PRESETS = [
  { activity: 'bus', amount: 10 },
  { activity: 'car_petrol', amount: 10 },
  { activity: 'walk_cycle', amount: 3 },
  { activity: 'vegetarian', amount: 1 },
  { activity: 'chicken', amount: 1 },
  { activity: 'ac', amount: 2 },
]

export default function LogPanel({ date, onAdd }) {
  const [category, setCategory] = useState('transport')
  const [activity, setActivity] = useState('car_petrol')
  const [amount, setAmount] = useState('')

  const options = useMemo(() => Object.entries(ACTIVITIES).filter(([, a]) => a.category === category), [category])
  const current = ACTIVITIES[activity]
  const value = Number(amount)
  const valid = Number.isFinite(value) && value > 0 && value <= 100000
  const preview = valid ? entryCo2({ activity, amount: value }) : 0

  function pickCategory(cat) {
    setCategory(cat)
    const first = Object.entries(ACTIVITIES).find(([, a]) => a.category === cat)
    setActivity(first[0])
    setAmount('')
  }

  function submit(e) {
    e.preventDefault()
    if (!valid) return
    onAdd({ activity, amount: value, date })
    setAmount('')
  }

  return (
    <section className="card" aria-labelledby="log-h">
      <h2 id="log-h">Log an activity</h2>

      <div className="chips" aria-label="Quick add">
        {PRESETS.map((p) => (
          <button key={p.activity} type="button" className="chip" onClick={() => onAdd({ ...p, date })}>
            <span aria-hidden="true">{ACTIVITIES[p.activity].icon}</span> {ACTIVITIES[p.activity].label} · {plural(p.amount, ACTIVITIES[p.activity].unit)}
          </button>
        ))}
      </div>

      <div className="seg" role="radiogroup" aria-label="Category">
        {CATEGORY_ORDER.map((c) => (
          <button
            key={c} type="button" role="radio" aria-checked={category === c}
            className={category === c ? 'seg-btn is-active' : 'seg-btn'} onClick={() => pickCategory(c)}
          >
            <span aria-hidden="true">{CATEGORIES[c].icon}</span> {CATEGORIES[c].label}
          </button>
        ))}
      </div>

      <form onSubmit={submit}>
        <div className="grid-opts" role="radiogroup" aria-label="Activity">
          {options.map(([key, a]) => (
            <button
              key={key} type="button" role="radio" aria-checked={activity === key}
              className={activity === key ? 'opt is-active' : 'opt'} onClick={() => setActivity(key)}
            >
              <span className="opt-icon" aria-hidden="true">{a.icon}</span>
              <span className="opt-label">{a.label}</span>
              <span className="opt-sub">{a.factor === 0 ? '0' : a.factor} kg / {a.unit.replace(/s$/, '')}</span>
            </button>
          ))}
        </div>

        <div className="row">
          <label className="field">
            <span>How many {current.unit}?</span>
            <input
              type="number" inputMode="decimal" min="0" step={current.step} value={amount}
              onChange={(e) => setAmount(e.target.value)} placeholder={`e.g. ${current.step >= 50 ? 500 : 5}`}
            />
          </label>
          <div className="preview" aria-live="polite">
            <span className="preview-label">This adds</span>
            <span className="preview-value">{valid ? `${round(preview, 2)} kg CO₂e` : '—'}</span>
          </div>
          <button className="btn primary" type="submit" disabled={!valid}>Add</button>
        </div>
      </form>
    </section>
  )
}
