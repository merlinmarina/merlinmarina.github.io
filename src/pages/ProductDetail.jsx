import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, MessageCircle, ArrowLeft } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import ProductGrid from '../components/ProductGrid'
import { getProductById, getProductsByGroup } from '../data/products'
import { getCategory } from '../data/categories'
import { whatsappLink } from '../data/config'
import ProductImage from '../components/ProductImage'

export default function ProductDetail() {
  const { id } = useParams()
  const product = getProductById(id)

  if (!product) return <Navigate to="/products" replace />

  const category = getCategory(product.group)
  const related = getProductsByGroup(product.group)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-marina-blue/60 hover:text-marina-red">
          <ArrowLeft size={16} /> Back to all products
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="aspect-square overflow-hidden rounded-3xl bg-marina-blue/5"
          >
            <ProductImage product={product} className="h-full w-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {category && (
              <p className="text-xs font-bold uppercase tracking-widest text-marina-red">
                <Link to={`/category/${category.slug}`} className="hover:underline">{category.name}</Link> / {product.category}
              </p>
            )}
            <h1 className="mt-3 font-display text-3xl font-extrabold text-marina-blue sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-marina-blue/50">{product.brand}</p>

            <div className="mt-4 flex items-center gap-2 text-amber-500">
              <Star size={18} fill="currentColor" strokeWidth={0} />
              <span className="text-sm font-semibold text-marina-blue/70">
                {product.rating} rating &middot; {product.reviews} reviews
              </span>
            </div>

            <p className="mt-6 font-display text-3xl font-extrabold text-marina-blue">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
            <p className="mt-1 text-sm text-marina-blue/50">Approx. market range {product.priceRange}</p>

            <p className="mt-6 leading-relaxed text-marina-blue/70">{product.description}</p>

            <p className={`mt-6 inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${
              product.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-marina-blue/10 text-marina-blue/50'
            }`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </p>

            <div className="mt-8">
              <a
                href={whatsappLink(`Hi, I'd like to order ${product.name} (${product.brand}) — approx ₹${product.price}.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-marina-red to-marina-redLight px-8 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-pop transition-transform hover:-translate-y-1"
              >
                <MessageCircle size={18} /> Order via WhatsApp
              </a>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-6 font-display text-2xl font-extrabold text-marina-blue">You may also like</h2>
            <ProductGrid products={related} />
          </div>
        )}
      </div>
    </PageTransition>
  )
}
