import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, MessageCircle } from 'lucide-react'
import { whatsappLink, siteConfig } from '../data/config'

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'All Products' },
  { to: '/category/tanks-filters', label: 'Tanks & Filters' },
  { to: '/category/avian-friends', label: 'Avian Friends' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 shadow-md backdrop-blur-lg' : 'bg-white/70 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src="/assets/p1_9.png" alt="Merlin Marina" className="h-11 w-11 rounded-xl object-cover" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-marina-blue">Merlin Marina</span>
            <span className="hidden text-[0.65rem] font-semibold uppercase tracking-wide text-marina-indigo/70 sm:block">
              {siteConfig.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative text-sm font-semibold transition-colors ${
                  isActive ? 'text-marina-red' : 'text-marina-blue/70 hover:text-marina-blue'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <a
          href={whatsappLink('Hi Merlin Marina, I have a question about your products.')}
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-marina-red to-marina-redLight px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-pop transition-transform hover:-translate-y-0.5 md:inline-flex"
        >
          <MessageCircle size={16} /> WhatsApp
        </a>

        <button
          className="rounded-lg p-2 text-marina-blue md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-marina-blue/10 bg-white md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-semibold ${
                      isActive ? 'bg-marina-red/10 text-marina-red' : 'text-marina-blue/80'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <a
                href={whatsappLink('Hi Merlin Marina, I have a question about your products.')}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-marina-red to-marina-redLight px-5 py-3 text-sm font-bold uppercase text-white"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
