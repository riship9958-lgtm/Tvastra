/* ==========================================================================
   Tvastra Design LLP — static site builder
   Generates the 7 HTML pages from shared header/footer + per-page content,
   and (optionally) a single-file interactive preview bundle.
   Run:  node build.js         -> writes the site pages
         node build.js preview -> also writes preview.html (data-URI, SPA)
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = __dirname;

// Content-hash cache-busting: browsers refetch css/js only when they actually change.
function assetVer(rel) {
  try { return crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, rel))).digest('hex').slice(0, 8); }
  catch (e) { return '1'; }
}
const CSS_VER = assetVer('css/style.css');
const JS_VER = assetVer('js/main.js');

/* ---------- shared bits ---------- */
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet" />';

const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function head(title, desc) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
${FONTS}
<link rel="stylesheet" href="css/style.css?v=${CSS_VER}" />
</head>
<body>`;
}

const NAV = [['index.html','Home'],['services.html','Discipline'],['about.html','About Us'],['recognition.html','Recognition'],['contact.html','Contact Us']];
function header(active, dark) {
  var cls = dark ? 'site-header' : 'site-header solid on-light';
  if (active === 'index.html') cls += ' on-home'; // hide the small header logo over the title card
  var links = NAV.map(function(n){
    var a = n[0] === active ? ' class="active"' : '';
    return `<li><a href="${n[0]}"${a}>${n[1]}</a></li>`;
  }).join('');
  return `
<header class="${cls}">
  <div class="container nav">
    <a class="brand" href="index.html" aria-label="Tvastra Design LLP — home">
      <img class="logo-color" src="assets/logo.png" alt="Tvastra Design LLP" />
      <img class="logo-white" src="assets/logo-white.png" alt="Tvastra Design LLP" />
    </a>
    <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
    <ul class="nav-links">${links}</ul>
  </div>
</header>`;
}

const IG = '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.1a6.7 6.7 0 100 13.4 6.7 6.7 0 000-13.4zm0 11a4.3 4.3 0 110-8.6 4.3 4.3 0 010 8.6zm6.5-11.3a1.55 1.55 0 11-3.1 0 1.55 1.55 0 013.1 0z"/></svg>';
const LI = '<svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5.01A2.5 2.5 0 014.98 3.5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.3c0-1.26-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z"/></svg>';

const FOOTER = `
<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="assets/logo-white.png" alt="Tvastra Design LLP" />
        <p>Architecture, interiors &amp; product design — a 29-year practice blending historical elegance with contemporary craft.</p>
      </div>
      <div>
        <h5>Explore</h5>
        <ul><li><a href="index.html">Home</a></li><li><a href="services.html">Discipline</a></li><li><a href="about.html">About Us</a></li><li><a href="recognition.html">Recognition</a></li><li><a href="contact.html">Contact Us</a></li></ul>
      </div>
      <div>
        <h5>Disciplines</h5>
        <ul><li><a href="projects-architecture.html">Architecture</a></li><li><a href="projects-interior.html">Interior Design</a></li><li><a href="projects-product.html">Product Design</a></li></ul>
      </div>
      <div>
        <h5>Studio</h5>
        <ul>
          <li><a href="mailto:info@tvastra.design">info@tvastra.design</a></li>
          <li><a href="tel:+919081813231">+91 90818 13231</a></li>
          <li>Umra Road, Athwalines,<br />Surat, Gujarat 395007</li>
        </ul>
        <div class="socials">
          <a href="https://www.instagram.com/tvastradesignllp/" aria-label="Instagram" target="_blank" rel="noopener">${IG}</a>
          <a href="#" aria-label="LinkedIn">${LI}</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 Tvastra Design LLP. All rights reserved.</span>
      <span>Surat · Gujarat · India</span>
    </div>
  </div>
</footer>
<script src="js/main.js?v=${JS_VER}"></script>
</body>
</html>`;

/* ---------- page contents ---------- */
const IMG = 'assets/projects/aashihbhai/';
const IMG2 = 'assets/projects/dilipbhai/';
const IMG3 = 'assets/projects/junebhai/';
const IMG4 = 'assets/projects/kalpeshbhai/';
const IMG5 = 'assets/projects/kamalbhai/';
const IMG6 = 'assets/projects/mukeshbhai/';
const IMG7 = 'assets/projects/kamleshbhai/';
const IMG8 = 'assets/projects/sudhirbhai/';

// Central list of real projects — add one entry (+ a detail page) to publish a new project.
const PROJECTS_LIST = [
  { name: 'Aashihbhai Residence',  file: 'aashihbhai-residence.html',  cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG}06-night-corner.webp`,   feat: `${IMG}04-day-side.webp` },
  { name: 'Junebhai Residence',    file: 'junebhai-residence.html',    cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG3}02-dusk.webp`, feat: `${IMG3}02-dusk.webp` },
  { name: 'Kalpeshbhai Residence', file: 'kalpeshbhai-residence.html', cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG4}01-night.webp`, feat: `${IMG4}01-night.webp` },
  { name: 'Kamalbhai Residence',   file: 'kamalbhai-residence.html',   cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG5}01-night.webp`, feat: `${IMG5}01-night.webp` },
  { name: 'Mukeshbhai Residence',  file: 'mukeshbhai-residence.html',  cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG6}02-night-street.webp`, feat: `${IMG6}02-night-street.webp` },
  { name: 'Kamleshbhai Residence', file: 'kamleshbhai-residence.html', cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG7}06-dusk-corner.webp`, feat: `${IMG7}06-dusk-corner.webp` },
  { name: 'Sudhirbhai Residence',  file: 'sudhirbhai-residence.html',  cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG8}01-night-corner.webp`, feat: `${IMG8}01-night-corner.webp` },
  { name: 'Nehalbhai Residence',   file: 'nehalbhai-residence.html',   cat: 'interior',     meta: 'Interior · Surat, Gujarat',    card: 'assets/projects/nehalbhai/hero.webp', feat: 'assets/projects/nehalbhai/hero.webp' },
];
// "Forthcoming" entries (no photography yet) — none shown for now
const PROJECTS_SOON = [];

function pcard(p, i) {
  const cat = p.cat.charAt(0).toUpperCase() + p.cat.slice(1);
  return `<a class="tile reveal${i%2?' d1':''}" href="${p.file}" data-cat="${p.cat}">
      <div class="tile__img"><img src="${p.card}" alt="${p.name}" loading="lazy" /></div>
      <div class="tile__cap"><span class="tile__cat">${cat}</span><span class="tile__name">${p.name}</span><span class="tile__meta">${p.meta}</span></div>
    </a>`;
}
function pcardSoon(p, i) {
  const body = `<div class="pcard__media"><span>${p.label}</span></div>
      <div class="pcard__body"><div><div class="pcard__title">${p.name}</div><div class="pcard__meta">${p.meta}</div></div><span class="pcard__cat">${p.cat.charAt(0).toUpperCase()+p.cat.slice(1)}</span></div>`;
  return p.file
    ? `<a class="pcard pcard--soon reveal${i%2?' d1':''}" href="${p.file}" data-cat="${p.cat}">${body}</a>`
    : `<div class="pcard pcard--soon reveal${i%2?' d1':''}" data-cat="${p.cat}">${body}</div>`;
}

// A discipline's projects — the tiles that belong to it, or a "coming soon" panel.
function discSection(id, title, cat) {
  const items = PROJECTS_LIST.filter(function (p) { return p.cat === cat; });
  const inner = items.length
    ? `<div class="tiles">\n      ${items.map(function (p, i) { return pcard(p, i); }).join('\n      ')}\n    </div>`
    : `<div class="disc-empty reveal"><span>Projects in ${title.toLowerCase()} are being photographed.</span><a href="contact.html" class="link-arrow">Enquire ${ARROW}</a></div>`;
  const count = items.length ? (items.length + (items.length > 1 ? ' projects' : ' project')) : 'Coming soon';
  return `
<section class="section" id="${id}">
  <div class="container">
    <div class="reveal" style="display:flex;justify-content:space-between;align-items:baseline;gap:20px;flex-wrap:wrap;margin-bottom:clamp(26px,3vw,42px);border-top:1px solid var(--line);padding-top:clamp(28px,3vw,44px)">
      <h2 class="h-lg">${title}.</h2>
      <span class="muted" style="font-size:13px;letter-spacing:.06em;text-transform:uppercase">${count}</span>
    </div>
    ${inner}
  </div>
</section>`;
}

// The dedicated project page for each discipline.
function discHref(cat) {
  return cat === 'architecture' ? 'projects-architecture.html'
    : cat === 'interior' ? 'projects-interior.html'
    : cat === 'product' ? 'projects-product.html'
    : 'projects.html';
}

const PLUS = `<span class="dcol__plus"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 5v14M5 12h14"/></svg></span></span>`;

// A tall numbered image column (Agressov-style).
function dcard(num, href, img, name, side) {
  return `<a class="dcol reveal" href="${href}">
      <div class="dcol__img"><img src="${img}" alt="${name}" loading="lazy" /></div>
      <div class="dcol__top"><span class="dcol__num">${num}</span><span class="dcol__title">${name}</span></div>
      <span class="dcol__side">${side}</span>
      ${PLUS}
    </a>`;
}
function pcol(num, p) { return dcard(num, p.file, p.card, p.name, 'Residential &middot; Surat'); }

