import { ACTIVITIES, SWAPS, CATEGORY_ORDER, KG_PER_TREE_YEAR } from './factors.js'

/** '1 meal' / '3 meals' from a plural unit like 'meals'. */
export const plural = (n, unit) => `${n} ${Number(n) === 1 && unit.endsWith('s') ? unit.slice(0, -1) : unit}`

export const round = (n, d = 1) => Math.round(n * 10 ** d) / 10 ** d

/** kg CO2e for one logged entry. Unknown activity keys are treated as zero. */
export function entryCo2(entry) {
  const a = ACTIVITIES[entry.activity]
  if (!a) return 0
  return Math.max(0, Number(entry.amount) || 0) * a.factor
}

/** Local date -> 'YYYY-MM-DD' (avoids the UTC shift of toISOString). */
export function toDateKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(dateKey, delta) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return toDateKey(new Date(y, m - 1, d + delta))
}

export function lastNDays(n, today = toDateKey()) {
  return Array.from({ length: n }, (_, i) => addDays(today, i - (n - 1)))
}

export function emptyTotals() {
  return Object.fromEntries(CATEGORY_ORDER.map((c) => [c, 0]))
}

/** Totals per category for one date. */
export function dayTotals(entries, dateKey) {
  const totals = emptyTotals()
  for (const e of entries) {
    if (e.date !== dateKey) continue
    const a = ACTIVITIES[e.activity]
    if (a) totals[a.category] += entryCo2(e)
  }
  return totals
}

export const sumTotals = (t) => CATEGORY_ORDER.reduce((s, c) => s + t[c], 0)

/** [{date, totals, total, count}] for the last n days. */
export function series(entries, n = 7, today = toDateKey()) {
  return lastNDays(n, today).map((date) => {
    const totals = dayTotals(entries, date)
    return { date, totals, total: sumTotals(totals), count: entries.filter((e) => e.date === date).length }
  })
}

/** Consecutive days (ending today, or yesterday if today has no logs yet) with logs AND total <= budget. */
export function underBudgetStreak(entries, budget, today = toDateKey()) {
  const has = (d) => entries.some((e) => e.date === d)
  let cursor = has(today) ? today : addDays(today, -1)
  let streak = 0
  while (has(cursor) && sumTotals(dayTotals(entries, cursor)) <= budget) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

/**
 * Personalised swap suggestions from the last 7 days of logs.
 * For each entry with a realistic greener alternative we take the best applicable one and
 * group by (from -> to). Savings are the real kg CO2e saved had every such entry been swapped.
 */
export function suggestSwaps(entries, today = toDateKey()) {
  const window = new Set(lastNDays(7, today))
  const groups = new Map()
  for (const e of entries) {
    if (!window.has(e.date)) continue
    const options = SWAPS[e.activity]
    if (!options) continue
    const amount = Number(e.amount) || 0
    const current = entryCo2(e)
    let best = null
    for (const opt of options) {
      if (opt.maxAmount !== undefined && amount > opt.maxAmount) continue
      const alt = ACTIVITIES[opt.to]
      const saved = current - amount * alt.factor
      if (saved > 0 && (!best || saved > best.saved)) best = { opt, saved }
    }
    if (!best) continue
    const key = `${e.activity}>${best.opt.to}`
    const g = groups.get(key) ?? { from: e.activity, to: best.opt.to, tip: best.opt.tip, count: 0, amount: 0, saved: 0, current: 0 }
    g.count += 1
    g.amount += amount
    g.saved += best.saved
    g.current += current
    groups.set(key, g)
  }
  return [...groups.values()].sort((a, b) => b.saved - a.saved)
}

export function treesToOffset(kgPerYear) {
  return kgPerYear / KG_PER_TREE_YEAR
}

/** Which badges has the user earned? */
export function computeBadges(entries, budget, today = toDateKey()) {
  const days = [...new Set(entries.map((e) => e.date))]
  const streak = underBudgetStreak(entries, budget, today)
  const lowTrips = entries.filter((e) => ACTIVITIES[e.activity]?.category === 'transport' && ACTIVITIES[e.activity].low && e.amount > 0).length
  const meatFreeDay = days.some((d) => {
    const food = entries.filter((e) => e.date === d && ACTIVITIES[e.activity]?.category === 'food')
    return food.length >= 2 && food.every((e) => ['vegan', 'vegetarian'].includes(e.activity))
  })
  return [
    { id: 'first', icon: '🌱', title: 'First step', desc: 'Log your first activity', earned: entries.length > 0 },
    { id: 'streak3', icon: '🔥', title: 'On a roll', desc: '3 days under budget in a row', earned: streak >= 3 },
    { id: 'meatfree', icon: '🥗', title: 'Plant-powered day', desc: 'A day of 2+ plant-based meals', earned: meatFreeDay },
    { id: 'commuter', icon: '🚲', title: 'Green commuter', desc: '5 low-carbon trips logged', earned: lowTrips >= 5 },
  ]
}
