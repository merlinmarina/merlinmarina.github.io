import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

export default function CategoryCard({ category }) {
  return (
    <motion.div variants={item} whileHover={{ y: -8 }} className="group overflow-hidden rounded-3xl bg-white shadow-pop">
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-bold text-marina-blue">{category.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-marina-blue/60">{category.description}</p>
        <Link
          to={`/category/${category.slug}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-marina-red transition-all group-hover:gap-3"
        >
          View Products <ArrowRight size={16} />
        </Link>
      </div>
    </motion.div>
  )
}
