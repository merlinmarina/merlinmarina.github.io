import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // The target page may still be mounting behind an exit-transition of
      // the previous route (see PageTransition), so give it a moment before
      // giving up and scrolling to top instead.
      const tryScroll = () => {
        const el = document.getElementById(hash.slice(1))
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
          return true
        }
        return false
      }
      if (!tryScroll()) {
        const timeout = setTimeout(tryScroll, 400)
        return () => clearTimeout(timeout)
      }
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
