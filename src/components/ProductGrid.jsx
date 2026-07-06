import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export default function ProductGrid({ products, emptyMessage = 'No products match your filters yet.' }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-marina-blue/20 bg-marina-blue/5 py-20 text-center">
        <p className="font-display text-lg font-semibold text-marina-blue">{emptyMessage}</p>
        <p className="mt-1 text-sm text-marina-blue/60">Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <motion.div
      layout
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4"
    >
      <AnimatePresence mode="popLayout">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
