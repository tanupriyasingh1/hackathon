import { addDays, toDateKey } from './calc.js'

let n = 0
const mk = (date, activity, amount) => ({ id: `s${Date.now()}${n++}`, date, activity, amount })

/** A believable, slightly car-and-beef-heavy week so the coach has something to suggest. */
export function sampleWeek(today = toDateKey()) {
  const d = (i) => addDays(today, -i)
  return [
    mk(d(6), 'car_petrol', 12), mk(d(6), 'beef', 1), mk(d(6), 'chicken', 1), mk(d(6), 'ac', 4), mk(d(6), 'plastic', 3),
    mk(d(5), 'bus', 10), mk(d(5), 'vegetarian', 2), mk(d(5), 'chicken', 1), mk(d(5), 'electricity', 5), mk(d(5), 'hot_shower', 1),
    mk(d(4), 'car_petrol', 3), mk(d(4), 'pork', 1), mk(d(4), 'vegetarian', 1), mk(d(4), 'ac', 3), mk(d(4), 'parcel', 1),
    mk(d(3), 'walk_cycle', 3), mk(d(3), 'vegan', 2), mk(d(3), 'chicken', 1), mk(d(3), 'electricity', 4), mk(d(3), 'secondhand', 1),
    mk(d(2), 'car_petrol', 18), mk(d(2), 'beef', 1), mk(d(2), 'fish', 1), mk(d(2), 'ac', 5), mk(d(2), 'hot_shower', 1), mk(d(2), 'new_clothes', 1),
    mk(d(1), 'metro', 14), mk(d(1), 'vegetarian', 2), mk(d(1), 'chicken', 1), mk(d(1), 'electricity', 6), mk(d(1), 'trash', 1),
    mk(d(0), 'car_petrol', 6), mk(d(0), 'chicken', 1), mk(d(0), 'vegetarian', 1), mk(d(0), 'ac', 2),
  ]
}
