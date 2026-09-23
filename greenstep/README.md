# GreenStep: your personal carbon coach 🌍

**Acodemic × G.I.R.L.S. Global SDG Hackathon submission · SDG 13: Climate Action**

GreenStep turns invisible daily emissions into a number you can see, and then tells you the *one swap* that would cut your footprint the most. Log a bus ride, a beef burger or an evening with the AC on, and GreenStep shows your carbon footprint, tracks it against a daily budget, and recommends personalised swaps based on what **you** actually did this week.

## The problem

Climate change is driven by billions of small daily decisions, but almost nobody can see the carbon cost of a commute, a lunch or a night with the air conditioning on. Without feedback, there is no learning loop. Most carbon calculators are long annual surveys that people fill in once and forget.

## The idea

A 10-second daily habit tracker with a coach built in:

1. **Log** activities across transport, food, energy and shopping (with one-tap quick adds).
2. **See** today's footprint against a daily CO₂e budget (a Paris-aligned default of 6.3 kg, adjustable to India or world averages).
3. **Learn** from the 7-day chart, which shows which category dominates.
4. **Swap.** The coach scans your real logs, finds the swaps that would have saved the most (e.g. *petrol car → train for your 36 km of trips = −4.7 kg this week*), and lets you **pledge** them. Pledges are converted into yearly savings and tree-equivalents.
5. **Stay motivated** with a streak counter and badges.

## SDG alignment

| SDG | How GreenStep contributes |
|---|---|
| **13. Climate Action** (main) | Target 13.3, improving education and awareness on climate change mitigation, by making personal emissions visible and actionable. |
| 12. Responsible Consumption | Food, shopping and waste swaps (second-hand over new, plant-rich meals, less single-use plastic). |
| 11. Sustainable Cities | Nudges toward public transport, cycling and walking. |

## Why it is different

- **Feedback, not a form.** It is a daily loop, not a one-off annual quiz.
- **Personalised swaps from real behaviour.** Suggestions are computed from your own last 7 days of logs, with realistic constraints (a 4 km cap for "cycle instead of drive", a 1,500 km cap for "train instead of fly").
- **Privacy first.** No accounts and no servers. Everything stays in your browser's local storage.
- **Accessible.** Keyboard operable, screen-reader labels, a table view of the chart, status shown by text and icon (never colour alone), light and dark themes, and a colour-blind-safe validated chart palette.
- **Works offline and on phones.** Fully responsive.

## Features

- Activity logger with 24 activities across 4 categories, plus quick-add chips and a live CO₂e preview
- Daily progress ring against an adjustable budget, with under/over status as text
- 7-day stacked bar chart with hover/focus tooltips and a "view as table" toggle
- Personalised swap engine with pledges, yearly savings and tree equivalents
- Under-budget streak and 4 badges
- Day navigation to back-fill earlier days
- One-click shareable weekly summary
- Sample-week demo data so judges can see everything instantly
- Learn tab with SDG 13 context, benchmarks and a method and honesty note

## Tech stack

React 19 · Vite 8 · plain CSS (custom properties, light and dark theme) · hand-built SVG charts · `localStorage` · oxlint. No backend and no external runtime services.

Emission factors are rounded, transparent estimates from IPCC AR6, UK DEFRA conversion factors, IEA grid averages and Poore & Nemecek (2018) via Our World in Data. They are meant for comparing choices, not for audits. See `src/lib/factors.js`.

## Run it locally

```bash
cd greenstep
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
node src/lib/calc.test.mjs   # unit tests for the calculation engine
```

## Deploy (get your public project link)

Pick one, all are free:

- **Netlify Drop:** run `npm run build`, then drag the `dist/` folder onto https://app.netlify.com/drop
- **Vercel:** import the GitHub repo. It auto-detects Vite.
- **GitHub Pages:** push to GitHub, run `npm run build`, and publish `dist/` (the build uses relative paths, so any sub-path works).

## Devpost submission checklist

- [ ] Public project link (deploy as above)
- [ ] Project description: copy the sections above (problem, idea, SDG alignment)
- [ ] 3+ screenshots: ready in `screenshots/`
- [ ] Source code: push this folder to a public GitHub repo
- [ ] Tech list: see "Tech stack"
- [ ] Demo video (optional, 1-5 min): see the script below

### 90-second demo script

1. (0:00) "Most people can't see their carbon footprint, so they can't change it. This is GreenStep, built for SDG 13."
2. (0:10) Click **Try a sample week** and show the 7-day chart. Hover a day for the breakdown.
3. (0:30) Show the swaps: "It found that swapping petrol-car trips for the train would save 4.7 kg this week." Click **Pledge** and show the yearly savings and tree equivalent.
4. (0:50) Go to **Today**, log a beef meal, and watch the ring go over budget.
5. (1:10) Show the **Learn** tab and the dark mode, mention privacy and accessibility, then close on the impact statement.

## Ideas for the future

Country-specific electricity grid factors, team and school challenges, and a receipt or barcode scanner for the shopping category.