// A product-category card (same format as dcard; supports an image-less "coming soon" state).
function catcard(num, o) {
  const media = o.img
    ? `<div class="dcol__img"><img src="${o.img}" alt="${o.name}" loading="lazy" /></div>`
    : `<div class="dcol__img dcol__img--soon"></div>`;
  return `<a class="dcol reveal${o.img ? '' : ' dcol--soon'}" href="${o.href || 'contact.html'}">
      ${media}
      <div class="dcol__top"><span class="dcol__num">${num}</span><span class="dcol__title">${o.name}</span></div>
      <span class="dcol__side">${o.side}</span>
      ${PLUS}
    </a>`;
}

// A discipline group on the projects overview page — numbered heading + a grid of project columns.
function projGroup(num, id, title, cat) {
  const items = PROJECTS_LIST.filter(function (p) { return p.cat === cat; });
  const grid = items.length
    ? `<div class="pcols">\n      ${items.map(function (p, i) { return pcol(String(i + 1).padStart(2, '0'), p); }).join('\n      ')}\n    </div>`
    : `<div class="container"><div class="disc-empty disc-empty--dark reveal"><span>Projects in ${title.toLowerCase()} are being photographed.</span><a href="contact.html" class="link-arrow">Enquire ${ARROW}</a></div></div>`;
  return `
  <div class="pgrp" id="${id}">
    <div class="container">
      <a class="pgrp__head reveal" href="${discHref(cat)}">
        <span class="pgrp__num">${num}</span>
        <h2 class="pgrp__title">${title}</h2>
        <span class="pgrp__count">${items.length ? (items.length + (items.length > 1 ? ' Projects' : ' Project')) : 'Coming soon'} ${ARROW}</span>
      </a>
    </div>
    ${grid}
  </div>`;
}

// A full dedicated projects page for a single discipline.
function disciplinePage(ghost, title, cat, lead, feature) {
  const items = PROJECTS_LIST.filter(function (p) { return p.cat === cat; });
  let body;
  if (items.length) {
    body = `<div class="pcols">\n      ${items.map(function (p, i) { return pcol(String(i + 1).padStart(2, '0'), p); }).join('\n      ')}\n    </div>`;
  } else if (Array.isArray(feature) && feature.length) {
    const first = `<div class="pcols">\n      ${catcard('01', feature[0])}\n    </div>`;
    const rest = feature.slice(1);
    const more = rest.length
      ? `<div class="pcols pcols--trio">\n      ${rest.map(function (o, i) { return catcard(String(i + 2).padStart(2, '0'), o); }).join('\n      ')}\n    </div>`
      : '';
    body = first + more + `\n  <div class="container"><p class="pgrp__note reveal">Furniture, lighting, décor and bespoke pieces — designed and made in-house. <a href="contact.html" class="link-arrow">Enquire ${ARROW}</a></p></div>`;
  } else if (feature) {
    body = `<div class="pcols">\n      ${dcard('01', feature.href, feature.img, feature.name, feature.side)}\n    </div>
  <div class="container"><p class="pgrp__note reveal">More ${title.toLowerCase()} projects are being photographed. <a href="contact.html" class="link-arrow">Enquire ${ARROW}</a></p></div>`;
  } else {
    body = `<div class="container"><div class="disc-empty disc-empty--dark reveal"><span>Projects in ${title.toLowerCase()} are being photographed.</span><a href="contact.html" class="link-arrow">Enquire ${ARROW}</a></div></div>`;
  }
  return `
<section class="dsec">
  <div class="container">
    <div class="whead reveal">
      <span class="whead__ghost" aria-hidden="true">${ghost}</span>
      <p class="eyebrow"><a href="projects.html" class="crumb">Projects</a> &middot; ${title}</p>
      <h1 class="whead__title display" style="font-size:clamp(40px,6.4vw,88px)">${title}.</h1>
    </div>
    <p class="lead reveal" style="max-width:620px;margin-top:18px">${lead}</p>
  </div>
  ${body}
</section>
`;
}

// A tall numbered discipline column (Agressov-style), linking to its projects.
function dcol(num, title, cat, img, side) {
  return `<a class="dcol reveal" href="${discHref(cat)}">
      <div class="dcol__img"><img src="${img}" alt="${title}" loading="lazy" /></div>
      <div class="dcol__top"><span class="dcol__num">${num}</span><span class="dcol__title">${title}</span></div>
      <span class="dcol__side">${side}</span>
      <span class="dcol__plus"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 5v14M5 12h14"/></svg></span></span>
    </a>`;
}

const home = `
<section class="title-card">
  <div class="title-card__inner">
    <img class="title-card__logo" src="assets/logo-white.png" alt="Tvastra Design LLP" />
    <p class="title-card__tag">Architecture &middot; Interiors &middot; Product Design</p>
  </div>
  <a href="#lead" class="title-card__scroll" aria-label="Scroll to enter"><span>Scroll</span></a>
</section>

<section class="hero" id="lead">
  <div class="hero__media"><img src="assets/home/hero-bw.webp" alt="Tvastra Design — rammed-earth residence, black and white" /></div>
  <div class="container hero__inner">
    <p class="eyebrow">Architecture · Interiors · Objects</p>
    <h1>We shape spaces worth returning to.</h1>
    <p class="lead">Tvastra Design LLP is a 29-year practice in Surat, blending historical elegance with contemporary craft — across architecture, interiors and the furniture within them.</p>
    <div class="hero__row">
      <div style="display:flex;gap:14px;flex-wrap:wrap">
        <a href="projects.html" class="btn btn--ghost-light">View our work</a>
        <a href="about.html" class="btn btn--ghost-light">The studio ${ARROW}</a>
      </div>
      <div class="hero__scroll">Scroll</div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container grid-2 top">
    <div class="reveal">
      <p class="eyebrow">The practice</p>
      <h2 class="statement">Named after the celestial architect, we design across scales — from the <em>building</em> to the <em>object</em> within it.</h2>
    </div>
    <div class="reveal d1">
      <p class="lead">For nearly three decades we have shaped architectural landscapes, crafted inspired interiors, and produced exquisite furniture — each project a fusion of innovation and custom craftsmanship.</p>
      <p class="muted">Our work integrates utility, aesthetics, function and style into a single, considered whole, so historical warmth and contemporary calm sit together as one continuous idea.</p>
      <a href="about.html" class="link-arrow" style="margin-top:10px">About the studio ${ARROW}</a>
    </div>
  </div>
  <div class="container">
    <div class="stats reveal">
      <div class="stat"><div class="n">29</div><div class="l">Years of practice</div></div>
      <div class="stat"><div class="n">3</div><div class="l">Design disciplines</div></div>
      <div class="stat"><div class="n">2023</div><div class="l">A&amp;D Platinum Award</div></div>
      <div class="stat"><div class="n">100%</div><div class="l">Custom craftsmanship</div></div>
    </div>
  </div>
</section>

<section class="section section--ink founder">
  <div class="container">
    <div class="founder__grid reveal">
      <div class="founder__media"><img src="assets/founder/founder.webp" alt="Founder — Tvastra Design LLP" loading="lazy" /></div>
      <div class="founder__body">
        <p class="eyebrow">The founder</p>
        <h2 class="h-lg">In the field of design since 1995.</h2>
        <p class="lead">Through college studies, practical training and years of field work — a practice built hands-on, from the first sketch to the finished site.</p>
        <div class="founder__spec">
          <div class="k">Specialties</div>
          <ul>
            <li>Architecture</li>
            <li>Interior design</li>
            <li>Product design</li>
            <li>Turn-key projects</li>
            <li>Project management</li>
          </ul>
        </div>
        <a href="founders-mind.html" class="link-arrow">Inside the founder's mind ${ARROW}</a>
      </div>
    </div>
  </div>
</section>

`;

const projects = `
<section class="dsec">
  <div class="container">
    <div class="whead reveal">
      <span class="whead__ghost" aria-hidden="true">Projects</span>
      <p class="eyebrow">Selected work</p>
      <h1 class="whead__title display" style="font-size:clamp(44px,7vw,96px)">Projects.</h1>
    </div>
    <p class="lead reveal" style="max-width:600px;margin-top:18px">Our work, grouped by discipline — architecture, interiors and product design, each project a fusion of innovation and custom craftsmanship.</p>
  </div>
  ${projGroup('01', 'd-architecture', 'Architecture', 'architecture')}
  ${projGroup('02', 'd-interior', 'Interior Design', 'interior')}
  ${projGroup('03', 'd-product', 'Product Design', 'product')}
</section>
`;

const projArch = disciplinePage(
  'Architecture', 'Architecture', 'architecture',
  'Homes and buildings where structure, light and material resolve into one continuous idea — our residential architecture across Surat, Gujarat.'
);

const projInterior = disciplinePage(
  'Interiors', 'Interior Design', 'interior',
  'Interiors composed as carefully as the buildings that hold them — considered materials, custom furniture and a calm, contemporary warmth.',
  { href: 'services.html', img: 'assets/interior/living-room.webp', name: 'Living Room Study', side: 'Interior &middot; Surat' }
);

const projProduct = disciplinePage(
  'Objects', 'Product Design', 'product',
  'Furniture and objects designed and made in-house — the pieces that complete a Tvastra interior.',
  [
    { href: 'contact.html', img: 'assets/product/mesh-chair.webp', name: 'Furniture', side: 'Meshobase' },
    { href: 'contact.html', img: 'assets/product/lighting-pendants.webp', name: 'Lighting', side: 'Pendants' },
    { href: 'contact.html', img: 'assets/product/decor-lamp.webp', name: 'Decor', side: 'Objects' },
    { href: 'contact.html', img: 'assets/product/bespoke-workshop.webp', name: 'Bespoke', side: 'Made by hand' }
  ]
);

