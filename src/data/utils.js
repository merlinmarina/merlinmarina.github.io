export function priceToNumber(raw) {
  const nums = raw.replace(/[₹,]/g, '').match(/\d+(\.\d+)?/g) || ['0']
  const vals = nums.map(Number)
  const min = Math.min(...vals)
  const max = raw.includes('+') ? min * 1.25 : Math.max(...vals)
  return Math.round((min + max) / 2 / 10) * 10
}

// Small deterministic hash so the same product always gets the same
// "random" rating/stock/image instead of reshuffling on every render.
export function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}
