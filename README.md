# Merlin Marina

Quality Care For Every Fin And Feather — a static landing page for Merlin Marina, your trusted source for premium aquarium essentials, vibrant fishes, love birds, parrots, and accessories.

Built with HTML, CSS, and JavaScript. Ready for GitHub Pages.

## Quick Start

```bash
make serve
```

Open http://localhost:8000

## GitHub Pages Deployment

1. Push to GitHub
2. In repo Settings > Pages, deploy from `main` branch `/` root
3. Site will be at `https://<username>.github.io/merlinmarina/`

## Structure

```
├── index.html         # Main landing page
├── products.html      # Public product catalog (reads data/products.json)
├── admin.html         # Admin dashboard (login required)
├── css/               # style.css, catalog.css, admin.css
├── js/                # main.js, catalog.js, admin.js
├── data/products.json # Product database (edited via admin dashboard)
└── assets/            # Images; admin uploads go to assets/products/
```

## Admin Dashboard

Open `/admin.html` and sign in. Credentials are verified against a SHA-256
hash in `js/admin.js` (`AUTH_HASH`) — see the comment at the top of that
file for how to change the username/password.

The dashboard edits `data/products.json`: prices, MRP, description, image
(URL or file upload), category, quantity, in/out of stock, and active
(shown/hidden on the website). Products can also be added and deleted.

**Publishing:** on a static GitHub Pages site there is no server, so
"Publish Changes" commits `data/products.json` (and any uploaded images)
directly to this repository via the GitHub API. In the gear-icon settings,
paste a **fine-grained personal access token** with *Contents: Read & write*
permission scoped to only this repository. The token is the real write
credential — the login form only gates the UI. Never commit the token to
the repo.

GitHub Pages redeploys automatically after each publish (live in a minute
or two).
