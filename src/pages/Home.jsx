import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  MessageCircle, ShoppingBag, Building2, Home as HomeIcon, UtensilsCrossed,
  Hotel, Briefcase, Store, HeartHandshake, Sparkles, ShieldCheck, ArrowRight,
} from 'lucide-react'
import PageTransition from '../components/PageTransition'
import CategoryCard from '../components/CategoryCard'
import { categories } from '../data/categories'
import { whatsappLink, siteConfig } from '../data/config'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const services = [
  { icon: Building2, label: 'Apartments' },
  { icon: HomeIcon, label: 'Community Villa' },
  { icon: UtensilsCrossed, label: 'Restaurants' },
  { icon: Hotel, label: 'Hotels' },
  { icon: Briefcase, label: 'Offices' },
  { icon: Store, label: 'Commercial Places' },
]

const values = [
  { icon: HeartHandshake, title: 'Compassionate Care', text: 'We treat every pet with warmth and professional dedication, ensuring they receive the highest standard of living.' },
  { icon: Sparkles, title: 'Vibrant Excellence', text: 'We source only premium, vibrant products that bring saturated clarity and life into your home setups.' },
  { icon: ShieldCheck, title: 'Expert Support', text: 'Backed by evidence and science, we provide trustworthy guidance to help your aquatic and avian environments thrive.' },
]

export default function Home() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-marina-hero">
        <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-marina-red/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-marina-indigo/40 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 py-32 text-center">
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur"
          >
            30 Years of Experience in Aquarium
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display text-4xl font-extrabold uppercase leading-[1.05] text-white drop-shadow-lg sm:text-5xl md:text-6xl"
          >
            Quality Care For Every Fin And Feather
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-base font-medium text-white/90 sm:text-lg"
          >
            Welcome to Merlin Marina. Your trusted source for premium aquarium essentials, vibrant fishes, and
            quality accessories for your avian friends.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href={whatsappLink('Hi Merlin Marina, I would like to know more about your products.')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-marina-red to-marina-redLight px-8 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-pop transition-transform hover:-translate-y-1"
            >
              <MessageCircle size={18} /> Ping Us in WhatsApp
            </a>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-extrabold uppercase tracking-wide text-white backdrop-blur transition hover:bg-white/20"
            >
              <ShoppingBag size={18} /> Shop All Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About / Compassionate Care */}
      <section className="relative overflow-hidden bg-marina-ink py-24">
        <div className="blob-shape pointer-events-none absolute -right-40 top-0 h-[32rem] w-[32rem] bg-marina-red/90 opacity-90 blur-0" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="relative z-10 rounded-[2.5rem] bg-marina-green/95 p-10 sm:p-12"
            style={{ backgroundColor: '#22c55e' }}
          >
            <motion.span variants={fadeUp} className="text-xs font-extrabold uppercase tracking-widest text-marina-red">
              Our Story &amp; Mission
            </motion.span>
            <motion.h2 variants={fadeUp} className="mt-3 font-display text-4xl font-extrabold uppercase leading-tight text-marina-blue sm:text-5xl">
              Compassionate Care
            </motion.h2>
            <motion.span
              variants={fadeUp}
              className="mt-5 inline-block rounded-full bg-marina-blue px-5 py-2 text-xs font-bold uppercase tracking-wide text-white"
            >
              30 Years of Experience in Aquarium
            </motion.span>
            <motion.p variants={fadeUp} className="mt-6 text-sm leading-relaxed text-marina-blue/90 sm:text-base">
              At Merlin Marina, we believe in combining approachable technicality with compassionate care. We
              provide everything you need to create a thriving aquatic environment, from beautifully crafted fish
              tanks and effective filters to nutritious food, playful toys, and other essential aquarium accessories.
            </motion.p>
            <motion.p variants={fadeUp} className="mt-4 text-sm leading-relaxed text-marina-blue/90 sm:text-base">
              As we continue to grow, we are slowly expanding our family to include feathered friends. We are proud
              to introduce a curated selection of love birds, parrots, and specialized avian accessories to bring
              vibrant excellence to every corner of your home.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto max-w-md"
          >
            <div className="absolute -left-4 -top-4 h-full w-full rounded-3xl border-4 border-marina-indigo" />
            <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl border-4 border-marina-red" />
            <img
              src="/assets/p1_4.png"
              alt="Our Story & Mission"
              className="relative aspect-[4/5] w-full rounded-3xl border-4 border-white object-cover shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="relative overflow-hidden bg-marina-ink py-24">
        <div className="blob-shape pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[30rem] -translate-x-1/2 bg-marina-red/80 opacity-90" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-marina-red">Premium Selection</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold uppercase text-white sm:text-4xl">Shop By Category</h2>
          </div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-marina-red">Where We Serve</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold uppercase text-marina-blue sm:text-4xl">Our Services</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-marina-blue/60 sm:text-base">
              We bring vibrant life and expert care to a variety of commercial and residential spaces, including:
            </p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6"
          >
            {services.map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="flex flex-col items-center gap-4 rounded-2xl border border-marina-blue/10 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-pop"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-marina-blue/5 text-marina-blue">
                  <Icon size={24} />
                </div>
                <span className="text-sm font-bold text-marina-blue">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-marina-blue/5 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-marina-red">Why Choose Us</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold uppercase text-marina-blue sm:text-4xl">Our Core Values</h2>
          </div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            {values.map(({ icon: Icon, title, text }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="rounded-3xl bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-pop"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-marina-blue to-marina-red text-white">
                  <Icon size={26} />
                </div>
                <h3 className="font-display text-lg font-bold text-marina-blue">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-marina-blue/60">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="relative overflow-hidden bg-marina-contact py-24 text-white">
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <MessageCircle size={24} />
          </div>
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Contact Us</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/85 sm:text-base">
            {siteConfig.name} is proud to serve the Chennai community. Whether you&apos;re setting up your first
            fish tank or looking for the perfect toy for your parrot, our doors are open with premium, beautiful
            solutions.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: 'Contact Us', value: siteConfig.phone },
              { label: 'Working Hours', value: 'Mon - Sun\n10:00 AM - 9:00 PM' },
              { label: 'Visit Us', value: 'No- 4A, Hanumar Koil Street,\nRadha Nagar, Chromepet' },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-marina-cyan text-marina-ink">
                  <Sparkles size={16} />
                </div>
                <h4 className="text-sm font-bold">{c.label}</h4>
                <p className="mt-1 whitespace-pre-line text-xs text-white/75">{c.value}</p>
              </div>
            ))}
          </div>
          <a
            href={whatsappLink('Hi Merlin Marina, I would like to know more about your products.')}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-extrabold uppercase tracking-wide text-marina-red shadow-pop transition-transform hover:-translate-y-1"
          >
            Chat With Us <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </PageTransition>
  )
}