const aashihbhai = `
<div class="pd-hero pd-hero--tall">
  <img src="${IMG}slide-01.webp" alt="Aashihbhai Residence" />
  <div class="pd-hero__cap"><div class="container">
    <span class="tag" style="color:#e6b7a3">Architecture — Residential · Surat</span>
    <h1>Aashihbhai Residence</h1>
    <p class="pd-hero__sub">A sculptural family home in brick and board-formed concrete.</p>
  </div></div>
</div>

<section class="section pd-intro">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">The project</p>
        <h2 class="statement">A play of <em>solid</em> and void — brick stacked over concrete, terraces carved out, and circular apertures cut like lenses into the façade.</h2>
      </div>
      <div class="reveal d1">
        <p class="lead">The massing steps back as it rises, giving every level its own outdoor room. Vertical brick screens filter the Surat light and soften the concrete mass, while the round openings frame the sky and pull daylight deep into the plan.</p>
        <p class="muted">Planned to Vastu and built to breathe — cavity walls temper heat and sound, stack ventilation moves air through the section, and a rainwater tank and solar-ready roof quietly carry the house toward self-sufficiency. At night, concealed uplights wash the textures and the apertures glow from within.</p>
      </div>
    </div>
  </div>
  <div class="container" style="margin-top:clamp(46px,6vw,72px)">
    <div class="pd-meta reveal">
      <div><div class="k">Type</div><div class="v">Residential</div></div>
      <div><div class="k">Site area</div><div class="v">1,900 sq ft</div></div>
      <div><div class="k">Levels</div><div class="v">G + 3 &amp; terrace</div></div>
      <div><div class="k">Stage</div><div class="v">Design Visualisation</div></div>
    </div>
  </div>
</section>

<section class="section pd-sketch">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Concept</p>
      <h2 class="h-lg">From the first line.</h2>
    </div>
    <div class="pd-sketch-grid reveal">
      <figure class="pd-sketch-fig"><img src="${IMG}sketch-01.webp" alt="Aashihbhai Residence — concept sketch, aerial perspective" /></figure>
      <figure class="pd-sketch-fig"><img src="${IMG}sketch-02.webp" alt="Aashihbhai Residence — concept sketch, street perspective" /></figure>
    </div>
    <p class="muted reveal pd-sketch-note">Hand studies — the stepped massing, carved terraces and circular apertures explored in line before the render.</p>
  </div>
</section>

<section class="pd-showcase">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Visualisation</p>
      <h2 class="h-lg">3D Elevation.</h2>
    </div>
    <div class="pd-full-grid reveal">
      <figure class="pd-full"><img src="${IMG}full-01.webp" alt="Aashihbhai Residence — full corner view by day" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IMG}full-02.webp" alt="Aashihbhai Residence — full aerial view" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IMG}full-03.webp" alt="Aashihbhai Residence — full side elevation with brick jaali" loading="lazy" /></figure>
    </div>
  </div>
  <div class="container">
    <div class="pd-sec-head reveal pd-showcase__sub">
      <h2 class="h-lg">Day to night.</h2>
    </div>
  </div>
  <div class="slideshow reveal" data-autoplay="5500" aria-roledescription="carousel" aria-label="Aashihbhai Residence renders">
    <div class="slideshow__viewport">
      <figure class="slide is-active" data-cap="Street corner — brick volumes stacked over the concrete base. Day."><img src="${IMG}slide-01.webp" alt="Aashihbhai Residence — street corner by day" /></figure>
      <figure class="slide" data-cap="The same corner after dark — the apertures glowing from within."><img src="${IMG}slide-02.webp" alt="Aashihbhai Residence — street corner at night" loading="lazy" /></figure>
      <figure class="slide" data-cap="Upper terraces and the circular oculus, threaded with greenery."><img src="${IMG}slide-03.webp" alt="Aashihbhai Residence — upper terraces by day" loading="lazy" /></figure>
      <figure class="slide" data-cap="Night — concealed uplights graze the brick screens."><img src="${IMG}slide-04.webp" alt="Aashihbhai Residence — dramatic night view" loading="lazy" /></figure>
      <figure class="slide" data-cap="Street elevation — brick jaali punctures the concrete plane."><img src="${IMG}slide-05.webp" alt="Aashihbhai Residence — street elevation by day" loading="lazy" /></figure>
      <figure class="slide" data-cap="Street elevation at night, the interiors warm behind the screen."><img src="${IMG}slide-06.webp" alt="Aashihbhai Residence — street elevation at night" loading="lazy" /></figure>
    </div>
    <button class="slideshow__nav slideshow__nav--prev" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 5l-7 7 7 7"/></svg></button>
    <button class="slideshow__nav slideshow__nav--next" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 5l7 7-7 7"/></svg></button>
    <div class="slideshow__bar">
      <div class="container slideshow__bar-inner">
        <span class="slideshow__cap">Street corner — brick volumes stacked over the concrete base. Day.</span>
        <div class="slideshow__dots" role="tablist"></div>
        <span class="slideshow__counter"><span class="cur">01</span><span class="sep">&thinsp;/&thinsp;</span><span class="total">06</span></span>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal"><p class="eyebrow">The approach</p><h2 class="h-lg">Built to breathe.</h2></div>
      <ul class="approach reveal d1">
        <li>Vastu-guided planning</li>
        <li>Raw, exposed &amp; natural materials</li>
        <li>Daylight through the day</li>
        <li>Cavity walls — heat &amp; sound</li>
        <li>Open planning</li>
        <li>Stack ventilation</li>
        <li>Generous green areas</li>
        <li>Rainwater conservation tank</li>
        <li>Solar-ready roof</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="pd-sec-head reveal" style="max-width:640px">
      <p class="eyebrow">Accommodation</p>
      <h2 class="h-lg">A home across five levels.</h2>
    </div>
    <div class="program reveal">
      <div class="program__floor"><div class="program__lvl">Ground</div><ul><li>Parking</li><li>Office</li><li>Grain store &amp; freezer</li><li>Utility area</li><li>Servant room</li><li>Lift / staircase</li></ul></div>
      <div class="program__floor"><div class="program__lvl">First</div><ul><li>Foyer</li><li>Living &amp; informal living</li><li>Kitchen / dining</li><li>Service kitchen &amp; wash</li><li>Balcony</li></ul></div>
      <div class="program__floor"><div class="program__lvl">Second</div><ul><li>Bedroom &amp; att. toilet</li><li>Home theatre</li><li>Open terrace</li><li>Pooja room</li><li>Common toilet</li></ul></div>
      <div class="program__floor"><div class="program__lvl">Third</div><ul><li>Three bedrooms</li><li>Attached toilets</li></ul></div>
      <div class="program__floor"><div class="program__lvl">Terrace</div><ul><li>Lounge area</li><li>Jacuzzi</li><li>Terrace garden</li><li>Library</li></ul></div>
    </div>
  </div>
</section>

<section class="section section--ink" style="text-align:center">
  <div class="container reveal">
    <p class="eyebrow no-rule" style="justify-content:center">Keep exploring</p>
    <h2 class="h-lg" style="margin-bottom:34px">More of our work</h2>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a href="projects-architecture.html" class="btn btn--ghost-light">All architecture</a>
      <a href="contact.html" class="btn btn--ghost-light">Start a project ${ARROW}</a>
    </div>
  </div>
</section>`;


const junebhai = `
<div class="pd-hero">
  <img src="${IMG3}02-dusk.webp" alt="Junebhai Residence at dusk" />
  <div class="pd-hero__cap"><div class="container"><span class="tag" style="color:#bfd3ad">Architecture — Residential</span><h1>Junebhai Residence</h1></div></div>
</div>

<section class="section" style="padding-bottom:clamp(40px,6vw,70px)">
  <div class="container wrap-narrow reveal">
    <p class="eyebrow">The project</p>
    <p class="lead">A green, terraced residence where architecture and planting grow together — a board-formed concrete frame layered with cascading creepers, deep planted balconies and a perforated brick-jaali screen that crowns the upper floor.</p>
    <p class="muted">Corner glazing opens the living spaces to light and the street, while the jaali and timber louvers filter the Surat sun and give privacy above. Trailing greenery softens every edge, turning the façade into a living, seasonal thing; by evening, warm interior light glows between the planted tiers.</p>
  </div>
  <div class="container" style="margin-top:clamp(40px,5vw,60px)">
    <div class="pd-meta reveal">
      <div><div class="k">Type</div><div class="v">Residential</div></div>
      <div><div class="k">Site</div><div class="v">Surat, Gujarat</div></div>
      <div><div class="k">Scope</div><div class="v">Architecture &amp; Façade</div></div>
      <div><div class="k">Stage</div><div class="v">Design Visualisation</div></div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <figure class="pd-figure reveal" style="margin-bottom:clamp(14px,2vw,22px)">
      <img src="${IMG3}01-day.webp" alt="Junebhai Residence by day" />
      <figcaption>Daylight — planted balconies and the brick-jaali crown in full detail.</figcaption>
    </figure>
    <div class="pd-duo reveal d1" style="margin-bottom:clamp(14px,2vw,22px)">
      <figure class="pd-figure"><img src="${IMG3}04-day-front.webp" alt="Junebhai Residence — street elevation by day" /></figure>
      <figure class="pd-figure"><img src="${IMG3}03-night.webp" alt="Junebhai Residence — street elevation at night" /></figure>
    </div>
    <figure class="pd-figure reveal">
      <img src="${IMG3}05-front-alt.webp" alt="Junebhai Residence — front elevation" />
      <figcaption>The layered façade — stone, timber, jaali and green.</figcaption>
    </figure>
  </div>
</section>

<section class="section section--paper2" style="text-align:center">
  <div class="container reveal">
    <p class="eyebrow no-rule" style="justify-content:center">Keep exploring</p>
    <h2 class="h-lg" style="margin-bottom:34px">More of our work</h2>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a href="projects.html" class="btn">All projects</a>
      <a href="contact.html" class="btn btn--clay">Start a project ${ARROW}</a>
    </div>
  </div>
</section>`;

