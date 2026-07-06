import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'

export default function NotFound() {
  return (
    <PageTransition>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-6xl font-extrabold text-marina-blue">404</h1>
        <p className="mt-3 text-marina-blue/60">This page swam away. Let&apos;s get you back on course.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-marina-red px-6 py-3 text-sm font-bold text-white"
        >
          Back to Home
        </Link>
      </div>
    </PageTransition>
  )
}
