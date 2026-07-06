import { useMemo, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import ProductGrid from '../components/ProductGrid'
import { getCategory } from '../data/categories'
import { getProductsByGroup } from '../data/products'

export default function CategoryPage() {
  const { slug } = useParams()
  const category = getCategory(slug)
  const [activeSub, setActiveSub] = useState('All')

  const allProducts = useMemo(() => (category ? getProductsByGroup(category.slug) : []), [category])

  const filtered = useMemo(
    () => (activeSub === 'All' ? allProducts : allProducts.filter((p) => p.category === activeSub)),
    [allProducts, activeSub]
  )

  if (!category) return <Navigate to="/products" replace />

  return (
    <PageTransition>
      <section className="relative overflow-hidden bg-marina-hero py-20">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-marina-red/30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">
            <Link to="/" className="hover:underline">Home</Link> / {category.name}
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold uppercase sm:text-5xl">{category.name}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 sm:text-base">{category.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveSub('All')}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              activeSub === 'All' ? 'bg-marina-blue text-white' : 'bg-marina-blue/5 text-marina-blue/70 hover:bg-marina-blue/10'
            }`}
          >
            All ({allProducts.length})
          </button>
          {category.subcategories.map((sub) => {
            const count = allProducts.filter((p) => p.category === sub).length
            if (!count) return null
            return (
              <button
                key={sub}
                onClick={() => setActiveSub(sub)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  activeSub === sub ? 'bg-marina-blue text-white' : 'bg-marina-blue/5 text-marina-blue/70 hover:bg-marina-blue/10'
                }`}
              >
                {sub} ({count})
              </button>
            )
          })}
        </div>

        <motion.div layout>
          <ProductGrid products={filtered} emptyMessage="No products in this sub-category yet." />
        </motion.div>
      </section>
    </PageTransition>
  )
}