const kalpeshbhai = `
<div class="pd-hero">
  <img src="${IMG4}01-night.webp" alt="Kalpeshbhai Residence at night" />
  <div class="pd-hero__cap"><div class="container"><span class="tag" style="color:#e8b49a">Architecture — Residential</span><h1>Kalpeshbhai Residence</h1></div></div>
</div>

<section class="section" style="padding-bottom:clamp(40px,6vw,70px)">
  <div class="container wrap-narrow reveal">
    <p class="eyebrow">The project</p>
    <p class="lead">A bold family home where deep terracotta-rendered piers rise past board-formed concrete volumes, threaded with vertical gardens and tall timber-jaali screens that filter light and frame the terraces.</p>
    <p class="muted">The composition sets warm, earthy render against cool grey concrete, with creepers climbing the full height of the façade and a planted street-edge terrace softening the base. Full-height glazing and cantilevered balconies open the living spaces outward; by night, warm uplighting rakes the piers and the jaali glows from within.</p>
  </div>
  <div class="container" style="margin-top:clamp(40px,5vw,60px)">
    <div class="pd-meta reveal">
      <div><div class="k">Type</div><div class="v">Residential</div></div>
      <div><div class="k">Site</div><div class="v">Surat, Gujarat</div></div>
      <div><div class="k">Scope</div><div class="v">Architecture &amp; Façade</div></div>
      <div><div class="k">Stage</div><div class="v">Design Visualisation</div></div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <figure class="pd-figure reveal" style="margin-bottom:clamp(14px,2vw,22px)">
      <img src="${IMG4}02-day.webp" alt="Kalpeshbhai Residence by day" />
      <figcaption>Daylight — terracotta piers, concrete and vertical gardens in full detail.</figcaption>
    </figure>
    <div class="pd-duo reveal d1" style="margin-bottom:clamp(14px,2vw,22px)">
      <figure class="pd-figure"><img src="${IMG4}04-day-rear.webp" alt="Kalpeshbhai Residence — rear view by day" /></figure>
      <figure class="pd-figure"><img src="${IMG4}03-night-rear.webp" alt="Kalpeshbhai Residence — rear view at night" /></figure>
    </div>
    <figure class="pd-figure reveal">
      <img src="${IMG4}05-front.webp" alt="Kalpeshbhai Residence — street elevation" />
      <figcaption>Street elevation — the timber jaali and planted terrace along the front.</figcaption>
    </figure>
  </div>
</section>

<section class="section section--paper2" style="text-align:center">
  <div class="container reveal">
    <p class="eyebrow no-rule" style="justify-content:center">Keep exploring</p>
    <h2 class="h-lg" style="margin-bottom:34px">More of our work</h2>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a href="projects.html" class="btn">All projects</a>
      <a href="contact.html" class="btn btn--clay">Start a project ${ARROW}</a>
    </div>
  </div>
</section>`;

const kamalbhai = `
<div class="pd-hero">
  <img src="${IMG5}01-night.webp" alt="Kamalbhai Residence at night" />
  <div class="pd-hero__cap"><div class="container"><span class="tag" style="color:#e2c39c">Architecture — Residential</span><h1>Kamalbhai Residence</h1></div></div>
</div>

<section class="section" style="padding-bottom:clamp(40px,6vw,70px)">
  <div class="container wrap-narrow reveal">
    <p class="eyebrow">The project</p>
    <p class="lead">A calm, contemporary home in board-formed concrete and warm timber — clean stacked volumes softened by full-height wood-slat panels, deep planted balconies and trailing green that spills from every level.</p>
    <p class="muted">Grey concrete grids the façade into quiet bays, while cedar-toned slats warm the entrances and screen the terraces. Corner glazing and generous openings pull daylight deep inside; by night, the timber glows and the greenery reads as soft silhouettes against the lit interiors — a restrained, liveable balance of raw material and planting.</p>
  </div>
  <div class="container" style="margin-top:clamp(40px,5vw,60px)">
    <div class="pd-meta reveal">
      <div><div class="k">Type</div><div class="v">Residential</div></div>
      <div><div class="k">Site</div><div class="v">Surat, Gujarat</div></div>
      <div><div class="k">Scope</div><div class="v">Architecture &amp; Façade</div></div>
      <div><div class="k">Stage</div><div class="v">Design Visualisation</div></div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <figure class="pd-figure reveal" style="margin-bottom:clamp(14px,2vw,22px)">
      <img src="${IMG5}02-day.webp" alt="Kamalbhai Residence by day" />
      <figcaption>Daylight — concrete, timber slats and planted balconies in full detail.</figcaption>
    </figure>
    <div class="pd-duo reveal d1" style="margin-bottom:clamp(14px,2vw,22px)">
      <figure class="pd-figure"><img src="${IMG5}04-day-front.webp" alt="Kamalbhai Residence — street elevation by day" /></figure>
      <figure class="pd-figure"><img src="${IMG5}03-night-front.webp" alt="Kamalbhai Residence — street elevation at night" /></figure>
    </div>
    <figure class="pd-figure reveal">
      <img src="${IMG5}05-day-tall.webp" alt="Kamalbhai Residence — front elevation" />
      <figcaption>Front elevation — the timber-clad core and layered balconies.</figcaption>
    </figure>
  </div>
</section>

<section class="section section--paper2" style="text-align:center">
  <div class="container reveal">
    <p class="eyebrow no-rule" style="justify-content:center">Keep exploring</p>
    <h2 class="h-lg" style="margin-bottom:34px">More of our work</h2>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a href="projects.html" class="btn">All projects</a>
      <a href="contact.html" class="btn btn--clay">Start a project ${ARROW}</a>
    </div>
  </div>
</section>`;

const mukeshbhai = `
<div class="pd-hero">
  <img src="${IMG6}01-night.webp" alt="Mukeshbhai Residence at night" />
  <div class="pd-hero__cap"><div class="container"><span class="tag" style="color:#e6c1a0">Architecture — Residential</span><h1>Mukeshbhai Residence</h1></div></div>
</div>

<section class="section" style="padding-bottom:clamp(40px,6vw,70px)">
  <div class="container wrap-narrow reveal">
    <p class="eyebrow">The project</p>
    <p class="lead">A crisp, cubic villa in white and sage — clean panelised volumes cut by a tall exposed-brick jaali that glows like a lantern at the entrance, its perforations dissolving from solid to open as they rise.</p>
    <p class="muted">Interlocking stone-grey and white masses stack and cantilever to frame planted balconies and a sheltered entry court, while full-height glazing and sheer curtains soften the geometry. The single warm brick element anchors the composition against the pale façade; concealed uplighting turns the house luminous after dark.</p>
  </div>
  <div class="container" style="margin-top:clamp(40px,5vw,60px)">
    <div class="pd-meta reveal">
      <div><div class="k">Type</div><div class="v">Residential</div></div>
      <div><div class="k">Site</div><div class="v">Surat, Gujarat</div></div>
      <div><div class="k">Scope</div><div class="v">Architecture &amp; Façade</div></div>
      <div><div class="k">Stage</div><div class="v">Design Visualisation</div></div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <figure class="pd-figure reveal" style="margin-bottom:clamp(14px,2vw,22px)">
      <img src="${IMG6}03-day-front.jpg" alt="Mukeshbhai Residence — entrance by day" />
      <figcaption>Daylight — the brick jaali against the white and sage volumes.</figcaption>
    </figure>
    <div class="pd-duo reveal d1" style="margin-bottom:clamp(14px,2vw,22px)">
      <figure class="pd-figure"><img src="${IMG6}02-night-front.webp" alt="Mukeshbhai Residence — entrance at night" /></figure>
      <figure class="pd-figure"><img src="${IMG6}05-day-street.jpg" alt="Mukeshbhai Residence — street view by day" /></figure>
    </div>
    <figure class="pd-figure reveal">
      <img src="${IMG6}04-night-street.webp" alt="Mukeshbhai Residence — street view at night" />
      <figcaption>Night — the massing reads as glowing, stacked volumes from the street.</figcaption>
    </figure>
  </div>
</section>

<section class="section section--paper2" style="text-align:center">
  <div class="container reveal">
    <p class="eyebrow no-rule" style="justify-content:center">Keep exploring</p>
    <h2 class="h-lg" style="margin-bottom:34px">More of our work</h2>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a href="projects.html" class="btn">All projects</a>
      <a href="contact.html" class="btn btn--clay">Start a project ${ARROW}</a>
    </div>
  </div>
</section>`;

