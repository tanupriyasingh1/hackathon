import { useEffect, useMemo, useState } from 'react'
import LogPanel from './components/LogPanel.jsx'
import Ring from './components/Ring.jsx'
import WeekChart from './components/WeekChart.jsx'
import Swaps from './components/Swaps.jsx'
import Learn from './components/Learn.jsx'
import { ACTIVITIES, BENCHMARKS, CATEGORIES, CATEGORY_ORDER, CATEGORY_COLORS, DEFAULT_BUDGET } from './lib/factors.js'
import { addDays, computeBadges, plural, dayTotals, entryCo2, round, series, sumTotals, suggestSwaps, toDateKey, underBudgetStreak } from './lib/calc.js'
import { loadState, saveState } from './lib/storage.js'
import { sampleWeek } from './lib/sample.js'

const TABS = [['today', 'Today'], ['insights', 'Insights'], ['learn', 'Learn']]
const BUDGET_PRESETS = [['Paris 2030', BENCHMARKS.paris.perDay], ['India avg', BENCHMARKS.india.perDay], ['World avg', BENCHMARKS.world.perDay]]
const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

export default function App() {
  const [state, setState] = useState(() => loadState({ entries: [], pledges: [], budget: DEFAULT_BUDGET }))
  const { entries, pledges, budget } = state
  const [tab, setTab] = useState('today')
  const today = toDateKey()
  const [date, setDate] = useState(today)
  const [toast, setToast] = useState('')

  useEffect(() => saveState(state), [state])
  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const patch = (p) => setState((s) => ({ ...s, ...p }))
  const addEntry = (e) => {
    setState((s) => ({ ...s, entries: [...s.entries, { id: uid(), ...e }] }))
    setToast(`Added ${ACTIVITIES[e.activity].label.toLowerCase()} · ${round(entryCo2(e), 2)} kg CO₂e`)
  }
  const removeEntry = (id) => patch({ entries: entries.filter((e) => e.id !== id) })

  const dayEntries = entries.filter((e) => e.date === date)
  const totals = useMemo(() => dayTotals(entries, date), [entries, date])
  const dayTotal = sumTotals(totals)
  const week = useMemo(() => series(entries, 7, today), [entries, today])
  const weekTotal = week.reduce((s, d) => s + d.total, 0)
  const activeDays = week.filter((d) => d.count > 0).length
  const avg = activeDays ? weekTotal / activeDays : 0
  const swaps = useMemo(() => suggestSwaps(entries, today), [entries, today])
  const streak = underBudgetStreak(entries, budget, today)
  const badges = computeBadges(entries, budget, today)

  const pledge = (s) => patch({ pledges: [...pledges.filter((p) => !(p.from === s.from && p.to === s.to)), { id: uid(), from: s.from, to: s.to, perWeek: s.saved }] })
  const unpledge = (s) => patch({ pledges: pledges.filter((p) => !(p.from === s.from && p.to === s.to)) })

  function copySummary() {
    const text = `My GreenStep week: ${round(weekTotal)} kg CO₂e over ${activeDays} logged days (avg ${round(avg)} kg/day vs a ${round(budget)} kg budget). ${streak} day streak under budget. Track yours to support SDG 13: Climate Action 🌍`
    const done = () => setToast('Summary copied to clipboard')
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, () => setToast(text))
    else setToast(text)
  }

  const isToday = date === today
  const label = isToday ? 'Today' : new Date(date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
  const sortedCats = [...CATEGORY_ORDER].sort((a, b) => totals[b] - totals[a])
  const empty = entries.length === 0

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="top">
        <div className="brand">
          <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="var(--brand)" /><path d="M9 21c0-7 5-11 14-11 0 8-4 13-11 13-1 0-2-.3-3-.9" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" /><path d="M9 23c3-4 6-7 10-9" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
          <div><h1>GreenStep</h1><p>Your personal carbon coach</p></div>
        </div>
        <nav aria-label="Main">
          <div className="tabs" role="tablist">
            {TABS.map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'tab is-active' : 'tab'} onClick={() => setTab(k)}>{l}</button>
            ))}
          </div>
        </nav>
      </header>

      <main id="main">
        {tab === 'today' && (
          <div className="layout">
            <div className="stack">
              {empty && (
                <section className="hero card">
                  <div>
                    <h2>Small choices, measurable climate action 🌍</h2>
                    <p>Log your transport, food, energy and shopping. GreenStep shows your carbon footprint and the swaps that cut it most, built for <strong>SDG 13: Climate Action</strong>.</p>
                  </div>
                  <button className="btn primary" onClick={() => { patch({ entries: sampleWeek(today) }); setTab('insights') }}>Try a sample week</button>
                </section>
              )}
              <LogPanel date={date} onAdd={addEntry} />
            </div>

            <div className="stack">
              <section className="card center" aria-labelledby="day-h">
                <div className="daynav">
                  <button className="btn ghost small" aria-label="Previous day" onClick={() => setDate(addDays(date, -1))}>‹</button>
                  <h2 id="day-h">{label}</h2>
                  <button className="btn ghost small" aria-label="Next day" disabled={isToday} onClick={() => setDate(addDays(date, 1))}>›</button>
                </div>
                <Ring total={dayTotal} budget={budget} />
                <p className="muted small">Daily budget {round(budget)} kg CO₂e · streak <strong>{streak}</strong> {streak === 1 ? 'day' : 'days'} 🔥</p>
                {dayTotal > 0 && (
                  <ul className="mix" aria-label="Breakdown by category">
                    {sortedCats.filter((c) => totals[c] > 0).map((c) => (
                      <li key={c}>
                        <span className="mix-name"><span className="swatch" style={{ background: CATEGORY_COLORS[c] }} />{CATEGORIES[c].label}</span>
                        <span className="mix-bar"><span style={{ width: `${(totals[c] / dayTotal) * 100}%`, background: CATEGORY_COLORS[c] }} /></span>
                        <span className="mix-val">{round(totals[c])} kg</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="card" aria-labelledby="ent-h">
                <h2 id="ent-h">{isToday ? "Today's log" : `Log for ${label}`}</h2>
                {dayEntries.length === 0 ? <p className="empty">Nothing here yet. Add your first activity.</p> : (
                  <ul className="entries">
                    {[...dayEntries].reverse().map((e) => (
                      <li key={e.id}>
                        <span className="e-icon" aria-hidden="true">{ACTIVITIES[e.activity].icon}</span>
                        <span className="e-text">{ACTIVITIES[e.activity].label}<span className="muted small"> · {plural(e.amount, ACTIVITIES[e.activity].unit)}</span></span>
                        <strong>{round(entryCo2(e), 2)} kg</strong>
                        <button className="icon-btn" aria-label={`Delete ${ACTIVITIES[e.activity].label}`} onClick={() => removeEntry(e.id)}>✕</button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        )}

        {tab === 'insights' && (
          <div className="stack wide">
            <section className="stats" aria-label="This week at a glance">
              <div className="stat"><span className="stat-v">{round(weekTotal)}</span><span className="stat-l">kg CO₂e this week</span></div>
              <div className="stat"><span className="stat-v">{activeDays ? round(avg) : '—'}</span><span className="stat-l">avg kg per logged day</span></div>
              <div className="stat"><span className="stat-v">{streak}</span><span className="stat-l">day streak under budget</span></div>
              <div className="stat">
                <span className="stat-v">{activeDays ? `${avg <= BENCHMARKS.world.perDay ? '−' : '+'}${Math.abs(Math.round(((avg - BENCHMARKS.world.perDay) / BENCHMARKS.world.perDay) * 100))}%` : '—'}</span>
                <span className="stat-l">{activeDays && avg <= BENCHMARKS.world.perDay ? 'below' : 'vs'} the world average</span>
              </div>
            </section>

            <section className="card" aria-labelledby="wk-h">
              <div className="between"><h2 id="wk-h">Your last 7 days</h2><button className="btn ghost small" onClick={copySummary}>Copy summary</button></div>
              <WeekChart days={week} budget={budget} />
            </section>

            <Swaps swaps={swaps} pledges={pledges} onPledge={pledge} onRemove={unpledge} />

            <div className="two">
              <section className="card" aria-labelledby="bd-h">
                <h2 id="bd-h">Daily budget</h2>
                <p className="muted small">Your target per day. Pick a preset or set your own.</p>
                <div className="chips">
                  {BUDGET_PRESETS.map(([l, v]) => (
                    <button key={l} className={Math.abs(budget - v) < 0.05 ? 'chip is-active' : 'chip'} onClick={() => patch({ budget: round(v) })}>{l} · {round(v)} kg</button>
                  ))}
                </div>
                <label className="field">
                  <span>Custom: <strong>{round(budget)} kg</strong></span>
                  <input type="range" min="2" max="15" step="0.1" value={budget} onChange={(e) => patch({ budget: Number(e.target.value) })} />
                </label>
              </section>

              <section className="card" aria-labelledby="bg-h">
                <h2 id="bg-h">Badges</h2>
                <ul className="badges">
                  {badges.map((b) => (
                    <li key={b.id} className={b.earned ? 'badge is-earned' : 'badge'}>
                      <span className="badge-icon" aria-hidden="true">{b.icon}</span>
                      <div><strong>{b.title}</strong><div className="muted small">{b.desc}</div></div>
                      <span className="sr-only">{b.earned ? 'Earned' : 'Locked'}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="foot-actions">
              {!empty && <button className="btn ghost small" onClick={() => { if (window.confirm('Delete all logs and pledges on this device?')) patch({ entries: [], pledges: [] }) }}>Reset all data</button>}
              {empty && <button className="btn primary" onClick={() => patch({ entries: sampleWeek(today) })}>Load a sample week</button>}
            </div>
          </div>
        )}

        {tab === 'learn' && <Learn />}
      </main>

      <footer>
        <p>Built for the Acodemic × G.I.R.L.S. Global SDG Hackathon · SDG 13 Climate Action · Your data never leaves your device.</p>
      </footer>
      <div className={toast ? 'toast show' : 'toast'} role="status" aria-live="polite">{toast}</div>
    </>
  )
}
