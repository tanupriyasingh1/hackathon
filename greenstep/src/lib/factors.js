// Approximate emission factors in kg CO2e. Sources: IPCC AR6, UK DEFRA 2023 conversion
// factors, Our World in Data (Poore & Nemecek 2018 for food), IEA grid averages.
// Numbers are rounded, transparent estimates meant for habit-level awareness, not audits.

export const CATEGORIES = {
  transport: { label: 'Transport', unit: 'km', icon: '🚌', hint: 'Distance travelled' },
  food: { label: 'Food', unit: 'meals', icon: '🥗', hint: 'Number of meals' },
  energy: { label: 'Energy', unit: '', icon: '💡', hint: 'Amount used' },
  stuff: { label: 'Stuff', unit: 'items', icon: '🛍️', hint: 'Number of items' },
}

export const CATEGORY_ORDER = ['transport', 'food', 'energy', 'stuff']

// key -> { category, label, factor (kg per unit), unit, step, icon, low (is low-carbon) }
export const ACTIVITIES = {
  // Transport (per km)
  walk_cycle: { category: 'transport', label: 'Walk or cycle', factor: 0, unit: 'km', icon: '🚲', low: true, step: 0.5 },
  ebike: { category: 'transport', label: 'E-bike / e-scooter', factor: 0.02, unit: 'km', icon: '🛴', low: true, step: 0.5 },
  metro: { category: 'transport', label: 'Metro / tram', factor: 0.03, unit: 'km', icon: '🚇', low: true, step: 1 },
  train: { category: 'transport', label: 'Train', factor: 0.041, unit: 'km', icon: '🚆', low: true, step: 1 },
  bus: { category: 'transport', label: 'Bus', factor: 0.089, unit: 'km', icon: '🚌', low: true, step: 1 },
  motorbike: { category: 'transport', label: 'Motorbike', factor: 0.113, unit: 'km', icon: '🏍️', step: 1 },
  car_ev: { category: 'transport', label: 'Electric car', factor: 0.053, unit: 'km', icon: '🔌', step: 1 },
  car_petrol: { category: 'transport', label: 'Petrol / diesel car', factor: 0.171, unit: 'km', icon: '🚗', step: 1 },
  flight: { category: 'transport', label: 'Flight', factor: 0.25, unit: 'km', icon: '✈️', step: 50 },
  // Food (per meal)
  vegan: { category: 'food', label: 'Vegan meal', factor: 0.5, unit: 'meals', icon: '🥦', low: true, step: 1 },
  vegetarian: { category: 'food', label: 'Vegetarian meal', factor: 0.9, unit: 'meals', icon: '🧀', low: true, step: 1 },
  fish: { category: 'food', label: 'Fish meal', factor: 1.6, unit: 'meals', icon: '🐟', step: 1 },
  chicken: { category: 'food', label: 'Chicken meal', factor: 1.8, unit: 'meals', icon: '🍗', step: 1 },
  pork: { category: 'food', label: 'Pork meal', factor: 2.4, unit: 'meals', icon: '🥓', step: 1 },
  beef: { category: 'food', label: 'Beef / lamb meal', factor: 6.5, unit: 'meals', icon: '🥩', step: 1 },
  // Energy
  electricity: { category: 'energy', label: 'Electricity', factor: 0.45, unit: 'kWh', icon: '💡', step: 0.5 },
  ac: { category: 'energy', label: 'Air conditioning', factor: 0.55, unit: 'hours', icon: '❄️', step: 0.5 },
  fan: { category: 'energy', label: 'Fan instead of AC', factor: 0.03, unit: 'hours', icon: '🌀', low: true, step: 0.5 },
  hot_shower: { category: 'energy', label: 'Hot shower (10 min)', factor: 0.6, unit: 'showers', icon: '🚿', step: 1 },
  cold_shower: { category: 'energy', label: 'Short / cool shower', factor: 0.15, unit: 'showers', icon: '💧', low: true, step: 1 },
  // Stuff
  new_clothes: { category: 'stuff', label: 'New clothing item', factor: 8, unit: 'items', icon: '👕', step: 1 },
  secondhand: { category: 'stuff', label: 'Second-hand / repaired', factor: 0.5, unit: 'items', icon: '♻️', low: true, step: 1 },
  plastic: { category: 'stuff', label: 'Single-use plastic', factor: 0.1, unit: 'items', icon: '🥤', step: 1 },
  parcel: { category: 'stuff', label: 'Online parcel', factor: 0.8, unit: 'parcels', icon: '📦', step: 1 },
  trash: { category: 'stuff', label: 'Trash bag to landfill', factor: 1.5, unit: 'bags', icon: '🗑️', step: 1 },
}

// Greener alternatives for an activity. `maxAmount` limits a swap to entries where it is realistic.
export const SWAPS = {
  car_petrol: [
    { to: 'walk_cycle', maxAmount: 4, tip: 'Trips under 4 km are often faster by bike than by car door to door.' },
    { to: 'bus', maxAmount: 40, tip: 'A bus emits about half as much per passenger-km as a petrol car.' },
    { to: 'train', tip: 'Trains are one of the lowest-carbon ways to cover longer distances.' },
  ],
  motorbike: [
    { to: 'bus', tip: 'Public transport cuts emissions per passenger-km.' },
    { to: 'ebike', maxAmount: 8, tip: 'For short hops, an e-bike does the job at a fraction of the emissions.' },
  ],
  car_ev: [{ to: 'bus', tip: 'Even an electric car is beaten by shared transport.' }],
  flight: [{ to: 'train', maxAmount: 1500, tip: 'For trips under ~1,500 km, a train is far cleaner than a flight.' }],
  beef: [
    { to: 'chicken', tip: 'Chicken has around a quarter of the footprint of beef.' },
    { to: 'vegetarian', tip: 'A vegetarian meal has about 1/7th of the footprint of beef.' },
  ],
  pork: [{ to: 'vegetarian', tip: 'Going vegetarian for this meal cuts its footprint by more than half.' }],
  chicken: [{ to: 'vegetarian', tip: 'Plant-rich meals halve the footprint again.' }],
  fish: [{ to: 'vegan', tip: 'Plant-based meals are the lowest-carbon option.' }],
  ac: [{ to: 'fan', tip: 'A fan uses around a twentieth of the energy of an AC. Try AC only at peak heat.' }],
  hot_shower: [{ to: 'cold_shower', tip: 'A shorter, cooler shower saves hot-water energy every day.' }],
  new_clothes: [{ to: 'secondhand', tip: 'Buying second-hand or repairing avoids most manufacturing emissions.' }],
}

// Reference points, in kg CO2e per person per day (annual tonnes / 365).
export const BENCHMARKS = {
  world: { label: 'World average', perDay: 4.7 * 1000 / 365 }, // ~12.9
  india: { label: 'India average', perDay: 2.0 * 1000 / 365 }, // ~5.5
  paris: { label: 'Paris-aligned 2030 target', perDay: 2.3 * 1000 / 365 }, // ~6.3 (illustrative budget)
}

export const DEFAULT_BUDGET = 6.3 // kg CO2e per day

// A mature tree absorbs roughly 21 kg CO2 per year.
export const KG_PER_TREE_YEAR = 21
// Charging a smartphone from empty ~ 0.008 kg CO2e
export const KG_PER_PHONE_CHARGE = 0.008

export const CATEGORY_COLORS = {
  transport: 'var(--series-1)',
  food: 'var(--series-2)',
  energy: 'var(--series-3)',
  stuff: 'var(--series-4)',
}