const kamleshbhai = `
<div class="pd-hero">
  <img src="${IMG7}01-front.jpg" alt="Kamleshbhai Residence" />
  <div class="pd-hero__cap"><div class="container"><span class="tag" style="color:#e6cbb0">Architecture — Residential</span><h1>Kamleshbhai Residence</h1></div></div>
</div>

<section class="section" style="padding-bottom:clamp(40px,6vw,70px)">
  <div class="container wrap-narrow reveal">
    <p class="eyebrow">The project</p>
    <p class="lead">A warm, earthen family home where clay-toned render meets banded rammed-earth-textured stone and teak — quiet, grounded volumes arranged around a private courtyard and softened by desert planting.</p>
    <p class="muted">A double-height stone entrance portal frames a full-height teak door, while a taller rendered block rises behind for the upper rooms. The palette is deliberately of the earth — sandy render, striated stone and timber — and the design turns inward to a sheltered garden. A jaali compound wall gives privacy, and a full run of rooftop solar makes the house quietly self-sufficient.</p>
  </div>
  <div class="container" style="margin-top:clamp(40px,5vw,60px)">
    <div class="pd-meta reveal">
      <div><div class="k">Type</div><div class="v">Residential</div></div>
      <div><div class="k">Site</div><div class="v">Surat, Gujarat</div></div>
      <div><div class="k">Scope</div><div class="v">Architecture &amp; Landscape</div></div>
      <div><div class="k">Stage</div><div class="v">Design Visualisation</div></div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <figure class="pd-figure reveal" style="margin-bottom:clamp(14px,2vw,22px)">
      <img src="${IMG7}05-aerial.jpg" alt="Kamleshbhai Residence — aerial view" />
      <figcaption>Aerial — the plan wraps a private courtyard; rooftop solar crowns the massing.</figcaption>
    </figure>
    <div class="pd-duo reveal d1" style="margin-bottom:clamp(14px,2vw,22px)">
      <figure class="pd-figure"><img src="${IMG7}02-rear-angle.jpg" alt="Kamleshbhai Residence — garden elevation" /></figure>
      <figure class="pd-figure"><img src="${IMG7}03-side.jpg" alt="Kamleshbhai Residence — courtyard elevation" /></figure>
    </div>
    <figure class="pd-figure reveal">
      <img src="${IMG7}04-rear.jpg" alt="Kamleshbhai Residence — rear elevation" />
      <figcaption>Rear elevation — rammed-earth-textured stone meets warm clay render.</figcaption>
    </figure>
  </div>
</section>

<section class="section section--paper2" style="text-align:center">
  <div class="container reveal">
    <p class="eyebrow no-rule" style="justify-content:center">Keep exploring</p>
    <h2 class="h-lg" style="margin-bottom:34px">More of our work</h2>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a href="projects.html" class="btn">All projects</a>
      <a href="contact.html" class="btn btn--clay">Start a project ${ARROW}</a>
    </div>
  </div>
</section>`;

const sudhirbhai = `
<div class="pd-hero">
  <img src="${IMG8}03-night-front.webp" alt="Sudhirbhai Residence at night" />
  <div class="pd-hero__cap"><div class="container"><span class="tag" style="color:#e0b39a">Architecture — Residential</span><h1>Sudhirbhai Residence</h1></div></div>
</div>

<section class="section" style="padding-bottom:clamp(40px,6vw,70px)">
  <div class="container wrap-narrow reveal">
    <p class="eyebrow">The project</p>
    <p class="lead">A contemporary apartment building where pale stone and grey panels are framed by bands and piers of exposed red brick — deep, recessed balconies stacked up a corner that turns the street with quiet confidence.</p>
    <p class="muted">Punched openings and full-height glazing are set into stone surrounds, while brick wraps the corner and grounds the base at the sheltered parking level. A timber-lined pavilion caps the roof, catching light and giving the block a crown. The material pairing — cool stone against warm brick — keeps the elevation ordered yet tactile.</p>
  </div>
  <div class="container" style="margin-top:clamp(40px,5vw,60px)">
    <div class="pd-meta reveal">
      <div><div class="k">Type</div><div class="v">Residential</div></div>
      <div><div class="k">Site</div><div class="v">Surat, Gujarat</div></div>
      <div><div class="k">Scope</div><div class="v">Architecture &amp; Façade</div></div>
      <div><div class="k">Stage</div><div class="v">Design Visualisation</div></div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <figure class="pd-figure reveal" style="margin-bottom:clamp(14px,2vw,22px)">
      <img src="${IMG8}02-day-corner.webp" alt="Sudhirbhai Residence — corner view by day" />
      <figcaption>Daylight — stone and grey panels framed by exposed red brick.</figcaption>
    </figure>
    <div class="pd-duo reveal d1" style="margin-bottom:clamp(14px,2vw,22px)">
      <figure class="pd-figure"><img src="${IMG8}01-night-corner.webp" alt="Sudhirbhai Residence — corner at night" /></figure>
      <figure class="pd-figure"><img src="${IMG8}04-day-front.webp" alt="Sudhirbhai Residence — street elevation by day" /></figure>
    </div>
  </div>
</section>

<section class="section section--paper2" style="text-align:center">
  <div class="container reveal">
    <p class="eyebrow no-rule" style="justify-content:center">Keep exploring</p>
    <h2 class="h-lg" style="margin-bottom:34px">More of our work</h2>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a href="projects.html" class="btn">All projects</a>
      <a href="contact.html" class="btn btn--clay">Start a project ${ARROW}</a>
    </div>
  </div>
</section>`;

const NIMG = 'assets/projects/nehalbhai/';
const nehalbhai = `
<div class="pd-hero pd-hero--tall">
  <img src="${NIMG}hero.webp" alt="Nehalbhai Residence — living room" />
  <div class="pd-hero__cap"><div class="container">
    <span class="tag" style="color:#e6b7a3">Interior Design — Residential · Surat</span>
    <h1>Nehalbhai Residence</h1>
    <p class="pd-hero__sub">A raw industrial shell, warmed by terracotta and light.</p>
  </div></div>
</div>

<section class="section pd-intro">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">The project</p>
        <h2 class="statement">The raw hallmarks of <em>industrial</em> design — exposed concrete and copper — softened with warm, modern living.</h2>
      </div>
      <div class="reveal d1">
        <p class="lead">Micro-cement walls, a ribbed concrete ceiling and surface-mounted copper conduits set the structural key. Against it, textured terracotta sofas, geometric glass tables, sheer drapes and indoor greenery bring warmth and calm.</p>
        <p class="muted">The interior is composed as a single, continuous idea with the architecture that holds it — a comprehensive approach where every material, fixture and line is resolved together. Diffused daylight softens the shell by day; exposed copper track lighting and frosted milk-glass globes warm it by night.</p>
      </div>
    </div>
  </div>
  <div class="container" style="margin-top:clamp(46px,6vw,72px)">
    <div class="pd-meta reveal">
      <div><div class="k">Scope</div><div class="v">Interior Design</div></div>
      <div><div class="k">Style</div><div class="v">Industrial · Warm</div></div>
      <div><div class="k">Palette</div><div class="v">Concrete &amp; terracotta</div></div>
      <div><div class="k">Stage</div><div class="v">Design Visualisation</div></div>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal"><p class="eyebrow">Colour psychology</p><h2 class="h-lg">Cold structure, warm energy.</h2></div>
      <div class="reveal d1 cpsych">
        <div class="cpsych__item"><div class="cpsych__k">Concrete</div><p>A calm, stable, neutral foundation.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Terracotta</div><p>Warmth, energy and a cosy, welcoming feel.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Greenery</div><p>Brings life and softens the harsh industrial lines.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Copper</div><p>A touch of warm, reflective sophistication.</p></div>
      </div>
    </div>
    <div class="matstrip reveal">
      <span>Wood</span><span>Metal</span><span>Glass</span><span>Fabric</span><span>Micro-cement</span>
    </div>
  </div>
</section>

<section class="pd-showcase">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Visualisation</p>
      <h2 class="h-lg">The spaces.</h2>
    </div>
    <div class="pd-full-grid reveal">
      <figure class="pd-full"><img src="${NIMG}space-01.webp" alt="Nehalbhai Residence — living room" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${NIMG}space-02.webp" alt="Nehalbhai Residence — master bedroom" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${NIMG}space-03.webp" alt="Nehalbhai Residence — bedroom" loading="lazy" /></figure>
    </div>
  </div>
  <div class="container">
    <div class="pd-sec-head reveal pd-showcase__sub">
      <h2 class="h-lg">Room by room.</h2>
    </div>
  </div>
  <div class="slideshow reveal" data-autoplay="5500" aria-roledescription="carousel" aria-label="Nehalbhai Residence renders">
    <div class="slideshow__viewport">
      <figure class="slide is-active" data-cap="Bedroom — micro-cement walls and a warm timber base."><img src="${NIMG}slide-01.webp" alt="Nehalbhai Residence — bedroom" /></figure>
      <figure class="slide" data-cap="Living room — terracotta sofas against the concrete shell."><img src="${NIMG}slide-02.webp" alt="Nehalbhai Residence — living room" loading="lazy" /></figure>
      <figure class="slide" data-cap="Living room — glass tables, greenery and layered rugs."><img src="${NIMG}slide-03.webp" alt="Nehalbhai Residence — living room seating" loading="lazy" /></figure>
      <figure class="slide" data-cap="Master bedroom — a warm accent wall and floating console."><img src="${NIMG}slide-04.webp" alt="Nehalbhai Residence — master bedroom" loading="lazy" /></figure>
      <figure class="slide" data-cap="Dining — copper-toned steel-mesh screen and daylight."><img src="${NIMG}slide-05.webp" alt="Nehalbhai Residence — dining" loading="lazy" /></figure>
      <figure class="slide" data-cap="Lounge — sheer drapes framing the balcony beyond."><img src="${NIMG}slide-06.webp" alt="Nehalbhai Residence — lounge" loading="lazy" /></figure>
    </div>
    <button class="slideshow__nav slideshow__nav--prev" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 5l-7 7 7 7"/></svg></button>
    <button class="slideshow__nav slideshow__nav--next" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 5l7 7-7 7"/></svg></button>
    <div class="slideshow__bar">
      <div class="container slideshow__bar-inner">
        <span class="slideshow__cap">Bedroom — micro-cement walls and a warm timber base.</span>
        <div class="slideshow__dots" role="tablist"></div>
        <span class="slideshow__counter"><span class="cur">01</span><span class="sep">&thinsp;/&thinsp;</span><span class="total">06</span></span>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Details</p>
      <h2 class="h-lg">Where the warmth lives.</h2>
    </div>
    <div class="pd-details reveal">
      <figure class="pd-detail"><img src="${NIMG}detail-01.webp" alt="Nehalbhai Residence — copper-toned steel-mesh partition" loading="lazy" /></figure>
      <figure class="pd-detail"><img src="${NIMG}detail-02.webp" alt="Nehalbhai Residence — kitchen" loading="lazy" /></figure>
      <figure class="pd-detail"><img src="${NIMG}detail-03.webp" alt="Nehalbhai Residence — dining" loading="lazy" /></figure>
      <figure class="pd-detail"><img src="${NIMG}detail-04.webp" alt="Nehalbhai Residence — bathroom" loading="lazy" /></figure>
      <figure class="pd-detail"><img src="${NIMG}detail-05.webp" alt="Nehalbhai Residence — powder room" loading="lazy" /></figure>
      <figure class="pd-detail"><img src="${NIMG}detail-06.webp" alt="Nehalbhai Residence — bedroom" loading="lazy" /></figure>
    </div>
  </div>
</section>

<section class="section section--ink" style="text-align:center">
  <div class="container reveal">
    <p class="eyebrow no-rule" style="justify-content:center">Keep exploring</p>
    <h2 class="h-lg" style="margin-bottom:34px">More of our work</h2>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a href="projects-interior.html" class="btn btn--ghost-light">All interiors</a>
      <a href="contact.html" class="btn btn--ghost-light">Start a project ${ARROW}</a>
    </div>
  </div>
</section>`;

