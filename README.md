# Merlin Marina

Quality Care For Every Fin And Feather — a React + Vite + Tailwind e-commerce site for Merlin Marina, an aquarium and avian pet supplies store in Chennai.

## Tech Stack

- **React 18 + Vite** — app shell and build
- **Tailwind CSS** — styling
- **Framer Motion** — page transitions, staggered grids, hover/filter animations
- **React Router DOM** (`BrowserRouter`) — routing, with a `404.html` redirect trick for GitHub Pages
- **Lucide React** — icons

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Structure

```
├── index.html            # Vite entry (also decodes the 404.html redirect trick)
├── vite.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx, App.jsx
│   ├── components/       # Navbar, Footer, ProductCard, ProductGrid, CategoryCard, ...
│   ├── pages/             # Home, CategoryPage, ProductsPage, ProductDetail, NotFound
│   └── data/              # Mock catalog: categories.js, products.js, config.js
├── scripts/
│   └── build-catalog.mjs # Regenerates src/data/catalog.generated.json from the CSV
├── public/assets/         # Product imagery, favicon, 404.html
└── legacy-static/         # The previous plain HTML/CSS/JS site, kept for reference
```

### Mock data

`src/data/raw_aquarium_products.csv` is a researched catalog of real aquarium brands/products/prices in India. `scripts/build-catalog.mjs` turns it into `src/data/catalog.generated.json`. Categories not in the CSV (Aquarium Toys & Decor, Avian Friends) are hand-authored in `src/data/extraProducts.js`. Everything is merged in `src/data/products.js`, which also assigns product images, ratings, and stock status deterministically.

To regenerate the catalog after editing the CSV:

```bash
node scripts/build-catalog.mjs
```

## GitHub Pages Deployment

This repo is `merlinmarina/merlinmarina.github.io`, a user/org Pages site served from the domain root — `vite.config.js` sets `base: '/'` accordingly (change this to `/repo-name/` if you fork this into a project-page repo).

**Option A — GitHub Actions (configured):** `.github/workflows/pages.yml` builds the app with Node 20 and deploys `dist/` on every push to `main`. Enable it once under Settings → Pages → Source → "GitHub Actions".

**Option B — `gh-pages` package:** `npm run deploy` builds and pushes `dist/` to the `gh-pages` branch (requires `gh-pages` to be installed, already in `devDependencies`).

Because this is a client-side-routed SPA, `public/404.html` encodes any deep-linked path (e.g. `/category/tanks-filters`) into a query string and redirects to `index.html`, which decodes it back via `history.replaceState` before React Router mounts — so refreshing or sharing a deep link works on GitHub Pages.
