# JRG Construction & Remodeling Inc. — Website

Static, single-page marketing site. No build step, no dependencies — open `index.html` in a browser or drop the folder on any static host (GitHub Pages, Netlify, Vercel, cPanel, etc.).

## Structure

```
index.html            Page content (edit text, phone, email, services here)
assets/css/style.css  All styling (colors are CSS variables at the top of the file)
assets/js/main.js     Hero slideshow, mobile menu, before/after sliders, gallery filter, lightbox, contact form
assets/logo.svg       Full logo (mark + wordmark)
assets/logo-mark.svg  Square mark only (social avatars, print)
assets/favicon.svg    Browser tab icon
assets/img/           Enhanced project photos (p1–p25) as .webp (used by the site) and .jpg (originals for reuse)
assets/img/thumb/     640px thumbnails used in the gallery grid
assets/img/hero/      Landscape crops used in the hero slideshow
```

## Editing

- **Phone / email**: search `index.html` for `4245214347` and `jaime.gomez.9381` and replace.
- **Brand colors**: change `--accent` and `--ink` in `assets/css/style.css`.
- **Add a gallery photo**: add a `.tile` link inside `#gallery-grid` in `index.html`, with `data-cat` set to one or more of `bath`, `exterior`, `fence`, `concrete`, `carpentry`, `interior`.
- **Contact form**: currently opens the visitor's email app with the message pre-filled (no backend needed). To receive submissions without email apps, point the form at a free form service such as Formspree or Netlify Forms.

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository.
2. Settings → Pages → Source: `main` branch, `/ (root)`.
3. The site will be live at `https://<user>.github.io/<repo>/`.