const services = `
<section class="dsec">
  <div class="container">
    <div class="whead reveal">
      <span class="whead__ghost" aria-hidden="true">Discipline</span>
      <p class="eyebrow">What we do</p>
      <h1 class="whead__title display" style="font-size:clamp(44px,7vw,96px)">Discipline.</h1>
    </div>
    <p class="lead reveal" style="max-width:600px;margin-top:18px">Three connected disciplines under one roof — architecture, interiors and furniture, integrated into a single, comprehensive approach to transforming spaces.</p>
  </div>
  <div class="dcols">
    ${dcol('01', 'Architecture', 'architecture', IMG + '01-day.webp', 'Surat, Gujarat')}
    ${dcol('02', 'Interior Design', 'interior', 'assets/interior/living-room.webp', 'Residential · Commercial')}
    ${dcol('03', 'Product Design', 'product', 'assets/product/mesh-chair.webp', 'Furniture & Objects')}
  </div>
</section>

<section class="section section--ink">
  <div class="container">
    <div class="reveal" style="max-width:640px;margin-bottom:clamp(40px,5vw,64px)"><p class="eyebrow">How we work</p><h2 class="h-lg">From first sketch to finished object.</h2></div>
    <div class="steps reveal">
      <div class="step"><div class="step__n">01</div><h4>Sketch</h4><p>Ideas begin on paper — concept studies that capture the intent.</p></div>
      <div class="step"><div class="step__n">02</div><h4>Plan</h4><p>Rough thinking is resolved into a considered, comprehensive plan.</p></div>
      <div class="step"><div class="step__n">03</div><h4>Craft</h4><p>Production is set in motion with custom craftsmanship.</p></div>
      <div class="step"><div class="step__n">04</div><h4>Deliver</h4><p>The space or piece is refined, resolved and handed over.</p></div>
    </div>
  </div>
</section>

<section class="cta section">
  <div class="container reveal">
    <h2>Not sure which service you need?</h2>
    <p>Tell us about your project and we'll point you to the right starting point — no obligation.</p>
    <a href="contact.html" class="btn btn--ghost-light">Talk to us ${ARROW}</a>
  </div>
</section>`;

const about = `
<section class="section" style="padding-top:clamp(120px,15vh,190px)">
  <div class="container grid-2 top">
    <div class="reveal">
      <p class="eyebrow">The studio</p>
      <h1 class="display" style="font-size:clamp(42px,6vw,86px)">Tvastra<br />Design LLP</h1>
    </div>
    <div class="reveal d1">
      <p class="lead">A firm dedicated to architecture, interior design and product design. With a legacy of 29 years, we have been a pioneering force in shaping architectural landscapes, crafting inspired interiors, and producing exquisite furniture.</p>
      <p class="muted">Our philosophy revolves around the fusion of innovation and custom craftsmanship — seamlessly blending historical elegance with contemporary aesthetics, so every project is a masterpiece of both.</p>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="container grid-2 top">
    <div class="reveal"><p class="eyebrow">Our vision</p><h2 class="statement">Every home a <em>sanctuary</em> of comfort, style and individuality.</h2></div>
    <div class="reveal d1">
      <p class="muted">We envision a world where every home is a sanctuary of comfort, style and individuality — and we commit to being the catalyst for that transformation, redefining the entire design experience.</p>
      <p class="muted">We are unwavering in our belief to source responsibly, to champion ethical practices, and to create living spaces that resonate with our clients' desires while respecting the environment. Our commitment revolves around timeless design, durability and affordability.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="reveal" style="margin-bottom:6px"><p class="eyebrow">What guides us</p><h2 class="h-lg">Our principles.</h2></div>
    <div class="disc reveal">
      <div class="disc__row"><div class="disc__n">01</div><h3>Innovation &amp; craft</h3><div class="muted">The fusion of innovation and custom craftsmanship sits at the heart of everything we make.</div></div>
      <div class="disc__row"><div class="disc__n">02</div><h3>Elegance, old &amp; new</h3><div class="muted">We blend historical elegance with contemporary aesthetics, so our work feels both timeless and current.</div></div>
      <div class="disc__row"><div class="disc__n">03</div><h3>Form meets function</h3><div class="muted">Every design integrates utility, aesthetics, functionality and style into a single, resolved idea.</div></div>
      <div class="disc__row"><div class="disc__n">04</div><h3>Responsible &amp; lasting</h3><div class="muted">We source responsibly and build to last — timeless design, durability and affordability, made to be lived with.</div></div>
    </div>
  </div>
</section>

<section class="section section--ink">
  <div class="container">
    <div class="stats reveal" style="border:0;padding:0;margin:0">
      <div class="stat"><div class="n">29</div><div class="l">Years of experience</div></div>
      <div class="stat"><div class="n">3</div><div class="l">Design disciplines</div></div>
      <div class="stat"><div class="n">2023</div><div class="l">A&amp;D Platinum Winner</div></div>
      <div class="stat"><div class="n">Surat</div><div class="l">Gujarat, India</div></div>
    </div>
    <p class="muted reveal" style="text-align:center;margin-top:40px;font-size:15px">Platinum Winner — Architecture &amp; Design Collection Awards 2023.&nbsp; Led by designated partners Bhavin Ghanshyambhai Swami &amp; Alpaben Bhavinbhai Swami.</p>
  </div>
</section>

<section class="cta section">
  <div class="container reveal">
    <h2>Let's build something worth returning to.</h2>
    <p>A home, a workspace, an interior or a single piece of furniture — we'd love to hear what you're planning.</p>
    <a href="contact.html" class="btn btn--ghost-light">Get in touch ${ARROW}</a>
  </div>
</section>`;

const contact = `
<section class="section" style="padding-top:clamp(120px,15vh,190px)">
  <div class="container reveal" style="max-width:760px;margin-bottom:clamp(40px,5vw,60px)">
    <p class="eyebrow">Say hello</p>
    <h1 class="display" style="font-size:clamp(44px,7vw,96px)">Let's talk.</h1>
    <p class="lead" style="margin-top:22px">Tell us a little about your project — the site, the idea, the timeline — and we'll get back to you within a couple of working days.</p>
  </div>
  <div class="container contact-grid">
    <div class="reveal">
      <div class="cinfo"><div class="k">Studio</div><div class="v">Patel Faliyu, near Pal–Umra Bridge,<br />opp. Karuna Sagar Temple, Umra Rd,<br />Athwalines, Surat, Gujarat 395007</div></div>
      <div class="cinfo"><div class="k">Email</div><div class="v"><a href="mailto:info@tvastra.design">info@tvastra.design</a></div></div>
      <div class="cinfo"><div class="k">Phone</div><div class="v"><a href="tel:+919081813231">+91 90818 13231</a></div></div>
      <div class="cinfo"><div class="k">Hours</div><div class="v">Mon – Sat, 10:00 – 18:00</div></div>
      <div class="socials" style="margin-top:16px">
        <a href="https://www.instagram.com/tvastradesignllp/" aria-label="Instagram" target="_blank" rel="noopener" style="border-color:var(--line)">${IG}</a>
        <a href="#" aria-label="LinkedIn" style="border-color:var(--line)">${LI}</a>
      </div>
    </div>
    <div class="reveal d1">
      <form id="contact-form" novalidate>
        <div class="form-row">
          <div><label for="name">Name</label><input id="name" name="name" type="text" required /></div>
          <div><label for="email">Email</label><input id="email" name="email" type="email" required /></div>
        </div>
        <div class="form-row">
          <div><label for="phone">Phone</label><input id="phone" name="phone" type="tel" /></div>
          <div><label for="type">Project type</label>
            <select id="type" name="type"><option>Architecture</option><option>Interior design</option><option>Product / Furniture</option><option>Residential</option><option>Commercial</option><option>Other</option></select>
          </div>
        </div>
        <label for="message">About your project</label>
        <textarea id="message" name="message" rows="5" placeholder="Site location, rough size, timeline, and what you have in mind…"></textarea>
        <button type="submit" class="btn btn--clay">Send enquiry ${ARROW}</button>
        <p class="form-status" role="status" aria-live="polite" style="margin-top:16px"></p>
      </form>
    </div>
  </div>
</section>`;

