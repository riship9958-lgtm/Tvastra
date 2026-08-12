# Tvastra Design LLP — Website

An editorial, image-forward portfolio site for **Tvastra Design LLP** — a
29-year architecture, interior and product design practice in Surat, Gujarat.

Pure static **HTML / CSS / JS** — no build dependencies, no framework. Pages
are generated from a small Node script (`build.js`) so the shared header/footer
live in one place.

## Design

Aligned to the Tvastra logo: **brand blue** (`#00618e`) on a white ground, with
**navy** for the footer and a **deep blue-charcoal** for the dark bands. The home
page opens on a brand-blue **title card**; work is shown as **immersive image
tiles** (name overlaid on the photo); the Disciplines page presents the three
disciplines as **stacked full-screen panels** with oversized serif names. Type
is **Quicksand** (matched to the logo), with **Cormorant Garamond** for the
disciplines' display words. The official logo sits in the header and footer.

Palette tokens live at the top of `css/style.css` (`--clay` = brand blue,
`--navy`, `--bg-deep` = dark band, `--paper` = white) — retune from there.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, philosophy, featured project, disciplines, vision, CTA |
| `projects.html` | Work grid with category filters |
| `aashihbhai-residence.html` | Project case study — **Aashihbhai Residence** |
| `services.html` | Architecture, Interior, Product + process |
| `projects-architecture.html` / `-interior.html` / `-product.html` | Per-discipline project pages |
| `about.html` | Studio story, vision, principles, awards |
| `contact.html` | Studio details + enquiry form |

## Editing content

All page copy and structure lives in `build.js` as template strings, with a
shared `header()` / `FOOTER`. After editing, regenerate the pages:

```bash
node build.js            # writes the 7 HTML pages
node build.js preview out.html   # also writes a single-file interactive preview
```

## Real projects & photography

Real project imagery lives under `assets/projects/`. The **Aashihbhai
Residence** renders are in `assets/projects/aashihbhai/` (`.webp`).

To add a project: drop its photos in a new `assets/projects/<name>/` folder,
add an entry to the `PROJECTS_LIST` array in `build.js`, and (optionally) a case
study page.

## View it locally

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy

A GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) publishes the
repo root to GitHub Pages on every push to `main`. Enable it once at
**Settings → Pages → Source → GitHub Actions**; the site then serves at
`https://<user>.github.io/Tvastra/`.

## Contact form

The enquiry form is front-end only (shows a thank-you message). To receive
enquiries, point it at a form service (Formspree, Basin, Netlify Forms) by
editing the `<form>` and the handler in `js/main.js`.
