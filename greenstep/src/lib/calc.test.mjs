// Run with: node src/lib/calc.test.mjs
import assert from 'node:assert/strict'
import { entryCo2, addDays, toDateKey, series, underBudgetStreak, suggestSwaps, computeBadges } from './calc.js'

const today = '2026-09-24'
assert.equal(addDays('2026-03-01', -1), '2026-02-28')
assert.equal(addDays('2026-12-31', 1), '2027-01-01')
assert.equal(toDateKey(new Date(2026, 0, 5)), '2026-01-05')

assert.ok(Math.abs(entryCo2({ activity: 'car_petrol', amount: 10 }) - 1.71) < 1e-9)
assert.equal(entryCo2({ activity: 'nope', amount: 10 }), 0)
assert.equal(entryCo2({ activity: 'bus', amount: -5 }), 0)

const entries = [
  { id: 1, date: today, activity: 'car_petrol', amount: 20 },
  { id: 2, date: today, activity: 'beef', amount: 1 },
  { id: 3, date: '2026-09-23', activity: 'walk_cycle', amount: 5 },
  { id: 4, date: '2026-09-22', activity: 'vegan', amount: 3 },
]
const s = series(entries, 7, today)
assert.equal(s.length, 7)
assert.equal(s[6].date, today)
assert.ok(Math.abs(s[6].total - (20 * 0.171 + 6.5)) < 1e-9)

// today is over budget (9.92 > 6.3) so streak from today is 0; yesterday's alone is not counted when today has logs
assert.equal(underBudgetStreak(entries, 6.3, today), 0)
assert.equal(underBudgetStreak(entries.filter((e) => e.date !== today), 6.3, today), 2)

const swaps = suggestSwaps(entries, today)
const car = swaps.find((x) => x.from === 'car_petrol')
assert.equal(car.to, 'train') // 20 km exceeds the 4 km cycle cap; train saves more than bus
assert.ok(Math.abs(car.saved - 20 * (0.171 - 0.041)) < 1e-9)
const short = suggestSwaps([{ id: 9, date: today, activity: 'car_petrol', amount: 3 }], today)
assert.equal(short[0].to, 'walk_cycle')
assert.equal(suggestSwaps([{ id: 9, date: '2026-01-01', activity: 'car_petrol', amount: 3 }], today).length, 0)
const b = computeBadges(entries, 6.3, today)
assert.equal(b.find((x) => x.id === 'first').earned, true)
assert.equal(b.find((x) => x.id === 'commuter').earned, false)
console.log('all calc tests passed')