const recognition = `
<section class="section" style="padding-top:clamp(120px,15vh,190px);padding-bottom:clamp(20px,3vw,40px)">
  <div class="container reveal" style="max-width:820px">
    <p class="eyebrow">Awards &amp; press</p>
    <h1 class="display" style="font-size:clamp(44px,7vw,96px)">Recognition.</h1>
    <p class="lead" style="margin-top:22px">Considered, crafted work — and the honours it has quietly earned along the way.</p>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <div class="rec-list reveal">
      <div class="rec-item">
        <div class="rec-item__year">2023</div>
        <div>
          <h3 class="rec-item__title">Platinum Winner</h3>
          <div class="rec-item__where">Architecture &amp; Design Collection Awards</div>
          <p class="muted" style="margin:0">Honoured for design that integrates utility, aesthetics, function and style into a single, considered whole.</p>
        </div>
        <span class="rec-item__tag">Award</span>
      </div>
    </div>
    <p class="muted reveal" style="margin-top:30px;font-size:15px">More awards and press features will appear here as they're announced. Have a feature to share? <a href="contact.html" class="link-arrow" style="font-size:12px">Get in touch ${ARROW}</a></p>
  </div>
</section>

<section class="section section--ink">
  <div class="container">
    <div class="stats reveal" style="border:0;padding:0;margin:0">
      <div class="stat"><div class="n">29</div><div class="l">Years of practice</div></div>
      <div class="stat"><div class="n">2023</div><div class="l">A&amp;D Platinum Winner</div></div>
      <div class="stat"><div class="n">3</div><div class="l">Design disciplines</div></div>
      <div class="stat"><div class="n">Surat</div><div class="l">Gujarat, India</div></div>
    </div>
    <p class="muted reveal" style="text-align:center;margin-top:40px;font-size:15px">Led by designated partners Bhavin Ghanshyambhai Swami &amp; Alpaben Bhavinbhai Swami.</p>
  </div>
</section>

<section class="cta section">
  <div class="container reveal">
    <h2>Let's create something worth celebrating.</h2>
    <p>Tell us about your project — we'd love to help shape it.</p>
    <a href="contact.html" class="btn btn--ghost-light">Get in touch ${ARROW}</a>
  </div>
</section>`;

const foundersMind = `
<div class="pd-hero pd-hero--tall fmind-hero">
  <img src="assets/founder/founder.webp" alt="The founder of Tvastra Design LLP" />
  <div class="pd-hero__cap"><div class="container">
    <span class="tag" style="color:#bfe0f2">The founder</span>
    <h1>Inside the founder's mind</h1>
    <p class="pd-hero__sub">Design since 1995 — a way of seeing, before it is a way of building.</p>
  </div></div>
</div>

<section class="section pd-intro">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">The journey</p>
        <h2 class="statement">It began in 1995 — in <em>college studies</em>, in practical training, and on site, learning how buildings really come together.</h2>
      </div>
      <div class="reveal d1">
        <p class="lead">Nearly three decades on, that hands-on beginning still shapes the way I work — moving between the drawing and the dust of the workshop, from the first sketch to the finished site.</p>
        <p class="muted">I have never seen architecture, interiors and the objects within them as separate crafts. They are one continuous idea — and my role is to hold that idea steady, across every scale and every discipline, until a space feels inevitable.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--ink">
  <div class="container">
    <div class="reveal" style="max-width:760px">
      <p class="eyebrow">What I believe</p>
      <h2 class="h-lg" style="margin-bottom:26px">Good design is quiet.</h2>
      <p class="lead" style="color:#cfd9e0">It does not announce itself. It earns its place through proportion, light and material — through the patience to resolve the unseen details, and the discipline to leave out everything that isn't needed.</p>
      <p class="muted" style="margin-top:16px">A home should feel like a sanctuary — comfortable, individual, and made to last. That belief, more than any style, is what carries through every project.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal"><p class="eyebrow">Where I work</p><h2 class="h-lg">Specialties.</h2></div>
      <ul class="approach reveal d1">
        <li>Architecture</li>
        <li>Interior design</li>
        <li>Product design</li>
        <li>Turn-key projects</li>
        <li>Project management</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--ink" style="text-align:center">
  <div class="container reveal">
    <p class="eyebrow no-rule" style="justify-content:center">Let's build something</p>
    <h2 class="h-lg" style="margin-bottom:34px">Start a conversation.</h2>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a href="about.html" class="btn btn--ghost-light">About the studio</a>
      <a href="contact.html" class="btn btn--ghost-light">Get in touch ${ARROW}</a>
    </div>
  </div>
</section>`;

/* ---------- assemble ---------- */
const PAGES = [
  { file: 'index.html',                id: 'home',      nav: 'index.html',    dark: true,  title: 'Tvastra Design LLP — Architecture, Interiors & Product Design', desc: 'Tvastra Design LLP — a 29-year architecture, interior and product design practice in Surat blending historical elegance with contemporary craft.', content: home },
  { file: 'recognition.html',          id: 'recognition', nav: 'recognition.html', dark: false, title: 'Recognition — Tvastra Design LLP', desc: 'Awards and recognition for Tvastra Design LLP, including the 2023 A&D Collection Platinum Award.', content: recognition },
  { file: 'projects.html',             id: 'projects',  nav: 'projects.html', dark: true,  title: 'Work — Tvastra Design LLP', desc: 'Selected architecture, interior and product design work by Tvastra Design LLP, including the Aashihbhai Residence.', content: projects },
  { file: 'projects-architecture.html', id: 'proj-arch', nav: 'projects.html', dark: true, title: 'Architecture Projects — Tvastra Design LLP', desc: 'Residential architecture projects by Tvastra Design LLP across Surat, Gujarat.', content: projArch },
  { file: 'projects-interior.html',    id: 'proj-int',  nav: 'projects.html', dark: true,  title: 'Interior Design Projects — Tvastra Design LLP', desc: 'Interior design work by Tvastra Design LLP — considered materials, custom furniture and contemporary warmth.', content: projInterior },
  { file: 'projects-product.html',     id: 'proj-prod', nav: 'projects.html', dark: true,  title: 'Product Design Projects — Tvastra Design LLP', desc: 'Furniture and product design by Tvastra Design LLP.', content: projProduct },
  { file: 'aashihbhai-residence.html', id: 'project',   nav: 'projects.html', dark: true,  title: 'Aashihbhai Residence — Tvastra Design LLP', desc: 'Aashihbhai Residence — a sculptural brick-and-concrete family home in Surat by Tvastra Design LLP.', content: aashihbhai },
  { file: 'junebhai-residence.html',   id: 'project3',  nav: 'projects.html', dark: true,  title: 'Junebhai Residence — Tvastra Design LLP', desc: 'Junebhai Residence — a green, terraced residence with cascading planting and a brick-jaali screen in Surat by Tvastra Design LLP.', content: junebhai },
  { file: 'kalpeshbhai-residence.html', id: 'project4', nav: 'projects.html', dark: true,  title: 'Kalpeshbhai Residence — Tvastra Design LLP', desc: 'Kalpeshbhai Residence — a terracotta-and-concrete family home with vertical gardens and timber-jaali screens in Surat by Tvastra Design LLP.', content: kalpeshbhai },
  { file: 'kamalbhai-residence.html',   id: 'project5', nav: 'projects.html', dark: true,  title: 'Kamalbhai Residence — Tvastra Design LLP', desc: 'Kamalbhai Residence — a concrete-and-timber family home with planted balconies and cascading greenery in Surat by Tvastra Design LLP.', content: kamalbhai },
  { file: 'mukeshbhai-residence.html',  id: 'project6', nav: 'projects.html', dark: true,  title: 'Mukeshbhai Residence — Tvastra Design LLP', desc: 'Mukeshbhai Residence — a crisp white-and-sage cubic villa with a glowing exposed-brick jaali in Surat by Tvastra Design LLP.', content: mukeshbhai },
  { file: 'kamleshbhai-residence.html', id: 'project7', nav: 'projects.html', dark: true,  title: 'Kamleshbhai Residence — Tvastra Design LLP', desc: 'Kamleshbhai Residence — a warm earthen courtyard home in clay render and rammed-earth-textured stone in Surat by Tvastra Design LLP.', content: kamleshbhai },
  { file: 'sudhirbhai-residence.html',  id: 'project8', nav: 'projects.html', dark: true,  title: 'Sudhirbhai Residence — Tvastra Design LLP', desc: 'Sudhirbhai Residence — a contemporary stone-and-brick apartment building with deep balconies and a rooftop pavilion in Surat by Tvastra Design LLP.', content: sudhirbhai },
  { file: 'nehalbhai-residence.html',   id: 'proj-nehal', nav: 'projects.html', dark: true, title: 'Nehalbhai Residence — Interior Design by Tvastra Design LLP', desc: 'Nehalbhai Residence — a raw industrial interior warmed with terracotta, copper and greenery in Surat by Tvastra Design LLP.', content: nehalbhai },
  { file: 'services.html',             id: 'services',  nav: 'services.html', dark: true,  title: 'Disciplines — Tvastra Design LLP', desc: 'Architecture, interior design and product design disciplines of Tvastra Design LLP.', content: services },
  { file: 'about.html',                id: 'about',     nav: 'about.html',    dark: false, title: 'Studio — Tvastra Design LLP', desc: 'About Tvastra Design LLP — a 29-year architecture, interior and product design practice; our philosophy, vision and principles.', content: about },
  { file: 'founders-mind.html',        id: 'founders-mind', nav: 'about.html', dark: true, title: "Inside the Founder's Mind — Tvastra Design LLP", desc: "Inside the founder's mind — designing since 1995 across architecture, interiors, product design, turn-key projects and project management.", content: foundersMind },
  { file: 'contact.html',              id: 'contact',   nav: 'contact.html',  dark: false, title: 'Contact — Tvastra Design LLP', desc: 'Get in touch with Tvastra Design LLP to discuss your architecture, interior or furniture project.', content: contact },
];

