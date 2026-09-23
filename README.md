# 360 Party Wheel — Website

A hand-built, no-build-step static website for **360 Party Wheel**, a San Diego party & event rental company (karaoke, LED marquee letters, and a signature 360 photo booth).

Plain HTML/CSS/JS — no Node, no bundler, no framework. Open any page directly in a browser or drag the folder onto any static host.

## What's in here

```
360-party-wheel/
├── index.html          Home
├── services.html        Rentals & starting prices (entertainment, photo booth)
├── gallery.html          Filterable photo gallery + lightbox
├── about.html            Brand story, timeline, values, team
├── contact.html           Quote request form, FAQ, map
├── assets/
│   ├── css/style.css      All design tokens + component styles + animations
│   ├── js/main.js         Nav, scroll reveals, counters, carousel, gallery, form logic
│   └── img/logo.svg       Logo badge (header, mobile drawer, footer, favicon)
└── README.md
```

The logo (`assets/img/logo.svg`) is a hand-built vector recreation of the brand's circular badge mark — transparent background, purple starburst, celebrating silhouettes, "Party Wheel" wordmark, and ring text. It's pure SVG (no external font/image dependencies), so it stays crisp at any size and is easy to recolor by editing the fill/stroke values directly in the file. Note: `logo-badge.png` (the rasterized version actually used across the site) already reads "360 PHOTO BOOTH" on its ring and doesn't need updating — `logo.svg` itself is an unused legacy source file with older ring text ("CHAIRS · TABLES · INFLATABLES") that was never regenerated to a PNG.

Every page shares the same header, mobile nav drawer, and footer — if you edit navigation or contact details, update all five HTML files (a simple find-and-replace works well here).

## Before you launch: things to replace

This site was built with **realistic placeholder content** so it looks and feels finished. Swap these out before going live:

1. **Photos.** All imagery currently loads from Unsplash (free stock photos) via direct links in the `<img>` tags — nothing is downloaded locally. Replace `src="https://images.unsplash.com/..."` with your own photography for an authentic result. Recommended sizes match the `w=`/`h=` values already in each URL.
2. **Business details.** Phone `(619) 555-0360`, email `hello@360partywheel.com`, hours, and the social links (`instagram.com`, `facebook.com`, `tiktok.com`) are placeholders — find-and-replace across all five HTML files.
3. **Starting prices** in `services.html` and on the home page "Investment Preview" module are illustrative — confirm real numbers before publishing.
4. **Testimonials & team bios** in `index.html` and `about.html` are fictional placeholders paired with stock photos.

## Activating the contact form

The quote form on `contact.html` is wired to [Web3Forms](https://web3forms.com) — a free service that emails form submissions to you with **no backend or server required**.

1. Go to [web3forms.com](https://web3forms.com) and get a free Access Key (just enter your email).
2. Open `contact.html`, find this line near the top of the `<form>`:
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
   ```
3. Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your real key.

Until you do this, the form still validates and shows a friendly success message (so you can demo it), but it won't actually deliver anywhere — `assets/js/main.js` checks for the placeholder and skips the real network request.

## Deploying

No build step — just upload the folder as-is. Any of these work in a couple of minutes:

- **Netlify / Vercel**: drag-and-drop the `360-party-wheel` folder onto their dashboard, or connect a Git repo.
- **GitHub Pages**: push this folder to a repo and enable Pages on the `main` branch.
- **Any traditional host (cPanel, etc.)**: upload the contents via FTP/SFTP into `public_html`.

Since there's no build process, whatever you upload is exactly what visitors see.

## Design notes

- **Fonts:** Fraunces (display/headings) + Plus Jakarta Sans (body), loaded from Google Fonts.
- **Palette:** violet/purple primary with a white/lavender neutral system — dark violet hero and one dark "why us" band for contrast, everything else light.
- **Animation:** GSAP + ScrollTrigger (via CDN) for scroll reveals and counters, with a vanilla-JS fallback and full `prefers-reduced-motion` support — nothing breaks if GSAP fails to load.
- **Icons:** hand-drawn inline SVGs (no icon font, no emoji).
- **Color/type/spacing tokens** all live at the top of `assets/css/style.css` as CSS custom properties — change `--violet-*` there and it updates everywhere.
- Ships one fully-designed light theme (header, footer, and content sections are intentionally not auto-dark-mode-switched — see the comment above `:root[data-theme='dark']` in `style.css` if you want to wire up a manual toggle later).

## Known limitations to flag with your developer/agency

- No CMS — content changes mean editing HTML directly.
- No booking/availability calendar or payment processing (this was scoped as a lead-generation site with a quote request form, not a transactional booking system).
- Google Maps embed uses the no-API-key `output=embed` method — fine for a simple map, but swap in a proper Maps JavaScript API + key if you want custom pins or directions.
