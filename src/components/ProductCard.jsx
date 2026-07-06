import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Star, MessageCircle } from 'lucide-react'
import { whatsappLink } from '../data/config'
import ProductImage from './ProductImage'

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.2 } },
}

const ProductCard = forwardRef(function ProductCard({ product }, ref) {
  return (
    <motion.div
      ref={ref}
      layout
      variants={item}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-marina-blue/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-pop"
    >
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-marina-blue/5">
        <motion.div
          className="h-full w-full"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        >
          <ProductImage product={product} className="h-full w-full" />
        </motion.div>
        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-marina-ink/80 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white">
            Out of stock
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-marina-indigo shadow-sm">
          {product.category}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-marina-red">{product.brand}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="line-clamp-2 min-h-[2.7em] font-display text-base font-semibold text-marina-blue">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 text-amber-500">
          <Star size={14} fill="currentColor" strokeWidth={0} />
          <span className="text-xs font-semibold text-marina-blue/70">
            {product.rating} <span className="text-marina-blue/40">({product.reviews})</span>
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg font-bold text-marina-blue">₹{product.price.toLocaleString('en-IN')}</span>
          <a
            href={whatsappLink(`Hi, I'd like to enquire about ${product.name} (${product.brand}).`)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-marina-blue px-3 py-1.5 text-xs font-bold text-white transition hover:bg-marina-red"
          >
            <MessageCircle size={13} /> Enquire
          </a>
        </div>
      </div>
    </motion.div>
  )
})

export default ProductCard