for (const p of PAGES) {
  const html = head(p.title, p.desc) + header(p.nav, p.dark) + p.content + FOOTER;
  fs.writeFileSync(path.join(ROOT, p.file), html);
  console.log('wrote', p.file);
}

/* ---------- preview bundle (SPA, data-URI images) ---------- */
if (process.argv[2] === 'preview') {
  const OUTP = process.argv[3] || path.join(ROOT, 'preview.html');
  const mime = { '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
  const OVERRIDE = process.env.PREVIEW_ASSETS || ''; // dir of downscaled, webp-encoded copies
  const cache = {};
  function toData(rel) {
    if (cache[rel]) return cache[rel];
    // Prefer a downscaled override copy (all re-encoded to webp) to keep the bundle small.
    if (OVERRIDE) {
      const ov = path.join(OVERRIDE, rel);
      if (fs.existsSync(ov)) {
        const uri = `data:image/webp;base64,${fs.readFileSync(ov).toString('base64')}`;
        cache[rel] = uri; return uri;
      }
    }
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) return rel;
    const ext = path.extname(rel).toLowerCase();
    const uri = `data:${mime[ext] || 'application/octet-stream'};base64,${fs.readFileSync(abs).toString('base64')}`;
    cache[rel] = uri; return uri;
  }
  const css = fs.readFileSync(path.join(ROOT, 'css/style.css'), 'utf8');
  const hmap = {}; PAGES.forEach(p => hmap[p.file] = '#' + p.id);

  function prep(content) {
    // data-URI images
    content = content.replace(/(src=")(assets\/[^"]+)(")/g, (m,a,rel,b) => a + toData(rel) + b);
    // *.html -> hash
    content = content.replace(/href="([a-z0-9-]+\.html)(#[a-z0-9-]+)?"/g, (m,f) => `href="${hmap[f] || ('#'+f)}"`);
    return content;
  }

  let sections = '';
  for (const p of PAGES) sections += `\n<div class="page" id="${p.id}" data-dark="${p.dark?1:0}">\n${prep(p.content)}\n</div>\n`;

  const navLinks = [['home','Home'],['services','Discipline'],['about','About Us'],['recognition','Recognition'],['contact','Contact Us']]
    .map(n => `<li><a href="#${n[0]}" data-page="${n[0]}">${n[1]}</a></li>`).join('');
  const spaHeader = `
<header class="site-header" id="hdr">
  <div class="container nav">
    <a class="brand" href="#home" data-page="home"><img class="logo-color" src="${toData('assets/logo.png')}" alt="Tvastra Design LLP" /><img class="logo-white" src="${toData('assets/logo-white.png')}" alt="Tvastra Design LLP" /></a>
    <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
    <ul class="nav-links">${navLinks}</ul>
  </div>
</header>`;
  const spaFooter = prep(FOOTER.replace(/<script src="js\/main\.js[^"]*"><\/script>/, '').replace('</body>','').replace('</html>',''));

  const spaScript = `
<script>
(function(){
  "use strict";
  var pages = [].slice.call(document.querySelectorAll('.page'));
  var navlinks = [].slice.call(document.querySelectorAll('.nav-links a[data-page]'));
  var links = document.querySelector('.nav-links');
  var toggle = document.querySelector('.nav-toggle');
  var hdr = document.getElementById('hdr');
  var scrollHandler = null;

  function setHeader(dark){
    if(scrollHandler){ window.removeEventListener('scroll', scrollHandler); scrollHandler = null; }
    hdr.classList.remove('solid','on-light');
    if(dark){
      scrollHandler = function(){ if(window.scrollY>40) hdr.classList.add('solid'); else hdr.classList.remove('solid'); };
      scrollHandler(); window.addEventListener('scroll', scrollHandler, {passive:true});
    } else { hdr.classList.add('solid','on-light'); }
  }
  function revealPage(page){
    var els = page.querySelectorAll('.reveal');
    els.forEach(function(el){ el.classList.remove('in'); });
    requestAnimationFrame(function(){ els.forEach(function(el,i){ setTimeout(function(){ el.classList.add('in'); }, Math.min(i*60,360)); }); });
  }
  function show(id){
    var page = document.getElementById(id);
    if(!page || !page.classList.contains('page')) id = 'home', page = document.getElementById('home');
    pages.forEach(function(p){ p.classList.toggle('active', p.id===id); });
    navlinks.forEach(function(a){ a.classList.toggle('active', a.getAttribute('data-page')===id); });
    if(links) links.classList.remove('open');
    if(toggle) toggle.setAttribute('aria-expanded','false');
    document.body.style.overflow='';
    setHeader(page.getAttribute('data-dark')==='1');
    hdr.classList.toggle('on-home', id==='home');
    window.scrollTo(0,0);
    revealPage(page);
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if(!a) return;
    var id = a.getAttribute('href').slice(1);
    if(id && document.getElementById(id) && document.getElementById(id).classList.contains('page')){
      e.preventDefault();
      if(history.replaceState) history.replaceState(null,'','#'+id);
      show(id);
    }
  });
  if(toggle && links){
    toggle.addEventListener('click', function(){
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open?'true':'false');
      document.body.style.overflow = open?'hidden':'';
    });
  }
  // filters
  var filters = document.querySelectorAll('#projects .filter');
  var cards = document.querySelectorAll('#projects .pgrid .pcard');
  filters.forEach(function(btn){ btn.addEventListener('click', function(){
    filters.forEach(function(f){ f.classList.remove('active'); }); btn.classList.add('active');
    var cat = btn.getAttribute('data-filter');
    cards.forEach(function(c){ var s = cat==='all'||c.getAttribute('data-cat')===cat; c.style.display = s?'':'none'; });
  }); });
  // form
  var form = document.querySelector('#contact-form');
  if(form) form.addEventListener('submit', function(e){ e.preventDefault(); var n=form.querySelector('.form-status'); if(n) n.textContent="Thank you — your enquiry has reached us. (Preview: not actually sent.)"; form.reset(); });

  // slideshow / carousel
  document.querySelectorAll('.slideshow').forEach(function(ss){
    if(ss.__init) return; ss.__init=true;
    var slides=[].slice.call(ss.querySelectorAll('.slide')); if(!slides.length) return;
    var dotsWrap=ss.querySelector('.slideshow__dots'), capEl=ss.querySelector('.slideshow__cap'), curEl=ss.querySelector('.slideshow__counter .cur');
    var idx=0; slides.forEach(function(s,i){ if(s.classList.contains('is-active')) idx=i; });
    var dots=slides.map(function(_,i){ var b=document.createElement('button'); b.className='dot'+(i===idx?' is-active':''); b.setAttribute('aria-label','Slide '+(i+1)); b.addEventListener('click',function(){go(i,true);}); if(dotsWrap)dotsWrap.appendChild(b); return b; });
    function go(n,user){ idx=(n+slides.length)%slides.length; slides.forEach(function(s,i){s.classList.toggle('is-active',i===idx);}); dots.forEach(function(d,i){d.classList.toggle('is-active',i===idx);}); if(curEl)curEl.textContent=('0'+(idx+1)).slice(-2); if(capEl)capEl.textContent=slides[idx].getAttribute('data-cap')||''; if(user)restart(); }
    var prev=ss.querySelector('.slideshow__nav--prev'), next=ss.querySelector('.slideshow__nav--next');
    if(prev)prev.addEventListener('click',function(){go(idx-1,true);});
    if(next)next.addEventListener('click',function(){go(idx+1,true);});
    var delay=parseInt(ss.getAttribute('data-autoplay'),10)||0, timer=null;
    function restart(){ if(!delay)return; clearInterval(timer); timer=setInterval(function(){go(idx+1);},delay); }
    ss.addEventListener('mouseenter',function(){clearInterval(timer);});
    ss.addEventListener('mouseleave',restart);
    var x0=null;
    ss.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
    ss.addEventListener('touchend',function(e){ if(x0===null)return; var dx=e.changedTouches[0].clientX-x0; if(Math.abs(dx)>40)go(idx+(dx<0?1:-1),true); x0=null; },{passive:true});
    restart();
  });

  var start = (location.hash||'#home').slice(1);
  show(document.getElementById(start)?start:'home');
})();
</script>`;

  const banner = `<div style="position:fixed;bottom:0;left:0;right:0;z-index:200;background:var(--ink);color:#d8cbb8;font:500 12px/1.4 var(--sans);letter-spacing:.02em;text-align:center;padding:8px 16px">Interactive preview — click through every page. Web-font rendering differs slightly from the deployed site.</div>`;

  const out = `<style>
${css}
.page{ display:none; } .page.active{ display:block; }
</style>
${spaHeader}
${sections}
${spaFooter}
${banner}
${spaScript}`;
  fs.writeFileSync(OUTP, out);
  console.log('wrote preview', OUTP, (out.length/1024/1024).toFixed(2)+' MB');
}
