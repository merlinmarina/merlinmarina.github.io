import aquariumCatalog from './catalog.generated.json'
import { extraProducts } from './extraProducts'
import { priceToNumber, hashString } from './utils'

const finalizeExtra = (p) => ({
  ...p,
  price: priceToNumber(p.priceRange),
})

const withMeta = (p) => {
  const h = hashString(p.id)
  return {
    ...p,
    rating: Math.round((3.6 + (h % 15) / 10) * 10) / 10,
    reviews: 8 + (h % 240),
    inStock: h % 11 !== 0,
  }
}

export const products = [
  ...aquariumCatalog,
  ...extraProducts.map(finalizeExtra),
].map(withMeta)

export const brands = [...new Set(products.map((p) => p.brand))].sort()

export const priceBounds = products.reduce(
  (acc, p) => ({ min: Math.min(acc.min, p.price), max: Math.max(acc.max, p.price) }),
  { min: Infinity, max: 0 }
)

export const getProductsByGroup = (group) => products.filter((p) => p.group === group)

export const getProductById = (id) => products.find((p) => p.id === id)
