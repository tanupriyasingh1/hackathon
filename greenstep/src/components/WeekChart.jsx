import { useState } from 'react'
import { CATEGORIES, CATEGORY_ORDER, CATEGORY_COLORS } from '../lib/factors.js'
import { round } from '../lib/calc.js'

const W = 640, H = 270, M = { l: 38, r: 12, t: 22, b: 30 }
const dayName = (key) => new Date(key + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short' })
const niceMax = (v) => { const steps = [4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 60, 80, 100]; return steps.find((s) => s >= v) ?? Math.ceil(v / 10) * 10 }

/** Rect with only the top corners rounded (data end); bottoms sit square on the baseline. */
function topRounded(x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h)
  return `M${x},${y + h} V${y + rr} Q${x},${y} ${x + rr},${y} H${x + w - rr} Q${x + w},${y} ${x + w},${y + rr} V${y + h} Z`
}

export default function WeekChart({ days, budget }) {
  const [hover, setHover] = useState(null)
  const [table, setTable] = useState(false)
  const max = niceMax(Math.max(budget * 1.15, ...days.map((d) => d.total)))
  const iw = W - M.l - M.r, ih = H - M.t - M.b
  const slot = iw / days.length
  const bw = Math.min(46, slot * 0.6)
  const y = (v) => M.t + ih - (v / max) * ih
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i)
  const hd = hover !== null ? days[hover] : null

  return (
    <div className="chart">
      <div className="chart-head">
        <ul className="legend" aria-label="Legend">
          {CATEGORY_ORDER.map((c) => (
            <li key={c}><span className="swatch" style={{ background: CATEGORY_COLORS[c] }} />{CATEGORIES[c].label}</li>
          ))}
          <li><span className="swatch dash" />Daily budget ({round(budget)} kg)</li>
        </ul>
        <button type="button" className="btn ghost small" onClick={() => setTable((t) => !t)} aria-pressed={table}>
          {table ? 'Show chart' : 'View as table'}
        </button>
      </div>

      {table ? (
        <div className="table-wrap">
          <table>
            <caption className="sr-only">Daily footprint by category in kilograms CO₂e</caption>
            <thead><tr><th>Day</th>{CATEGORY_ORDER.map((c) => <th key={c}>{CATEGORIES[c].label}</th>)}<th>Total</th></tr></thead>
            <tbody>
              {days.map((d) => (
                <tr key={d.date}><th scope="row">{dayName(d.date)} {d.date.slice(5)}</th>
                  {CATEGORY_ORDER.map((c) => <td key={c}>{round(d.totals[c])}</td>)}<td><strong>{round(d.total)}</strong></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="chart-box">
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Bar chart of daily CO2e for the last ${days.length} days. Budget ${round(budget)} kilograms per day.`} onMouseLeave={() => setHover(null)}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={M.l} x2={W - M.r} y1={y(t)} y2={y(t)} className="grid" />
                <text x={M.l - 8} y={y(t) + 4} textAnchor="end" className="axis">{round(t, 0)}</text>
              </g>
            ))}
            {days.map((d, i) => {
              const cx = M.l + slot * i + slot / 2
              const x = cx - bw / 2
              let acc = 0
              const segs = CATEGORY_ORDER.filter((c) => d.totals[c] > 0)
              return (
                <g key={d.date} tabIndex={0} onFocus={() => setHover(i)} onBlur={() => setHover(null)}
                  aria-label={`${dayName(d.date)}: ${round(d.total)} kilograms`} className={hover === i ? 'bar is-hover' : 'bar'}>
                  {segs.map((c, si) => {
                    const h = (d.totals[c] / max) * ih
                    const top = M.t + ih - acc - h
                    acc += h
                    const isTop = si === segs.length - 1
                    return isTop
                      ? <path key={c} d={topRounded(x, top, bw, h, 4)} fill={CATEGORY_COLORS[c]} className="bar-seg" />
                      : <rect key={c} x={x} y={top} width={bw} height={h} fill={CATEGORY_COLORS[c]} className="bar-seg" />
                  })}
                  {d.total > 0 && <text x={cx} y={y(d.total) - 6} textAnchor="middle" className="val">{round(d.total)}</text>}
                  <text x={cx} y={H - 9} textAnchor="middle" className="axis">{dayName(d.date)}</text>
                  <rect x={M.l + slot * i} y={M.t} width={slot} height={ih + M.b} fill="transparent" onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} />
                </g>
              )
            })}
            <line x1={M.l} x2={W - M.r} y1={y(budget)} y2={y(budget)} className="budget-line" />
          </svg>
          {hd && (
            <div className="tip" style={{ left: `${((M.l + slot * hover + slot / 2) / W) * 100}%` }} role="status">
              <strong>{dayName(hd.date)} {hd.date.slice(5)}</strong>
              {hd.total === 0 ? <div className="muted">No logs</div> : CATEGORY_ORDER.map((c) => (
                <div key={c} className="tip-row"><span className="swatch" style={{ background: CATEGORY_COLORS[c] }} />{CATEGORIES[c].label}<b>{round(hd.totals[c])}</b></div>
              ))}
              {hd.total > 0 && <div className="tip-row total">Total<b>{round(hd.total)} kg</b></div>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
