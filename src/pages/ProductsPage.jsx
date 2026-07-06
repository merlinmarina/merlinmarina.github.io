import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import ProductGrid from '../components/ProductGrid'
import { products, brands, priceBounds } from '../data/products'
import { categories } from '../data/categories'

function FilterPanel({ selectedCats, toggleCat, selectedBrands, toggleBrand, price, setPrice, onClear }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-marina-blue">Filters</h3>
        <button onClick={onClear} className="text-xs font-semibold text-marina-red hover:underline">
          Clear all
        </button>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wide text-marina-blue/50">Category</h4>
        {categories.map((group) => (
          <div key={group.slug} className="mb-3">
            <p className="mb-1.5 text-[0.7rem] font-bold uppercase text-marina-red/80">{group.name}</p>
            <div className="space-y-1.5">
              {group.subcategories.map((sub) => (
                <label key={sub} className="flex cursor-pointer items-center gap-2 text-sm text-marina-blue/80">
                  <input
                    type="checkbox"
                    checked={selectedCats.includes(sub)}
                    onChange={() => toggleCat(sub)}
                    className="h-4 w-4 rounded border-marina-blue/30 text-marina-red focus:ring-marina-red"
                  />
                  {sub}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wide text-marina-blue/50">Price Range</h4>
        <div className="flex items-center gap-3 text-sm text-marina-blue/80">
          <span>₹{price[0]}</span>
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            step={10}
            value={price[1]}
            onChange={(e) => setPrice([price[0], Number(e.target.value)])}
            className="flex-1 accent-marina-red"
          />
          <span>₹{price[1]}</span>
        </div>
        <div className="mt-1 text-xs text-marina-blue/40">Up to ₹{price[1].toLocaleString('en-IN')}</div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wide text-marina-blue/50">Brand</h4>
        <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1 scrollbar-thin">
          {brands.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-2 text-sm text-marina-blue/80">
              <input
                type="checkbox"
                checked={selectedBrands.includes(b)}
                onChange={() => toggleBrand(b)}
                className="h-4 w-4 rounded border-marina-blue/30 text-marina-red focus:ring-marina-red"
              />
              {b}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [selectedCats, setSelectedCats] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [price, setPrice] = useState([priceBounds.min, priceBounds.max])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const toggleCat = (sub) =>
    setSelectedCats((prev) => (prev.includes(sub) ? prev.filter((c) => c !== sub) : [...prev, sub]))
  const toggleBrand = (b) =>
    setSelectedBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]))
  const clearFilters = () => {
    setSelectedCats([])
    setSelectedBrands([])
    setPrice([priceBounds.min, priceBounds.max])
    setSearch('')
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
      const matchesCat = selectedCats.length === 0 || selectedCats.includes(p.category)
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand)
      const matchesPrice = p.price >= price[0] && p.price <= price[1]
      return matchesSearch && matchesCat && matchesBrand && matchesPrice
    })
  }, [search, selectedCats, selectedBrands, price])

  const activeFilterCount = selectedCats.length + selectedBrands.length + (price[1] !== priceBounds.max ? 1 : 0)

  return (
    <PageTransition>
      <section className="bg-marina-blue/5 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="font-display text-3xl font-extrabold uppercase text-marina-blue sm:text-4xl">All Products</h1>
          <p className="mt-2 text-sm text-marina-blue/60">{products.length} products across every category, curated for your fins and feathers.</p>

          <div className="mt-6 flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-marina-blue/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products or brands…"
                className="w-full rounded-full border border-marina-blue/15 bg-white py-3 pl-11 pr-4 text-sm text-marina-blue shadow-sm outline-none focus:border-marina-red"
              />
            </div>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 rounded-full bg-marina-blue px-5 py-3 text-sm font-bold text-white lg:hidden"
            >
              <SlidersHorizontal size={16} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl gap-10 px-6 py-10 lg:grid lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-marina-blue/10 bg-white p-6">
            <FilterPanel
              selectedCats={selectedCats}
              toggleCat={toggleCat}
              selectedBrands={selectedBrands}
              toggleBrand={toggleBrand}
              price={price}
              setPrice={setPrice}
              onClear={clearFilters}
            />
          </div>
        </aside>

        <div>
          <ProductGrid products={filtered} />
        </div>
      </section>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm overflow-y-auto bg-white p-6 shadow-2xl lg:hidden"
            >
              <button
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="mb-4 ml-auto flex"
              >
                <X size={22} />
              </button>
              <FilterPanel
                selectedCats={selectedCats}
                toggleCat={toggleCat}
                selectedBrands={selectedBrands}
                toggleBrand={toggleBrand}
                price={price}
                setPrice={setPrice}
                onClear={clearFilters}
              />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-8 w-full rounded-full bg-marina-red py-3 text-sm font-bold text-white"
              >
                Show {filtered.length} results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
