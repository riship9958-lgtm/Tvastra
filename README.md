# Tvastra Design LLP — Website

A minimalist, image-forward portfolio site for **Tvastra Design LLP**, built in
the concept style of studios like Studio Sangath: lots of white space, refined
typography, and a project-grid gallery as the heart of the site.

Pure static HTML/CSS/JS — **no build step, no dependencies.**

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, philosophy, services & featured projects |
| `projects.html` | Filterable project gallery grid (the core page) |
| `project.html` | Single-project detail (currently **Avadh Habitat**) |
| `services.html` | Architecture, Interior Design, Product Design + process |
| `vatrusa.html` | The **Vatrusa** furniture line (product detail) |
| `about.html` | Studio story, vision, principles, stats |
| `contact.html` | Contact details + enquiry form |

## Content

The copy is populated with **Tvastra's real information** (29-year legacy;
architecture / interior / product disciplines; the *Vatrusa* furniture line;
the *Avadh Habitat* interior project; the 2023 A&D Platinum award; and the
Surat studio address and phone) sourced from tvastra.design.

Two things to confirm/replace:
- **Email** — set to `info@tvastra.design` as a sensible default; confirm the
  real address and update it across the footers + `contact.html`.
- **Additional projects** — only *Avadh Habitat* and *Vatrusa* are real; the
  other cards in `projects.html` are labelled placeholders (see the HTML
  comment there). Swap in real projects and photos.

## View it locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Adding your real logo

The logo is currently a clean SVG recreation of the Tvastra wordmark in the
brand colours. To use the official artwork, replace these two files (keep the
same filenames) — SVG, PNG or WEBP all work:

- `assets/logo.svg` — coloured logo for light backgrounds (header)
- `assets/logo-white.svg` — white logo for the dark footer

If you drop in a PNG instead, update the `<img src="…">` in each page's header
and footer accordingly.

## Adding your real project photos

Placeholder images live in `assets/projects/` as `.svg` files. Replace each
with a real photo (recommended landscape, ~1600×1200, `.jpg` or `.webp`):

```
assets/projects/courtyard-house.svg   -> courtyard-house.jpg
assets/projects/riverside-villa.svg   -> riverside-villa.jpg
... etc.
```

Then update the matching `<img src="…">` and the titles/locations/years in
`projects.html`, `index.html` and `project.html`. Also swap `assets/hero.svg`
(homepage banner) and `assets/about.svg` (studio photo).

> The project names, cities and years in the markup are **placeholders** — edit
> them to Tvastra's real projects.

## Brand palette

Taken from the logo colour profile (C100 M60 Y25 K05 / K80):

- **Blue** `#0f5f8c` — primary brand
- **Ink** `#1f2a30`, **Grey** `#5c6b73`

Defined as CSS variables at the top of `css/style.css` (`--brand`, `--ink`, …)
— change them in one place to retune the whole site.

## Making the contact form live

The form is front-end only (shows a thank-you message). To actually receive
enquiries, point it at a form service (Formspree, Basin, Netlify Forms) or your
own endpoint by editing the `<form>` action and the handler in `js/main.js`.
