import { Link } from 'react-router-dom'
import { Instagram, Youtube } from 'lucide-react'
import { siteConfig } from '../data/config'
import { categories } from '../data/categories'

export default function Footer() {
  return (
    <footer className="bg-marina-ink text-white/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img src="/assets/p1_9.png" alt="Merlin Marina" className="h-11 w-11 rounded-xl object-cover" />
            <span>
              <span className="block font-display text-lg font-bold text-white">{siteConfig.name}</span>
              <span className="block text-xs text-white/50">{siteConfig.tagline}</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Your destination for fishes, aquariums, love birds, parrots, and all related accessories.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-marina-cyan transition hover:bg-marina-cyan hover:text-marina-ink"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href={siteConfig.youtube}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-marina-cyan transition hover:bg-marina-cyan hover:text-marina-ink"
              aria-label="YouTube"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>

        <div className="sm:text-right">
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Shop</h4>
          <ul className="space-y-2.5 text-sm text-white/60">
            <li><Link to="/products" className="hover:text-white">All Products</Link></li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/category/${c.slug}`} className="hover:text-white">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  )
}
