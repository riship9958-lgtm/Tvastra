# Tvastra Design LLP — Website

An editorial, image-forward portfolio site for **Tvastra Design LLP** — a
29-year architecture, interior and product design practice in Surat, Gujarat.

Pure static **HTML / CSS / JS** — no build dependencies, no framework. Pages
are generated from a small Node script (`build.js`) so the shared header/footer
live in one place.

## Design

An **earthy, editorial** theme: a warm near-white ground with **terracotta**
(`#ad4a2b`) as the accent, **charcoal** for dark surfaces, and **navy**
(`#22304e`) for the title card and footer (beige/olive support tones). The home
page opens on a branded **title card**; work is shown as **immersive image
tiles** (name overlaid on the photo); the Disciplines page has a **"What we do"
slider** with oversized serif names. Type is **Quicksand** (matched to the
logo), with **Cormorant Garamond** for the slider's display words. The official
logo sits in the header and footer.

Palette tokens live at the top of `css/style.css` (`--clay` = terracotta,
`--navy`, `--bg-deep` = charcoal, `--paper` = warm white) — retune from there.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, philosophy, featured project, disciplines, vision, CTA |
| `projects.html` | Work grid with category filters |
| `aashihbhai-residence.html` | Project case study — **Aashihbhai Residence** |
| `services.html` | Architecture, Interior, Product + process |
| `vatrusa.html` | The **Vatrusa** furniture line |
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
add a card to the `projects` section in `build.js`, and (optionally) a case
study page. Two projects are named but awaiting photography — **Avadh Habitat**
(interior, 2,567 sq ft) and **Vatrusa** (furniture) — shown as text cards until
their images are added.

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
