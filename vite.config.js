import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// merlinmarina.github.io is a user/org GitHub Pages site, so it is served
// from the domain root rather than a /<repo-name>/ sub-path.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
