# Merlin Marina GitHub Pages Site

This repository now includes a working static website built to match the provided PDF page designs.

## Included Pages
- `index.html` — Home page with hero section, product preview, categories, features, and testimonials.
- `filter-pump.html` — Filter pump listings page with product cards.
- `fishes.html` — Fish collection page.
- `foods.html` — Food products page.
- `tanks.html` — Aquarium tank page.
- `toys.html` — Aquarium decor and accessories page.
- `contact.html` — Contact page with store information and a contact form.
- `product-details.html` — Product details page for a featured filter pump.
- `css/style.css` — Shared stylesheet for the site.
- `js/main.js` — Shared JavaScript for accordion behavior and product navigation.

## How to Preview Locally
1. Open `index.html` in your browser.
2. Or host locally with a simple web server:
   - Python 3: `python3 -m http.server 8000`
   - Visit `http://localhost:8000`

## GitHub Pages Deployment
1. Commit the new files and push to GitHub.
2. Enable GitHub Pages in repository settings.
3. Set the source branch to `main` and the folder to `/`.
4. Your site will publish at `https://<username>.github.io/<repository>/`.

## Notes
- The site uses external images from Unsplash to match the PDF design feel.
- The contact page includes a placeholder Google Maps embed.
- The product details page is linked from the filter pump listing buttons.
