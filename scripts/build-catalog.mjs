import fs from 'node:fs'

// One-time generator: turns the raw Amazon research CSV into a clean JSON
// catalog fragment. Run with `node scripts/build-catalog.mjs`. The output is
// hand-merged into src/data/products.js alongside authored categories that
// aren't in the CSV (Aquarium Toys, Avian Friends).
function parseCsvLine(line) {
  const out = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        cur += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      out.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  out.push(cur)
  return out
}

function priceToNumber(raw) {
  const nums = raw.replace(/[₹,]/g, '').match(/\d+(\.\d+)?/g) || ['0']
  const vals = nums.map(Number)
  const min = Math.min(...vals)
  const max = raw.includes('+') ? min * 1.25 : Math.max(...vals)
  return Math.round((min + max) / 2 / 10) * 10
}

const groupByCategory = {
  'Fish Food': 'food-toys',
  Tanks: 'tanks-filters',
  Filters: 'tanks-filters',
  'Motors/Pumps': 'tanks-filters',
  Lights: 'tanks-filters',
  Heaters: 'tanks-filters',
  'CO2 Systems': 'tanks-filters',
  'Test Kits': 'tanks-filters',
}

const raw = fs.readFileSync(new URL('../src/data/raw_aquarium_products.csv', import.meta.url), 'utf8')
  .replace(/^﻿/, '')
const lines = raw.split(/\r?\n/).filter(Boolean)
const rows = lines.slice(1).map(parseCsvLine)

const products = rows.map(([category, brand, name, priceRange, , notes], i) => ({
  id: `aq-${i + 1}`,
  name,
  brand,
  category,
  group: groupByCategory[category] ?? 'tanks-filters',
  price: priceToNumber(priceRange),
  priceRange: priceRange.trim(),
  description: notes?.trim() || `${name} by ${brand}.`,
}))

fs.writeFileSync(
  new URL('../src/data/catalog.generated.json', import.meta.url),
  JSON.stringify(products, null, 2) + '\n'
)

console.log(`Wrote ${products.length} products to src/data/catalog.generated.json`)
