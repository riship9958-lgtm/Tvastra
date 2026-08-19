/* ==========================================================================
   Tvastra Design LLP, static site builder
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
<link rel="icon" href="assets/favicon.ico?v=tdl" sizes="any" />
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png?v=tdl" />
<link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16.png?v=tdl" />
<link rel="apple-touch-icon" sizes="180x180" href="assets/favicon-180.png?v=tdl" />
${FONTS}
<link rel="stylesheet" href="css/style.css?v=${CSS_VER}" />
</head>
<body>`;
}

const NAV = [['index.html','Home'],['services.html','Discipline'],['about.html','About Us'],['gospels.html','Gospels'],['recognition.html','Recognition'],['careers.html','Careers'],['contact.html','Contact Us']];
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
    <a class="brand" href="index.html" aria-label="Tvastra Design LLP, home">
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
        <p class="footer-tag">The Power of Creativity</p>
        <p>Architecture, interiors &amp; product design, an established practice blending ethnical and cultural elegance with contemporary craft.</p>
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
          <a href="https://www.linkedin.com/company/tvastra-design-/" aria-label="LinkedIn" target="_blank" rel="noopener">${LI}</a>
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
const IMG = 'assets/projects/vritta/';
const IMG2 = 'assets/projects/dilipbhai/';
const IMG3 = 'assets/projects/rju/';
const IMG4 = 'assets/projects/jalika/';
const IMG5 = 'assets/projects/vallabh-nivas/';
const IMG6 = 'assets/projects/urdhva/';
const IMG7 = 'assets/projects/valuka/';
const IMG8 = 'assets/projects/asamvrta/';

// Central list of real projects, add one entry (+ a detail page) to publish a new project.
const PROJECTS_LIST = [
  { name: 'Vritta',  file: 'vritta.html',  cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG}06-night-corner.webp`,   feat: `${IMG}04-day-side.webp` },
  { name: 'Ṛju',    file: 'rju.html',    cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG3}02-dusk.webp`, feat: `${IMG3}02-dusk.webp` },
  { name: 'Jālikā', file: 'jalika.html', cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG4}01-night.webp`, feat: `${IMG4}01-night.webp` },
  { name: 'Vallabh Nivas',   file: 'vallabh-nivas.html',   cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG5}01-night.webp`, feat: `${IMG5}01-night.webp` },
  { name: 'Urdhva',  file: 'urdhva.html',  cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG6}02-night-street.webp`, feat: `${IMG6}02-night-street.webp` },
  { name: 'Vālukā', file: 'valuka.html', cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG7}06-dusk-corner.webp`, feat: `${IMG7}06-dusk-corner.webp` },
  { name: 'Asaṁvṛta',  file: 'asamvrta.html',  cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG8}01-night-corner.webp`, feat: `${IMG8}01-night-corner.webp` },
  { name: 'Metal Life',   file: 'metal-life.html',   cat: 'interior',     meta: 'Interior · Surat, Gujarat',    card: 'assets/projects/metal-life/hero.webp', feat: 'assets/projects/metal-life/hero.webp' },
  { name: 'Juneberry',    file: 'juneberry.html',    cat: 'interior',     meta: 'Café · Surat, Gujarat', side: 'Café &middot; Surat',       card: 'assets/projects/juneberry/counter.webp', feat: 'assets/projects/juneberry/counter.webp' },
  { name: 'Calibre',      file: 'calibre.html',      cat: 'interior',     meta: 'Boutique · Surat, Gujarat', side: 'Boutique &middot; Surat', card: 'assets/projects/calibre/hero.webp', feat: 'assets/projects/calibre/hero.webp' },
  { name: 'ICON',         file: 'icon.html',         cat: 'interior',     meta: 'Office · Surat, Gujarat', side: 'Office &middot; Surat', card: 'assets/projects/icon/hero.webp', feat: 'assets/projects/icon/hero.webp' },
  { name: 'Pyramid Palacia', file: 'pyramid-palacia.html', cat: 'interior', meta: 'Residence · Surat, Gujarat', side: 'Residence &middot; Surat', card: 'assets/projects/pyramid-palacia/hero.webp', feat: 'assets/projects/pyramid-palacia/hero.webp' },
];
// "Forthcoming" entries (no photography yet), none shown for now
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

// A discipline's projects, the tiles that belong to it, or a "coming soon" panel.
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
function pcol(num, p) { return dcard(num, p.file, p.card, p.name, p.side || 'Residential &middot; Surat'); }

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

// A discipline group on the projects overview page, numbered heading + a grid of project columns.
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
    body = first + more + `\n  <div class="container"><p class="pgrp__note reveal">Furniture, lighting, décor and bespoke pieces, designed and made in-house. <a href="contact.html" class="link-arrow">Enquire ${ARROW}</a></p></div>`;
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
  <div class="hero__media"><img src="assets/home/hero-bw.webp" alt="Tvastra Design, rammed-earth residence, black and white" /></div>
  <div class="container hero__inner">
    <p class="eyebrow">Architecture · Interiors · Objects</p>
    <h1>We shape spaces worth returning to.</h1>
    <p class="lead">Tvastra Design LLP is an established practice in Surat, blending ethnical and cultural elegance with contemporary craft, across architecture, interiors and the furniture within them.</p>
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
      <h2 class="statement">Named after the celestial architect, we design across scales, from the <em>building</em> to the <em>object</em> within it.</h2>
    </div>
    <div class="reveal d1">
      <p class="lead">For over three decades we have shaped architectural landscapes, crafted inspired interiors, and produced exquisite furniture, each project a fusion of innovation and custom craftsmanship.</p>
      <p class="muted">Our work integrates a sense of arrival where luxury is complemented by warmth. We wanted them to instantly feel both pride and comfort, knowing their home is not just beautiful but deeply livable.</p>
      <a href="about.html" class="link-arrow" style="margin-top:10px">About the studio ${ARROW}</a>
    </div>
  </div>
</section>

<section class="section section--ink founder">
  <div class="container">
    <div class="founder__grid reveal">
      <div class="founder__media"><img src="assets/founder/founder-portrait-bw.webp" alt="Founder, Tvastra Design LLP" loading="lazy" /></div>
      <div class="founder__body">
        <p class="eyebrow">The founder</p>
        <h2 class="h-lg">In the field of design since 1995.</h2>
        <p class="lead">Through college studies, practical training and years of field work, a practice built hands-on, from the first sketch to the finished site.</p>
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

<section class="section trust">
  <div class="container">
    <div class="trust__inner reveal">
      <p class="eyebrow no-rule" style="justify-content:center">Trusted by our clients</p>
      <h2 class="h-lg">Homes built on relationships, not just plans.</h2>
      <p class="lead" style="margin-top:18px">People come before projects. Families and developers have trusted Tvastra to shape their spaces with honesty, transparency and care, from the first conversation to the final handover.</p>
      <div class="clients">
        <img src="assets/clients/sangini.png" alt="Sangini" loading="lazy" />
        <img src="assets/clients/piramyd.png" alt="Piramyd Group" loading="lazy" />
        <img src="assets/clients/avadh.png" alt="Avadh" loading="lazy" />
        <img src="assets/clients/shaligram.png" alt="Shaligram" loading="lazy" />
        <img src="assets/clients/samarthya.png" alt="Samarthya" loading="lazy" />
        <img src="assets/clients/rajhans.png" alt="Rajhans" loading="lazy" />
        <img src="assets/clients/happy-home.png" alt="Happy Home Group" loading="lazy" />
        <img src="assets/clients/shott.png" alt="Shott" loading="lazy" />
        <img src="assets/clients/juneberry.png" alt="Juneberry" loading="lazy" />
      </div>
      <div class="trust__cta"><a href="contact.html" class="btn btn--clay">Start your project ${ARROW}</a></div>
    </div>
  </div>
</section>

<section class="section members">
  <div class="container">
    <div class="members__inner reveal">
      <p class="eyebrow no-rule" style="justify-content:center">Member of</p>
      <div class="members__logos">
        <img src="assets/members/asid.png" alt="Qualified ASID Interior Designer, Professional Practitioner &mdash; American Society of Interior Designers" loading="lazy" />
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
    <p class="lead reveal" style="max-width:600px;margin-top:18px">Our work, grouped by discipline, architecture, interiors and product design, each project a fusion of innovation and custom craftsmanship.</p>
  </div>
  ${projGroup('01', 'd-architecture', 'Architecture', 'architecture')}
  ${projGroup('02', 'd-interior', 'Interior Design', 'interior')}
  ${projGroup('03', 'd-product', 'Product Design', 'product')}
</section>
`;

const projArch = disciplinePage(
  'Architecture', 'Architecture', 'architecture',
  'Homes and buildings where structure, light and material resolve into one continuous idea, our residential architecture across Surat, Gujarat.'
);

const projInterior = disciplinePage(
  'Interiors', 'Interior Design', 'interior',
  'Interiors composed as carefully as the buildings that hold them, considered materials, custom furniture and a calm, contemporary warmth.',
  { href: 'services.html', img: 'assets/interior/living-room.webp', name: 'Living Room Study', side: 'Interior &middot; Surat' }
);

const projProduct = disciplinePage(
  'Objects', 'Product Design', 'product',
  'Furniture and objects designed and made in-house, the pieces that complete a Tvastra interior.',
  [
    { href: 'contact.html', img: 'assets/product/mesh-chair.webp', name: 'Furniture', side: 'Meshobase' },
    { href: 'contact.html', img: 'assets/product/lighting-pendants.webp', name: 'Lighting', side: 'Pendants' },
    { href: 'contact.html', img: 'assets/product/decor-lamp.webp', name: 'Decor', side: 'Objects' },
    { href: 'contact.html', img: 'assets/product/bespoke-workshop.webp', name: 'Bespoke', side: 'Made by hand' }
  ]
);

const vritta = `
<div class="pd-hero pd-hero--tall pd-hero--zoom pd-hero--sketch">
  <img src="${IMG}sketch-01.webp" alt="Vritta, concept sketch" />
  <div class="pd-hero__cap"><div class="container">
    <span class="tag" style="color:#9ecbe4">Architecture, Residential · Surat</span>
    <h1>Vritta</h1>
    <p class="pd-hero__sub">A sculptural family home in brick and board-formed concrete.</p>
  </div></div>
</div>

<section class="section pd-intro">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">The project</p>
        <h2 class="statement">A play of <em>solid</em> and void, brick stacked over concrete, terraces carved out, and circular apertures cut like lenses into the façade.</h2>
      </div>
      <div class="reveal d1">
        <p class="lead">The massing steps back as it rises, giving every level its own outdoor room. Vertical brick screens filter the Surat light and soften the concrete mass, while the round openings frame the sky and pull daylight deep into the plan.</p>
        <p class="muted">Planned to Vastu and built to breathe. Cavity walls temper heat and sound, stack ventilation moves air through the section, and a rainwater tank and solar-ready roof quietly carry the house toward self-sufficiency. At night, concealed uplights wash the textures and the apertures glow from within.</p>
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
    <p class="pd-credits reveal">Principal Designer <b>Bhavin Swami</b> &middot; Senior Architect <b></b></p>
  </div>
</section>

<section class="section pd-sketch">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Concept</p>
      <h2 class="h-lg">From the first line.</h2>
    </div>
    <div class="pd-sketch-grid reveal" style="grid-template-columns:1fr;max-width:920px;margin-inline:auto">
      <figure class="pd-sketch-fig"><img src="${IMG}sketch-01.webp" alt="Vritta, concept sketch, corner perspective" /></figure>
    </div>
    <p class="muted reveal pd-sketch-note">A hand study of the stepped massing, carved terraces and the circular apertures explored in line before the render.</p>
  </div>
</section>

<section class="pd-showcase">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Visualisation</p>
      <h2 class="h-lg">3D Elevation.</h2>
    </div>
    <div class="pd-full-grid pd-full-grid--elev reveal">
      <figure class="pd-full"><img src="${IMG}full-01.webp" alt="Vritta, full corner view by day" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IMG}full-02.webp" alt="Vritta, full aerial view" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IMG}full-03.webp" alt="Vritta, full side elevation with brick jaali" loading="lazy" /></figure>
    </div>
  </div>
  <div class="container">
    <div class="pd-sec-head reveal pd-showcase__sub">
      <h2 class="h-lg">Day to night.</h2>
    </div>
  </div>
  <div class="slideshow reveal" data-autoplay="5500" aria-roledescription="carousel" aria-label="Vritta renders">
    <div class="slideshow__viewport">
      <figure class="slide is-active" data-cap="Street corner, brick volumes stacked over the concrete base. Day."><img src="${IMG}slide-01.webp" alt="Vritta, street corner by day" /></figure>
      <figure class="slide" data-cap="The same corner after dark, the apertures glowing from within."><img src="${IMG}slide-02.webp" alt="Vritta, street corner at night" loading="lazy" /></figure>
      <figure class="slide" data-cap="Upper terraces and the circular oculus, threaded with greenery."><img src="${IMG}slide-03.webp" alt="Vritta, upper terraces by day" loading="lazy" /></figure>
      <figure class="slide" data-cap="Night, concealed uplights graze the brick screens."><img src="${IMG}slide-04.webp" alt="Vritta, dramatic night view" loading="lazy" /></figure>
      <figure class="slide" data-cap="Street elevation, brick jaali punctures the concrete plane."><img src="${IMG}slide-05.webp" alt="Vritta, street elevation by day" loading="lazy" /></figure>
      <figure class="slide" data-cap="Street elevation at night, the interiors warm behind the screen."><img src="${IMG}slide-06.webp" alt="Vritta, street elevation at night" loading="lazy" /></figure>
    </div>
    <button class="slideshow__nav slideshow__nav--prev" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 5l-7 7 7 7"/></svg></button>
    <button class="slideshow__nav slideshow__nav--next" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 5l7 7-7 7"/></svg></button>
    <div class="slideshow__bar">
      <div class="container slideshow__bar-inner">
        <span class="slideshow__cap">Street corner, brick volumes stacked over the concrete base. Day.</span>
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
        <li>Cavity walls, heat &amp; sound</li>
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


const rju = `
<div class="pd-hero pd-hero--tall pd-hero--zoom pd-hero--sketch">
  <img src="${IMG3}sketch-01.webp" alt="Ṛju, concept sketch" />
  <div class="pd-hero__cap"><div class="container">
    <span class="tag" style="color:#9ecbe4">Architecture, Residential · Surat</span>
    <h1>Ṛju</h1>
    <p class="pd-hero__sub">A green, terraced home wrapped in cascading gardens and a brick-jaali crown.</p>
  </div></div>
</div>

<section class="section pd-intro">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">The project</p>
        <h2 class="statement">Architecture and planting grown <em>together</em>, an exposed concrete frame, deep green balconies and a perforated brick-jaali screen crowning the top.</h2>
      </div>
      <div class="reveal d1">
        <p class="lead">On a compact 1,670 sq ft corner plot, the house stacks four levels of living around light wells and courts. Corner glazing opens the rooms to the street, while brick jaali and timber louvers filter the Surat sun and give privacy above.</p>
        <p class="muted">Planned to Vastu and built to breathe. Cavity walls temper heat and sound, stack ventilation and open planning move air through the section, and a water-conservation tank and solar-ready roof carry the house toward self-sufficiency. Trailing greenery softens every edge, turning the façade into a living, seasonal thing that glows warmly between the tiers by night.</p>
      </div>
    </div>
  </div>
  <div class="container" style="margin-top:clamp(46px,6vw,72px)">
    <div class="pd-meta reveal">
      <div><div class="k">Type</div><div class="v">Residential</div></div>
      <div><div class="k">Site area</div><div class="v">1,670 sq ft</div></div>
      <div><div class="k">Levels</div><div class="v">G + 3 &amp; terrace</div></div>
      <div><div class="k">Stage</div><div class="v">Design Visualisation</div></div>
    </div>
    <p class="pd-credits reveal">Principal Designer <b>Bhavin Swami</b> &middot; Senior Architect <b></b></p>
  </div>
</section>

<section class="section pd-sketch">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Concept</p>
      <h2 class="h-lg">From the first line.</h2>
    </div>
    <div class="pd-sketch-grid reveal" style="grid-template-columns:1fr;max-width:920px;margin-inline:auto">
      <figure class="pd-sketch-fig"><img src="${IMG3}sketch-01.webp" alt="Ṛju, concept sketch, corner perspective" /></figure>
    </div>
    <p class="muted reveal pd-sketch-note">A hand study of the corner, the stacked planted balconies, timber louvers and the brick-jaali crown drawn before the render.</p>
  </div>
</section>

<section class="pd-showcase">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Visualisation</p>
      <h2 class="h-lg">3D Elevation.</h2>
    </div>
    <div class="pd-full-grid pd-full-grid--elev reveal">
      <figure class="pd-full"><img src="${IMG3}01-day.webp" alt="Ṛju, street corner by day" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IMG3}02-dusk.webp" alt="Ṛju, street corner at dusk" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IMG3}05-front-alt.webp" alt="Ṛju, layered front elevation" loading="lazy" /></figure>
    </div>
  </div>
  <div class="container">
    <div class="pd-sec-head reveal pd-showcase__sub">
      <h2 class="h-lg">Day to night.</h2>
    </div>
  </div>
  <div class="slideshow reveal" data-autoplay="5500" aria-roledescription="carousel" aria-label="Ṛju renders">
    <div class="slideshow__viewport">
      <figure class="slide is-active" data-cap="Street corner by day, planted balconies and the brick-jaali crown."><img src="${IMG3}01-day.webp" alt="Ṛju, street corner by day" /></figure>
      <figure class="slide" data-cap="The corner at dusk, warm light rising between the green tiers."><img src="${IMG3}02-dusk.webp" alt="Ṛju, street corner at dusk" loading="lazy" /></figure>
      <figure class="slide" data-cap="Front elevation at night, interiors glowing behind the screens."><img src="${IMG3}03-night.webp" alt="Ṛju, front elevation at night" loading="lazy" /></figure>
      <figure class="slide" data-cap="Street elevation by day, stone, glass and cascading vines."><img src="${IMG3}04-day-front.webp" alt="Ṛju, street elevation by day" loading="lazy" /></figure>
      <figure class="slide" data-cap="The layered façade, concrete, timber, jaali and green."><img src="${IMG3}05-front-alt.webp" alt="Ṛju, layered front elevation" loading="lazy" /></figure>
    </div>
    <button class="slideshow__nav slideshow__nav--prev" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 5l-7 7 7 7"/></svg></button>
    <button class="slideshow__nav slideshow__nav--next" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 5l7 7-7 7"/></svg></button>
    <div class="slideshow__bar">
      <div class="container slideshow__bar-inner">
        <span class="slideshow__cap">Street corner by day, planted balconies and the brick-jaali crown.</span>
        <div class="slideshow__dots" role="tablist"></div>
        <span class="slideshow__counter"><span class="cur">01</span><span class="sep">&thinsp;/&thinsp;</span><span class="total">05</span></span>
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
        <li>Cavity walls, heat &amp; sound</li>
        <li>Open planning</li>
        <li>Stack ventilation</li>
        <li>Generous green areas</li>
        <li>Water conservation tank</li>
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
      <div class="program__floor"><div class="program__lvl">Ground</div><ul><li>Parking &amp; court</li><li>Verandah &amp; wudu area</li><li>Foyer &amp; living</li><li>Kitchen / dining &amp; wash</li><li>Bedroom &amp; att. toilet</li><li>Lift / staircase &amp; light well</li></ul></div>
      <div class="program__floor"><div class="program__lvl">First</div><ul><li>Living room</li><li>Two bedrooms &amp; att. toilets</li><li>Kitchen / dining &amp; wash</li><li>Balcony &amp; light well</li></ul></div>
      <div class="program__floor"><div class="program__lvl">Second</div><ul><li>Two bedrooms</li><li>Attached toilets</li><li>Balcony</li><li>Light well</li></ul></div>
      <div class="program__floor"><div class="program__lvl">Third</div><ul><li>Living room</li><li>Two bedrooms &amp; att. toilets</li><li>Kitchen / dining &amp; wash</li><li>Balcony &amp; light well</li></ul></div>
      <div class="program__floor"><div class="program__lvl">Terrace</div><ul><li>Party kitchen</li><li>Barbecue &amp; deck</li></ul></div>
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

const jalika = `
<div class="pd-hero pd-hero--tall pd-hero--zoom pd-hero--sketch">
  <img src="${IMG4}sketch-01.webp" alt="Jālikā, concept sketch" />
  <div class="pd-hero__cap"><div class="container">
    <span class="tag" style="color:#9ecbe4">Architecture, Residential · Surat</span>
    <h1>Jālikā</h1>
    <p class="pd-hero__sub">A home behind a woven veil of brick and timber jaali.</p>
  </div></div>
</div>

<section class="section pd-intro">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">The project</p>
        <h2 class="statement">A woven <em>jaali</em> veil, terracotta piers and grey concrete framing a screen of brick and timber.</h2>
      </div>
      <div class="reveal d1">
        <p class="lead">On a generous 4,250 sq ft corner plot, the house lifts its living floors over a podium of parking and services and opens onto a wrap-around rooftop garden. A deep brick-and-timber jaali veils the double-height corner, filtering the Surat sun while the rooms glow warmly behind it.</p>
        <p class="muted">Warm terracotta render plays against board-formed concrete, and vertical gardens climb the piers. Planned to Vastu and built to breathe: cavity walls temper heat and sound, stack ventilation and open planning move air through the section, and a water-conservation tank and solar-ready roof carry the house toward self-sufficiency.</p>
      </div>
    </div>
  </div>
  <div class="container" style="margin-top:clamp(46px,6vw,72px)">
    <div class="pd-meta reveal">
      <div><div class="k">Type</div><div class="v">Residential</div></div>
      <div><div class="k">Site area</div><div class="v">4,250 sq ft</div></div>
      <div><div class="k">Levels</div><div class="v">G + 2 &amp; terrace</div></div>
      <div><div class="k">Stage</div><div class="v">Design Visualisation</div></div>
    </div>
    <p class="pd-credits reveal">Principal Designer <b>Bhavin Swami</b> &middot; Senior Architect <b></b></p>
  </div>
</section>

<section class="section pd-sketch">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Concept</p>
      <h2 class="h-lg">From the first line.</h2>
    </div>
    <div class="pd-sketch-grid reveal" style="grid-template-columns:1fr;max-width:980px;margin-inline:auto">
      <figure class="pd-sketch-fig"><img src="${IMG4}sketch-01.webp" alt="Jālikā, concept sketch, corner perspective" /></figure>
    </div>
    <p class="muted reveal pd-sketch-note">A hand study of the corner, the double-height jaali screen, terracotta piers and the raised garden podium drawn before the render.</p>
  </div>
</section>

<section class="pd-showcase">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Visualisation</p>
      <h2 class="h-lg">3D Elevation.</h2>
    </div>
    <div class="pd-full-grid pd-full-grid--elev reveal">
      <figure class="pd-full"><img src="${IMG4}02-day.webp" alt="Jālikā, corner by day" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IMG4}01-night.webp" alt="Jālikā, corner at night" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IMG4}05-front.webp" alt="Jālikā, street elevation" loading="lazy" /></figure>
    </div>
  </div>
  <div class="container">
    <div class="pd-sec-head reveal pd-showcase__sub">
      <h2 class="h-lg">Day to night.</h2>
    </div>
  </div>
  <div class="slideshow reveal" data-autoplay="5500" aria-roledescription="carousel" aria-label="Jālikā renders">
    <div class="slideshow__viewport">
      <figure class="slide is-active" data-cap="The corner by day, brick-and-timber jaali over the double-height living room."><img src="${IMG4}02-day.webp" alt="Jālikā, corner by day" /></figure>
      <figure class="slide" data-cap="The same corner at night, the jaali glowing from within."><img src="${IMG4}01-night.webp" alt="Jālikā, corner at night" loading="lazy" /></figure>
      <figure class="slide" data-cap="Rear elevation by day, concrete frames and planted balconies."><img src="${IMG4}04-day-rear.webp" alt="Jālikā, rear elevation by day" loading="lazy" /></figure>
      <figure class="slide" data-cap="Rear elevation at night, warm rooms behind the terracotta pier."><img src="${IMG4}03-night-rear.webp" alt="Jālikā, rear elevation at night" loading="lazy" /></figure>
      <figure class="slide" data-cap="Street elevation, the jaali screen and the raised garden podium."><img src="${IMG4}05-front.webp" alt="Jālikā, street elevation" loading="lazy" /></figure>
    </div>
    <button class="slideshow__nav slideshow__nav--prev" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 5l-7 7 7 7"/></svg></button>
    <button class="slideshow__nav slideshow__nav--next" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 5l7 7-7 7"/></svg></button>
    <div class="slideshow__bar">
      <div class="container slideshow__bar-inner">
        <span class="slideshow__cap">The corner by day, brick-and-timber jaali over the double-height living room.</span>
        <div class="slideshow__dots" role="tablist"></div>
        <span class="slideshow__counter"><span class="cur">01</span><span class="sep">&thinsp;/&thinsp;</span><span class="total">05</span></span>
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
        <li>Cavity walls, heat &amp; sound</li>
        <li>Open planning</li>
        <li>Stack ventilation</li>
        <li>Generous green areas</li>
        <li>Water conservation tank</li>
        <li>Solar-ready roof</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="pd-sec-head reveal" style="max-width:640px">
      <p class="eyebrow">Accommodation</p>
      <h2 class="h-lg">A home across four levels.</h2>
    </div>
    <div class="program reveal">
      <div class="program__floor"><div class="program__lvl">Ground</div><ul><li>Parking &amp; utility</li><li>Foyer &amp; office</li><li>Home theatre</li><li>Servant room &amp; C. toilet</li><li>Lift / staircase</li></ul></div>
      <div class="program__floor"><div class="program__lvl">First</div><ul><li>Living &amp; dining</li><li>Bedroom &amp; att. toilet</li><li>Kitchen, curry kitchen &amp; store</li><li>Pooja room</li><li>Garden area</li></ul></div>
      <div class="program__floor"><div class="program__lvl">Second</div><ul><li>Bedroom &amp; att. toilet</li><li>Lounge area</li><li>Open terrace</li></ul></div>
      <div class="program__floor"><div class="program__lvl">Terrace</div><ul><li>Terrace garden</li><li>Open deck</li></ul></div>
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

const vallabhNivas = `
<div class="pd-hero pd-hero--tall pd-hero--zoom pd-hero--sketch">
  <img src="${IMG5}sketch-01.webp" alt="Vallabh Nivas, concept sketch" />
  <div class="pd-hero__cap"><div class="container">
    <span class="tag" style="color:#9ecbe4">Architecture, Residential · Surat</span>
    <h1>Vallabh Nivas</h1>
    <p class="pd-hero__sub">A tall, narrow home of concrete, warm timber and trailing green.</p>
  </div></div>
</div>

<section class="section pd-intro">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">The project</p>
        <h2 class="statement">Clean stacked volumes softened by wood-slat <em>screens</em>, planted balconies and green that spills from every level.</h2>
      </div>
      <div class="reveal d1">
        <p class="lead">On a compact 1,210 sq ft plot, the house rises four slender levels in board-formed concrete gridded into quiet bays. A full-height timber-slat panel warms the core and screens the terraces, while corner glazing pulls daylight deep into the narrow plan.</p>
        <p class="muted">Planned to Vastu and built to breathe: cavity walls temper heat and sound, stack ventilation and open planning move air up through the section, and a water-conservation tank and solar-ready roof carry the house toward self-sufficiency. By night the timber glows and the trailing greenery reads as soft silhouettes against the lit rooms.</p>
      </div>
    </div>
  </div>
  <div class="container" style="margin-top:clamp(46px,6vw,72px)">
    <div class="pd-meta reveal">
      <div><div class="k">Type</div><div class="v">Residential</div></div>
      <div><div class="k">Site area</div><div class="v">1,210 sq ft</div></div>
      <div><div class="k">Levels</div><div class="v">G + 3</div></div>
      <div><div class="k">Stage</div><div class="v">Design Visualisation</div></div>
    </div>
    <p class="pd-credits reveal">Principal Designer <b>Bhavin Swami</b> &middot; Senior Architect <b></b></p>
  </div>
</section>

<section class="section pd-sketch">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Concept</p>
      <h2 class="h-lg">From the first line.</h2>
    </div>
    <div class="pd-sketch-grid reveal" style="grid-template-columns:1fr;max-width:760px;margin-inline:auto">
      <figure class="pd-sketch-fig"><img src="${IMG5}sketch-01.webp" alt="Vallabh Nivas, concept sketch, corner perspective" /></figure>
    </div>
    <p class="muted reveal pd-sketch-note">A hand study of the street corner, the concrete-panel grid, timber-slat core and the cascading planted balconies drawn before the render.</p>
  </div>
</section>

<section class="pd-showcase">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Visualisation</p>
      <h2 class="h-lg">3D Elevation.</h2>
    </div>
    <div class="pd-full-grid pd-full-grid--elev reveal">
      <figure class="pd-full"><img src="${IMG5}02-day.webp" alt="Vallabh Nivas, front elevation by day" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IMG5}01-night.webp" alt="Vallabh Nivas, front elevation at night" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IMG5}05-day-tall.webp" alt="Vallabh Nivas, tall corner view" loading="lazy" /></figure>
    </div>
  </div>
  <div class="container">
    <div class="pd-sec-head reveal pd-showcase__sub">
      <h2 class="h-lg">Day to night.</h2>
    </div>
  </div>
  <div class="slideshow reveal" data-autoplay="5500" aria-roledescription="carousel" aria-label="Vallabh Nivas renders">
    <div class="slideshow__viewport">
      <figure class="slide is-active" data-cap="Front elevation by day, the timber-slat core and planted balconies."><img src="${IMG5}02-day.webp" alt="Vallabh Nivas, front elevation by day" /></figure>
      <figure class="slide" data-cap="The same elevation after dark, warm timber and glowing rooms."><img src="${IMG5}01-night.webp" alt="Vallabh Nivas, front elevation at night" loading="lazy" /></figure>
      <figure class="slide" data-cap="Street view by day, concrete grid and cascading greenery."><img src="${IMG5}04-day-front.webp" alt="Vallabh Nivas, street view by day" loading="lazy" /></figure>
      <figure class="slide" data-cap="Street view at night, the interiors warm behind the slats."><img src="${IMG5}03-night-front.webp" alt="Vallabh Nivas, street view at night" loading="lazy" /></figure>
      <figure class="slide" data-cap="The tall corner, four slender levels stacked over the entrance."><img src="${IMG5}05-day-tall.webp" alt="Vallabh Nivas, tall corner view" loading="lazy" /></figure>
    </div>
    <button class="slideshow__nav slideshow__nav--prev" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 5l-7 7 7 7"/></svg></button>
    <button class="slideshow__nav slideshow__nav--next" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 5l7 7-7 7"/></svg></button>
    <div class="slideshow__bar">
      <div class="container slideshow__bar-inner">
        <span class="slideshow__cap">Front elevation by day, the timber-slat core and planted balconies.</span>
        <div class="slideshow__dots" role="tablist"></div>
        <span class="slideshow__counter"><span class="cur">01</span><span class="sep">&thinsp;/&thinsp;</span><span class="total">05</span></span>
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
        <li>Cavity walls, heat &amp; sound</li>
        <li>Open planning</li>
        <li>Stack ventilation</li>
        <li>Generous green areas</li>
        <li>Water conservation tank</li>
        <li>Solar-ready roof</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="pd-sec-head reveal" style="max-width:640px">
      <p class="eyebrow">Accommodation</p>
      <h2 class="h-lg">A home across four levels.</h2>
    </div>
    <div class="program reveal">
      <div class="program__floor"><div class="program__lvl">Ground</div><ul><li>Parking &amp; backyard</li><li>Kitchen &amp; passage</li><li>Bedroom &amp; att. toilet</li><li>Pooja room &amp; C. toilet</li><li>Lift / staircase</li></ul></div>
      <div class="program__floor"><div class="program__lvl">First</div><ul><li>Living room</li><li>Bedroom &amp; att. toilet</li><li>Kitchen / dining &amp; wash</li><li>Common toilet</li><li>Balcony</li></ul></div>
      <div class="program__floor"><div class="program__lvl">Second</div><ul><li>Living room</li><li>Two bedrooms &amp; att. toilets</li><li>Walk-in wardrobe</li><li>Balcony</li></ul></div>
      <div class="program__floor"><div class="program__lvl">Third</div><ul><li>Living room</li><li>Two bedrooms &amp; att. toilets</li><li>Walk-in wardrobe</li><li>Balcony</li></ul></div>
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

const urdhva = `
<div class="pd-hero pd-hero--tall pd-hero--zoom pd-hero--sketch">
  <img src="${IMG6}sketch-01.webp" alt="Urdhva, concept sketch" />
  <div class="pd-hero__cap"><div class="container">
    <span class="tag" style="color:#9ecbe4">Architecture, Residential · Surat</span>
    <h1>Urdhva</h1>
    <p class="pd-hero__sub">Clean white volumes rising around a warm brick spine.</p>
  </div></div>
</div>

<section class="section pd-intro">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">The project</p>
        <h2 class="statement">Bright, cubic volumes split by an exposed-<em>brick</em> spine and crowned by a rooftop pavilion.</h2>
      </div>
      <div class="reveal d1">
        <p class="lead">On a 6,600 sq ft corner plot, the house stacks large-format panel volumes in white and soft grey, cut through by a full-height exposed-brick spine that grounds the composition. Planted balconies step across the façade and a rooftop pavilion with a spiral stair catches the sky.</p>
        <p class="muted">The single warm brick element, part solid and part jaali, anchors the pale façade and glows like a lantern at the entrance. Planned to Vastu and built to breathe: cavity walls temper heat and sound, stack ventilation and open planning move air through the section, and a water-conservation tank and solar-ready roof carry the house toward self-sufficiency.</p>
      </div>
    </div>
  </div>
  <div class="container" style="margin-top:clamp(46px,6vw,72px)">
    <div class="pd-meta reveal">
      <div><div class="k">Type</div><div class="v">Residential</div></div>
      <div><div class="k">Site area</div><div class="v">6,600 sq ft</div></div>
      <div><div class="k">Levels</div><div class="v">G + 2 &amp; terrace</div></div>
      <div><div class="k">Stage</div><div class="v">Design Visualisation</div></div>
    </div>
    <p class="pd-credits reveal">Principal Designer <b>Bhavin Swami</b> &middot; Senior Architect <b></b></p>
  </div>
</section>

<section class="section pd-sketch">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Concept</p>
      <h2 class="h-lg">From the first line.</h2>
    </div>
    <div class="pd-sketch-grid reveal" style="grid-template-columns:1fr;max-width:1000px;margin-inline:auto">
      <figure class="pd-sketch-fig"><img src="${IMG6}sketch-01.webp" alt="Urdhva, concept sketch, street corner" /></figure>
    </div>
    <p class="muted reveal pd-sketch-note">A hand study of the corner, the stacked white panel volumes, the exposed-brick spine and the rooftop pavilion drawn before the render.</p>
  </div>
</section>

<section class="pd-showcase">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Visualisation</p>
      <h2 class="h-lg">3D Elevation.</h2>
    </div>
    <div class="pd-full-grid pd-full-grid--elev reveal">
      <figure class="pd-full"><img src="${IMG6}05-day-street.jpg" alt="Urdhva, street elevation by day" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IMG6}01-night.webp" alt="Urdhva, corner view at night" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IMG6}03-day-front.jpg" alt="Urdhva, entrance by day" loading="lazy" /></figure>
    </div>
  </div>
  <div class="container">
    <div class="pd-sec-head reveal pd-showcase__sub">
      <h2 class="h-lg">Day to night.</h2>
    </div>
  </div>
  <div class="slideshow reveal" data-autoplay="5500" aria-roledescription="carousel" aria-label="Urdhva renders">
    <div class="slideshow__viewport">
      <figure class="slide is-active" data-cap="Street elevation by day, white panels split by the brick spine."><img src="${IMG6}05-day-street.jpg" alt="Urdhva, street elevation by day" /></figure>
      <figure class="slide" data-cap="The same corner at night, panels grazed by concealed uplights."><img src="${IMG6}04-night-street.webp" alt="Urdhva, corner at night" loading="lazy" /></figure>
      <figure class="slide" data-cap="Entrance by day, the brick jaali against the pale volumes."><img src="${IMG6}03-day-front.jpg" alt="Urdhva, entrance by day" loading="lazy" /></figure>
      <figure class="slide" data-cap="Entrance at night, the brick jaali glowing like a lantern."><img src="${IMG6}02-night-front.webp" alt="Urdhva, entrance at night" loading="lazy" /></figure>
      <figure class="slide" data-cap="Night corner, the stacked volumes and rooftop pavilion aglow."><img src="${IMG6}01-night.webp" alt="Urdhva, corner at night" loading="lazy" /></figure>
    </div>
    <button class="slideshow__nav slideshow__nav--prev" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 5l-7 7 7 7"/></svg></button>
    <button class="slideshow__nav slideshow__nav--next" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 5l7 7-7 7"/></svg></button>
    <div class="slideshow__bar">
      <div class="container slideshow__bar-inner">
        <span class="slideshow__cap">Street elevation by day, white panels split by the brick spine.</span>
        <div class="slideshow__dots" role="tablist"></div>
        <span class="slideshow__counter"><span class="cur">01</span><span class="sep">&thinsp;/&thinsp;</span><span class="total">05</span></span>
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
        <li>Cavity walls, heat &amp; sound</li>
        <li>Open planning</li>
        <li>Stack ventilation</li>
        <li>Generous green areas</li>
        <li>Water conservation tank</li>
        <li>Solar-ready roof</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="pd-sec-head reveal" style="max-width:640px">
      <p class="eyebrow">Accommodation</p>
      <h2 class="h-lg">A home across three levels.</h2>
    </div>
    <div class="program reveal">
      <div class="program__floor"><div class="program__lvl">Ground</div><ul><li>Formal &amp; informal living</li><li>Mandir</li><li>Kitchen, store &amp; utility</li><li>Dining space</li><li>Bedroom &amp; att. toilet</li><li>Landscape parking</li></ul></div>
      <div class="program__floor"><div class="program__lvl">First</div><ul><li>Living room</li><li>Bedroom &amp; att. toilet</li></ul></div>
      <div class="program__floor"><div class="program__lvl">Second</div><ul><li>Bedroom &amp; att. toilet</li><li>Terrace &amp; rooftop pavilion</li></ul></div>
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

const valuka = `
<div class="pd-hero pd-hero--tall pd-hero--zoom pd-hero--sketch">
  <img src="${IMG7}sketch-01.webp" alt="Vālukā, concept sketch" />
  <div class="pd-hero__cap"><div class="container">
    <span class="tag" style="color:#9ecbe4">Architecture, Residential · Surat</span>
    <h1>Vālukā</h1>
    <p class="pd-hero__sub">A grounded, earthen villa turned inward to a private courtyard.</p>
  </div></div>
</div>

<section class="section pd-intro">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">The project</p>
        <h2 class="statement">Grounded volumes of sandy render and striated stone gathered around a private <em>courtyard</em>.</h2>
      </div>
      <div class="reveal d1">
        <p class="lead">On a generous 6,460 sq ft plot in Adarsh Society, the house turns inward to a sheltered courtyard and Zen garden. Clay-toned render meets banded, rammed-earth-textured stone and teak, and a stone entrance portal frames a full-height timber door.</p>
        <p class="muted">The palette is deliberately of the earth. Living spaces open through full-height glazing to the garden while a jaali compound wall gives privacy. Planned to Vastu and built to breathe: cavity walls and soundproofing calm the interior, rainwater harvesting and rooftop solar make it self-sufficient, and generous landscape wraps the house.</p>
      </div>
    </div>
  </div>
  <div class="container" style="margin-top:clamp(46px,6vw,72px)">
    <div class="pd-meta reveal">
      <div><div class="k">Type</div><div class="v">Residential</div></div>
      <div><div class="k">Site area</div><div class="v">6,460 sq ft</div></div>
      <div><div class="k">Levels</div><div class="v">G + 1</div></div>
      <div><div class="k">Stage</div><div class="v">Design Visualisation</div></div>
    </div>
    <p class="pd-credits reveal">Principal Designer <b>Bhavin Swami</b> &middot; Senior Architect <b></b></p>
  </div>
</section>

<section class="section pd-sketch">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Concept</p>
      <h2 class="h-lg">From the first line.</h2>
    </div>
    <div class="pd-sketch-grid reveal" style="grid-template-columns:1fr;max-width:1000px;margin-inline:auto">
      <figure class="pd-sketch-fig"><img src="${IMG7}sketch-01.webp" alt="Vālukā, concept sketch, courtyard corner" /></figure>
    </div>
    <p class="muted reveal pd-sketch-note">A hand study of the courtyard corner, the striated stone bands, deep glazing and the sheltered garden drawn before the render.</p>
  </div>
</section>

<section class="pd-showcase">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Visualisation</p>
      <h2 class="h-lg">3D Elevation.</h2>
    </div>
    <div class="pd-full-grid pd-full-grid--elev reveal">
      <figure class="pd-full"><img src="${IMG7}06-dusk-corner.webp" alt="Vālukā, courtyard corner at dusk" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IMG7}01-front.jpg" alt="Vālukā, front elevation by day" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IMG7}05-aerial.jpg" alt="Vālukā, aerial view over the courtyard" loading="lazy" /></figure>
    </div>
  </div>
  <div class="container">
    <div class="pd-sec-head reveal pd-showcase__sub">
      <h2 class="h-lg">Around the house.</h2>
    </div>
  </div>
  <div class="slideshow reveal" data-autoplay="5500" aria-roledescription="carousel" aria-label="Vālukā renders">
    <div class="slideshow__viewport">
      <figure class="slide is-active" data-cap="The courtyard corner at dusk, warm render glowing against striated stone."><img src="${IMG7}06-dusk-corner.webp" alt="Vālukā, courtyard corner at dusk" /></figure>
      <figure class="slide" data-cap="Front elevation by day, the stone portal and full-height timber door."><img src="${IMG7}01-front.jpg" alt="Vālukā, front elevation by day" loading="lazy" /></figure>
      <figure class="slide" data-cap="Garden elevation, living spaces opening to the sheltered courtyard."><img src="${IMG7}02-rear-angle.jpg" alt="Vālukā, garden elevation" loading="lazy" /></figure>
      <figure class="slide" data-cap="Courtyard elevation, banded stone meeting warm clay render."><img src="${IMG7}03-side.jpg" alt="Vālukā, courtyard elevation" loading="lazy" /></figure>
      <figure class="slide" data-cap="Rear elevation, rammed-earth-textured stone and deep glazing."><img src="${IMG7}04-rear.jpg" alt="Vālukā, rear elevation" loading="lazy" /></figure>
      <figure class="slide" data-cap="Aerial, the plan wraps the courtyard; rooftop solar crowns the massing."><img src="${IMG7}05-aerial.jpg" alt="Vālukā, aerial view" loading="lazy" /></figure>
    </div>
    <button class="slideshow__nav slideshow__nav--prev" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 5l-7 7 7 7"/></svg></button>
    <button class="slideshow__nav slideshow__nav--next" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 5l7 7-7 7"/></svg></button>
    <div class="slideshow__bar">
      <div class="container slideshow__bar-inner">
        <span class="slideshow__cap">The courtyard corner at dusk, warm render glowing against striated stone.</span>
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
        <li>Cavity walls, heat &amp; sound</li>
        <li>Open planning</li>
        <li>Stack ventilation</li>
        <li>Generous green areas</li>
        <li>Rainwater harvesting</li>
        <li>Soundproof windows</li>
        <li>Solar-ready roof</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="pd-sec-head reveal" style="max-width:640px">
      <p class="eyebrow">Accommodation</p>
      <h2 class="h-lg">A home across two levels.</h2>
    </div>
    <div class="program reveal">
      <div class="program__floor"><div class="program__lvl">Ground</div><ul><li>Foyer, verandah &amp; pooja</li><li>Formal &amp; informal living</li><li>Master suite &amp; walk-in closet</li><li>Dining, kitchen &amp; curry kitchen</li><li>Utility &amp; servant quarter</li><li>Zen garden &amp; covered garage</li></ul></div>
      <div class="program__floor"><div class="program__lvl">First</div><ul><li>Guest bedrooms &amp; wardrobe</li><li>Multi-purpose room</li><li>Indoor &amp; outdoor swings</li><li>Landscape area</li></ul></div>
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

const asamvrta = `
<div class="pd-hero pd-hero--tall pd-hero--zoom pd-hero--sketch">
  <img src="${IMG8}sketch-01.webp" alt="Asaṁvṛta, concept sketch" />
  <div class="pd-hero__cap"><div class="container">
    <span class="tag" style="color:#9ecbe4">Architecture, Residential · Surat</span>
    <h1>Asaṁvṛta</h1>
    <p class="pd-hero__sub">Stacked homes of pale stone and warm brick turning the corner.</p>
  </div></div>
</div>

<section class="section pd-intro">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">The project</p>
        <h2 class="statement">Pale stone and grey panels framed by piers of exposed red <em>brick</em>, deep balconies stacked up a corner.</h2>
      </div>
      <div class="reveal d1">
        <p class="lead">On a 2,290 sq ft corner plot, this apartment building stacks a home on each level, punched openings and full-height glazing set into stone surrounds while brick wraps the corner and grounds the sheltered parking base.</p>
        <p class="muted">A timber-lined pavilion caps the roof, catching light and giving the block a crown; the pairing of cool stone against warm brick keeps the elevation ordered yet tactile. Planned to Vastu and built to breathe: cavity walls temper heat and sound, stack ventilation and open planning move air through the section, and a water-conservation tank and solar-ready roof carry the building toward self-sufficiency.</p>
      </div>
    </div>
  </div>
  <div class="container" style="margin-top:clamp(46px,6vw,72px)">
    <div class="pd-meta reveal">
      <div><div class="k">Type</div><div class="v">Residential</div></div>
      <div><div class="k">Site area</div><div class="v">2,290 sq ft</div></div>
      <div><div class="k">Levels</div><div class="v">G + 2 &amp; terrace</div></div>
      <div><div class="k">Stage</div><div class="v">Design Visualisation</div></div>
    </div>
    <p class="pd-credits reveal">Principal Designer <b>Bhavin Swami</b> &middot; Senior Architect <b></b></p>
  </div>
</section>

<section class="section pd-sketch">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Concept</p>
      <h2 class="h-lg">From the first line.</h2>
    </div>
    <div class="pd-sketch-grid reveal" style="grid-template-columns:1fr;max-width:920px;margin-inline:auto">
      <figure class="pd-sketch-fig"><img src="${IMG8}sketch-01.webp" alt="Asaṁvṛta, concept sketch, street corner" /></figure>
    </div>
    <p class="muted reveal pd-sketch-note">A hand study of the street corner, the stone-and-brick banding, deep recessed balconies and the rooftop pavilion drawn before the render.</p>
  </div>
</section>

<section class="pd-showcase">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Visualisation</p>
      <h2 class="h-lg">3D Elevation.</h2>
    </div>
    <div class="pd-full-grid pd-full-grid--elev reveal">
      <figure class="pd-full"><img src="${IMG8}02-day-corner.webp" alt="Asaṁvṛta, corner view by day" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IMG8}01-night-corner.webp" alt="Asaṁvṛta, corner view at night" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IMG8}04-day-front.webp" alt="Asaṁvṛta, street elevation by day" loading="lazy" /></figure>
    </div>
  </div>
  <div class="container">
    <div class="pd-sec-head reveal pd-showcase__sub">
      <h2 class="h-lg">Day to night.</h2>
    </div>
  </div>
  <div class="slideshow reveal" data-autoplay="5500" aria-roledescription="carousel" aria-label="Asaṁvṛta renders">
    <div class="slideshow__viewport">
      <figure class="slide is-active" data-cap="The corner by day, stone and grey panels framed by exposed brick."><img src="${IMG8}02-day-corner.webp" alt="Asaṁvṛta, corner by day" /></figure>
      <figure class="slide" data-cap="The same corner after dark, balconies and rooms glowing warm."><img src="${IMG8}01-night-corner.webp" alt="Asaṁvṛta, corner at night" loading="lazy" /></figure>
      <figure class="slide" data-cap="Street elevation by day, brick banding across the stone facade."><img src="${IMG8}04-day-front.webp" alt="Asaṁvṛta, street elevation by day" loading="lazy" /></figure>
      <figure class="slide" data-cap="Street elevation at night, the rooftop pavilion lit against the sky."><img src="${IMG8}03-night-front.webp" alt="Asaṁvṛta, street elevation at night" loading="lazy" /></figure>
    </div>
    <button class="slideshow__nav slideshow__nav--prev" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 5l-7 7 7 7"/></svg></button>
    <button class="slideshow__nav slideshow__nav--next" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 5l7 7-7 7"/></svg></button>
    <div class="slideshow__bar">
      <div class="container slideshow__bar-inner">
        <span class="slideshow__cap">The corner by day, stone and grey panels framed by exposed brick.</span>
        <div class="slideshow__dots" role="tablist"></div>
        <span class="slideshow__counter"><span class="cur">01</span><span class="sep">&thinsp;/&thinsp;</span><span class="total">04</span></span>
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
        <li>Cavity walls, heat &amp; sound</li>
        <li>Open planning</li>
        <li>Stack ventilation</li>
        <li>Generous green areas</li>
        <li>Water conservation tank</li>
        <li>Solar-ready roof</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="pd-sec-head reveal" style="max-width:640px">
      <p class="eyebrow">Accommodation</p>
      <h2 class="h-lg">Homes across four levels.</h2>
    </div>
    <div class="program reveal">
      <div class="program__floor"><div class="program__lvl">Ground</div><ul><li>Parking &amp; court</li><li>Living, kitchen &amp; dining</li><li>Two bedrooms &amp; att. toilet</li><li>Pooja room &amp; wash</li><li>Lift / staircase &amp; balcony</li></ul></div>
      <div class="program__floor"><div class="program__lvl">First</div><ul><li>Living room</li><li>Two bedrooms &amp; att. toilets</li><li>Dressing room &amp; store</li><li>Kitchen / dining &amp; wash</li><li>Pooja room &amp; balcony</li></ul></div>
      <div class="program__floor"><div class="program__lvl">Second</div><ul><li>Living room</li><li>Two bedrooms &amp; att. toilets</li><li>Dressing room &amp; store</li><li>Kitchen / dining &amp; wash</li><li>Pooja room &amp; balcony</li></ul></div>
      <div class="program__floor"><div class="program__lvl">Terrace</div><ul><li>Multi-purpose area</li><li>Skylight &amp; pantry</li></ul></div>
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

const NIMG = 'assets/projects/metal-life/';
const metalLife = `
<div class="pd-hero pd-hero--tall">
  <img src="${NIMG}hero.webp" alt="Metal Life, living room" />
  <div class="pd-hero__cap"><div class="container">
    <span class="tag" style="color:#29465B">Interior Design, Residential · Surat</span>
    <h1>Metal Life</h1>
    <p class="pd-hero__sub">A raw industrial shell, warmed by terracotta and light.</p>
  </div></div>
</div>

<section class="section pd-intro">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">The project</p>
        <h2 class="statement">The raw hallmarks of <em>industrial</em> design, exposed concrete and copper, softened with warm, modern living.</h2>
      </div>
      <div class="reveal d1">
        <p class="lead">Micro-cement walls, a ribbed concrete ceiling and surface-mounted copper conduits set the structural key. Against it, textured terracotta sofas, geometric glass tables, sheer drapes and indoor greenery bring warmth and calm.</p>
        <p class="muted">The interior is composed as a single, continuous idea with the architecture that holds it, a comprehensive approach where every material, fixture and line is resolved together. Diffused daylight softens the shell by day; exposed copper track lighting and frosted milk-glass globes warm it by night.</p>
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
    <p class="pd-credits reveal">Principal Designer <b>Bhavin Swami</b> &middot; Senior Designer <b></b></p>
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
      <figure class="pd-full"><img src="${NIMG}space-01.webp" alt="Metal Life, living room" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${NIMG}space-02.webp" alt="Metal Life, master bedroom" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${NIMG}space-03.webp" alt="Metal Life, bedroom" loading="lazy" /></figure>
    </div>
  </div>
  <div class="container">
    <div class="pd-sec-head reveal pd-showcase__sub">
      <h2 class="h-lg">Room by room.</h2>
    </div>
  </div>
  <div class="slideshow reveal" data-autoplay="5500" aria-roledescription="carousel" aria-label="Metal Life renders">
    <div class="slideshow__viewport">
      <figure class="slide is-active" data-cap="Bedroom, micro-cement walls and a warm timber base."><img src="${NIMG}slide-01.webp" alt="Metal Life, bedroom" /></figure>
      <figure class="slide" data-cap="Living room, terracotta sofas against the concrete shell."><img src="${NIMG}slide-02.webp" alt="Metal Life, living room" loading="lazy" /></figure>
      <figure class="slide" data-cap="Living room, glass tables, greenery and layered rugs."><img src="${NIMG}slide-03.webp" alt="Metal Life, living room seating" loading="lazy" /></figure>
      <figure class="slide" data-cap="Master bedroom, a warm accent wall and floating console."><img src="${NIMG}slide-04.webp" alt="Metal Life, master bedroom" loading="lazy" /></figure>
      <figure class="slide" data-cap="Dining, copper-toned steel-mesh screen and daylight."><img src="${NIMG}slide-05.webp" alt="Metal Life, dining" loading="lazy" /></figure>
      <figure class="slide" data-cap="Lounge, sheer drapes framing the balcony beyond."><img src="${NIMG}slide-06.webp" alt="Metal Life, lounge" loading="lazy" /></figure>
    </div>
    <button class="slideshow__nav slideshow__nav--prev" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 5l-7 7 7 7"/></svg></button>
    <button class="slideshow__nav slideshow__nav--next" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 5l7 7-7 7"/></svg></button>
    <div class="slideshow__bar">
      <div class="container slideshow__bar-inner">
        <span class="slideshow__cap">Bedroom, micro-cement walls and a warm timber base.</span>
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
    <div class="mgrid reveal">
      <figure class="mgrid__cell"><img src="${NIMG}detail-01.webp" alt="Metal Life, copper-toned steel-mesh partition" loading="lazy" /></figure>
      <figure class="mgrid__cell"><img src="${NIMG}detail-02.webp" alt="Metal Life, kitchen" loading="lazy" /></figure>
      <figure class="mgrid__cell"><img src="${NIMG}detail-03.webp" alt="Metal Life, dining" loading="lazy" /></figure>
      <figure class="mgrid__cell"><img src="${NIMG}detail-04.webp" alt="Metal Life, bathroom" loading="lazy" /></figure>
      <figure class="mgrid__cell"><img src="${NIMG}detail-05.webp" alt="Metal Life, powder room" loading="lazy" /></figure>
      <figure class="mgrid__cell"><img src="${NIMG}detail-06.webp" alt="Metal Life, bedroom" loading="lazy" /></figure>
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

const JIMG = 'assets/projects/juneberry/';
const juneberry = `
<div class="pd-hero pd-hero--tall">
  <img src="${JIMG}facade.webp" alt="Juneberry cafe interior, warm daylight with the brand sign on the wall" />
  <div class="pd-hero__cap"><div class="container">
    <span class="tag" style="color:#29465B">Interior Design, Café · Surat</span>
    <h1>Juneberry</h1>
    <p class="pd-hero__sub">Beyond hospitality, a community-centred café where sustainability is the story.</p>
  </div></div>
</div>

<section class="section pd-intro">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">The project</p>
        <h2 class="statement">Sustainability, not as a feature, but as the <em>story</em> itself.</h2>
      </div>
      <div class="reveal d1">
        <p class="lead">Juneberry is a minimalist specialty-coffee café in Surat that reimagines everyday hospitality as a place where craftsmanship, sustainability and human connection meet, answering a growing need for spaces that invite reflection and community rather than efficiency and overconsumption.</p>
        <p class="muted">A neutral palette and natural materials replace bold ornamentation: sculpted plaster feature walls, reel-wood furniture and refined white powder-coated metal make a calm, timeless room guided by the owner's vision of understated comfort. Almost every surface tells a quieter story of waste reclaimed as craft.</p>
      </div>
    </div>
  </div>
  <div class="container" style="margin-top:clamp(46px,6vw,72px)">
    <div class="pd-meta reveal">
      <div><div class="k">Scope</div><div class="v">Interior Design</div></div>
      <div><div class="k">Area</div><div class="v">1,170 sq ft</div></div>
      <div><div class="k">Completed</div><div class="v">2025</div></div>
      <div><div class="k">Location</div><div class="v">Surat, Gujarat</div></div>
    </div>
    <p class="pd-credits reveal">Principal Designer <b>Bhavin Swami</b> &middot; Senior Designer <b>Dev Kajiwala</b> &middot; Art installation <b>Artitude Satyarth</b> &middot; Photography <b>Kenny Zaveri</b></p>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal"><p class="eyebrow">The making</p><h2 class="h-lg">Made from what's left.</h2></div>
      <div class="reveal d1 cpsych">
        <div class="cpsych__item"><div class="cpsych__k">Sculpted plaster</div><p>Hand-sculpted Plaster of Paris feature walls with a quiet grid texture, no wallpaper, no synthetic finishes.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Upcycled textiles</div><p>Hangings hand-stitched from waste textiles, naturally dyed in coffee and earth tones, placed to filter the day's sun.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Waste into art</div><p>Wood-waste mountain ranges, banana-stem canvases and oxidised-metal figurines, discarded material reborn as art.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Reel wood &amp; craft</div><p>Reel-wood composite furniture and locally made upholstery in place of virgin timber.</p></div>
      </div>
    </div>
    <div class="matstrip reveal">
      <span>Sculpted POP</span><span>Reel wood</span><span>Powder-coated metal</span><span>Upcycled textile</span><span>Banana stem</span><span>Wood waste</span>
    </div>
  </div>
</section>

<section class="pd-showcase">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">The space</p>
      <h2 class="h-lg">Coffee, counter and craft.</h2>
    </div>
    <div class="pd-full-grid reveal">
      <figure class="pd-full"><img src="${JIMG}counter.webp" alt="Juneberry, the coffee counter with espresso machine and pastry display" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${JIMG}interior.webp" alt="Juneberry, the main dining hall toward the entrance" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${JIMG}hall.webp" alt="Juneberry, seating and retail shelving toward the entrance" loading="lazy" /></figure>
    </div>
  </div>
  <div class="container">
    <div class="pd-sec-head reveal pd-showcase__sub">
      <h2 class="h-lg">A closer look.</h2>
    </div>
  </div>
  <div class="slideshow reveal" data-autoplay="5500" aria-roledescription="carousel" aria-label="Juneberry interior">
    <div class="slideshow__viewport">
      <figure class="slide is-active" data-cap="Wood-waste wall installation, evoking mountain ranges and coffee foam."><img src="${JIMG}art-pillar.webp" alt="Juneberry, wood-waste wall installation evoking mountain ranges" /></figure>
      <figure class="slide" data-cap="Banana-stem canvases set with waste-metal figurines."><img src="${JIMG}banquette.webp" alt="Juneberry, banana-stem canvas artworks above the banquette" loading="lazy" /></figure>
      <figure class="slide" data-cap="An upcycled textile installation, hand-dyed in coffee and earth tones."><img src="${JIMG}window-nook.webp" alt="Juneberry, window seating beside an upcycled textile installation" loading="lazy" /></figure>
      <figure class="slide" data-cap="The counter and pastry display, up close."><img src="${JIMG}counter-detail.webp" alt="Juneberry, the counter and pastry display" loading="lazy" /></figure>
    </div>
    <button class="slideshow__nav slideshow__nav--prev" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 5l-7 7 7 7"/></svg></button>
    <button class="slideshow__nav slideshow__nav--next" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 5l7 7-7 7"/></svg></button>
    <div class="slideshow__bar">
      <div class="container slideshow__bar-inner">
        <span class="slideshow__cap">Wood-waste wall installation, evoking mountain ranges and coffee foam.</span>
        <div class="slideshow__dots" role="tablist"></div>
        <span class="slideshow__counter"><span class="cur">01</span><span class="sep">&thinsp;/&thinsp;</span><span class="total">04</span></span>
      </div>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal"><p class="eyebrow">Beyond the coffee</p><h2 class="h-lg">A café that gives back.</h2></div>
      <div class="reveal d1 cpsych">
        <div class="cpsych__item"><div class="cpsych__k">Room to gather</div><p>Bookshelves built into the seating turn the café into a place to read, share and slow down.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Daylight as design</div><p>Textile screens tuned to the sun's path fill the room with shifting daylight and cut the need for artificial light.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Green and quiet</div><p>Greenery softens the street-to-interior threshold while acoustic ceilings hush the urban noise.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Warm, low-glare light</div><p>Concealed sources behind translucent fabric diffusers keep the glow soft and intimate.</p></div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Moments</p>
      <h2 class="h-lg">Small corners, slow mornings.</h2>
    </div>
    <div class="mgrid reveal">
      <figure class="mgrid__cell"><img src="${JIMG}art-panels.webp" alt="Juneberry, banana-stem canvas artworks with waste-metal figurines" loading="lazy" /></figure>
      <figure class="mgrid__cell"><img src="${JIMG}mountain-wall.webp" alt="Juneberry, wood-waste installation evoking mountain ranges above the banquette" loading="lazy" /></figure>
      <figure class="mgrid__cell"><img src="${JIMG}coffee-window.webp" alt="Juneberry, a guest by the window beside an upcycled textile installation" loading="lazy" /></figure>
      <figure class="mgrid__cell"><img src="${JIMG}reading.webp" alt="Juneberry, a guest reading beneath a banana-stem canvas" loading="lazy" /></figure>
      <figure class="mgrid__cell"><img src="${JIMG}reading-wide.webp" alt="Juneberry, a guest reading by the window beside the retail shelving" loading="lazy" /></figure>
      <figure class="mgrid__cell"><img src="${JIMG}seating-row.webp" alt="Juneberry, a row of reel-wood chairs beneath the wood-waste installation" loading="lazy" /></figure>
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

const CIMG = 'assets/projects/calibre/';
const calibre = `
<div class="pd-hero pd-hero--tall">
  <img src="${CIMG}hero.webp" alt="Calibre boutique, sculptural curved plaster interior with garments and a skylight" />
  <div class="pd-hero__cap"><div class="container">
    <span class="tag" style="color:#29465B">Interior Design, Boutique · Surat</span>
    <h1>Calibre</h1>
    <p class="pd-hero__sub">Beyond retail, a fluid, sculptural canvas for luxury fashion.</p>
  </div></div>
</div>

<section class="section pd-intro">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">The project</p>
        <h2 class="statement">The boutique reimagined as a fluid, sculptural <em>canvas</em>, where the garments stay the focus.</h2>
      </div>
      <div class="reveal d1">
        <p class="lead">In the commercial district of Vesu, Surat, Calibre trades the rigid rectangular shopfloor for sweeping, continuous curves. Undulating partitions choreograph a seamless journey through the store, quietly concealing the structure so the clothes remain the focal point.</p>
        <p class="muted">Central curved display units and circular seating islands form intimate, lounge-like pods to meander between; changing rooms, a sweeping reception and utilities tuck invisibly into the negative space behind the walls. Polished matte tile, textured plaster and brushed brass give a tactile, breathable luxury, lit to reveal every fabric without a hard shadow in sight.</p>
      </div>
    </div>
  </div>
  <div class="container" style="margin-top:clamp(46px,6vw,72px)">
    <div class="pd-meta reveal">
      <div><div class="k">Scope</div><div class="v">Interior Design</div></div>
      <div><div class="k">Type</div><div class="v">Retail · Boutique</div></div>
      <div><div class="k">Area</div><div class="v">1,950 sq ft</div></div>
      <div><div class="k">Completed</div><div class="v">2025</div></div>
    </div>
    <p class="pd-credits reveal">Principal Designer <b>Bhavin Swami</b> &middot; Senior Designer <b>Kanaiya Gajjar</b> &middot; Photography <b>Prabal Gupta</b></p>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal"><p class="eyebrow">The idea</p><h2 class="h-lg">No sharp corners.</h2></div>
      <div class="reveal d1 cpsych">
        <div class="cpsych__item"><div class="cpsych__k">Sweeping curves</div><p>Undulating display walls choreograph the journey and hide the structure within them.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Fluid zones</div><p>Curved display units and circular seating islands make intimate, lounge-like browsing pods.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Tactile materials</div><p>Polished matte tile, textured plaster and brushed brass against soft fabric.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Sculptural light</div><p>Focused track light and soft cove glow reveal the clothing with no harsh shadow.</p></div>
      </div>
    </div>
    <div class="matstrip reveal">
      <span>Textured plaster</span><span>Matte tile</span><span>Brushed brass</span><span>Curved joinery</span><span>Cove light</span>
    </div>
  </div>
</section>

<section class="pd-showcase">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">The space</p>
      <h2 class="h-lg">A room that flows.</h2>
    </div>
    <div class="pd-full-grid reveal">
      <figure class="pd-full"><img src="${CIMG}space-01.webp" alt="Calibre, curved display walls and seating under the skylight" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${CIMG}space-02.webp" alt="Calibre, the sweeping reception and curved display" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${CIMG}space-03.webp" alt="Calibre, browsing pods and floating racks" loading="lazy" /></figure>
    </div>
  </div>
  <div class="container">
    <div class="pd-sec-head reveal pd-showcase__sub">
      <h2 class="h-lg">A closer look.</h2>
    </div>
  </div>
  <div class="slideshow reveal" data-autoplay="5500" aria-roledescription="carousel" aria-label="Calibre interior">
    <div class="slideshow__viewport">
      <figure class="slide is-active" data-cap="Circular seating islands beneath the sculpted skylight."><img src="${CIMG}look-01.webp" alt="Calibre, circular seating island" /></figure>
      <figure class="slide" data-cap="Arched display niches carved into the plaster walls."><img src="${CIMG}look-02.webp" alt="Calibre, arched display niches" loading="lazy" /></figure>
      <figure class="slide" data-cap="Floating hanging racks keep the circulation open."><img src="${CIMG}look-03.webp" alt="Calibre, floating hanging racks" loading="lazy" /></figure>
      <figure class="slide" data-cap="A lounge-like pod for browsing and fitting."><img src="${CIMG}look-04.webp" alt="Calibre, lounge-like browsing pod" loading="lazy" /></figure>
      <figure class="slide" data-cap="The sweeping perimeter wall folds around the room."><img src="${CIMG}look-05.webp" alt="Calibre, sweeping perimeter wall" loading="lazy" /></figure>
      <figure class="slide" data-cap="Daylight from the arched window across the curves."><img src="${CIMG}look-06.webp" alt="Calibre, daylight across the curved interior" loading="lazy" /></figure>
    </div>
    <button class="slideshow__nav slideshow__nav--prev" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 5l-7 7 7 7"/></svg></button>
    <button class="slideshow__nav slideshow__nav--next" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 5l7 7-7 7"/></svg></button>
    <div class="slideshow__bar">
      <div class="container slideshow__bar-inner">
        <span class="slideshow__cap">Circular seating islands beneath the sculpted skylight.</span>
        <div class="slideshow__dots" role="tablist"></div>
        <span class="slideshow__counter"><span class="cur">01</span><span class="sep">&thinsp;/&thinsp;</span><span class="total">06</span></span>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">Moments</p>
      <h2 class="h-lg">In the detail.</h2>
    </div>
    <div class="mgrid reveal">
      <figure class="mgrid__cell"><img src="${CIMG}moment-01.webp" alt="Calibre, a curved display detail" loading="lazy" /></figure>
      <figure class="mgrid__cell"><img src="${CIMG}moment-02.webp" alt="Calibre, an arched niche with accessories" loading="lazy" /></figure>
      <figure class="mgrid__cell"><img src="${CIMG}moment-03.webp" alt="Calibre, the fitting corner and mirror" loading="lazy" /></figure>
      <figure class="mgrid__cell"><img src="${CIMG}moment-04.webp" alt="Calibre, the lounge seating framed by the sculpted arch" loading="lazy" /></figure>
      <figure class="mgrid__cell"><img src="${CIMG}moment-05.webp" alt="Calibre, the sweeping reception desk under the skylight" loading="lazy" /></figure>
      <figure class="mgrid__cell"><img src="${CIMG}moment-06.webp" alt="Calibre, the curved cash counter and display shelving" loading="lazy" /></figure>
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

const IIMG = 'assets/projects/icon/';
const icon = `
<div class="pd-hero pd-hero--tall">
  <img src="${IIMG}hero.webp" alt="ICON office, backlit ROSCA identity wall at the entrance in oak veneer and stone" />
  <div class="pd-hero__cap"><div class="container">
    <span class="tag" style="color:#29465B">Interior Design, Office · Surat</span>
    <h1>ICON</h1>
    <p class="pd-hero__sub">A corporate workplace on the Surat skyline, framed by glass and light.</p>
  </div></div>
</div>

<section class="section pd-intro">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">The project</p>
        <h2 class="statement">A corporate floor organised for clarity, framed by glass, texture and the <em>city beyond.</em></h2>
      </div>
      <div class="reveal d1">
        <p class="lead">ICON is a top-floor corporate office for ROSCA in Surat, where the closed-cabin plan gives way to a transparent, glass-partitioned workplace. Full-height glazing opens the floor to the riverfront and skyline, while a disciplined material palette keeps the workspace calm and focused.</p>
        <p class="muted">Grey stone floors, oak-veneer joinery and a textured charcoal fabric feature wall ground the interior; slim black-metal frames, white worktops and mesh task seating keep it light and contemporary. A backlit identity wall and slatted timber ceiling mark the arrival, and layered recessed and linear lighting carry an even, glare-free glow across every desk.</p>
      </div>
    </div>
  </div>
  <div class="container" style="margin-top:clamp(46px,6vw,72px)">
    <div class="pd-meta reveal">
      <div><div class="k">Scope</div><div class="v">Interior Design</div></div>
      <div><div class="k">Type</div><div class="v">Corporate Office</div></div>
      <div><div class="k">Client</div><div class="v">ROSCA</div></div>
      <div><div class="k">Location</div><div class="v">Surat, Gujarat</div></div>
    </div>
    <p class="pd-credits reveal">Principal Designer <b>Bhavin Swami</b></p>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal"><p class="eyebrow">The idea</p><h2 class="h-lg">Clarity, framed.</h2></div>
      <div class="reveal d1 cpsych">
        <div class="cpsych__item"><div class="cpsych__k">Transparency</div><p>Glass partitions keep sightlines and daylight flowing end to end.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Warm neutrals</div><p>Grey stone and oak veneer ground the floor in a calm, corporate palette.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Texture</div><p>A charcoal fabric feature wall adds depth to the workspace without noise.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Focused light</div><p>Recessed and linear lighting give an even, glare-free glow at every desk.</p></div>
      </div>
    </div>
    <div class="matstrip reveal">
      <span>Grey stone</span><span>Oak veneer</span><span>Textured fabric</span><span>Glass</span><span>Black metal</span>
    </div>
  </div>
</section>

<section class="pd-showcase">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">The space</p>
      <h2 class="h-lg">Workspace, end to end.</h2>
    </div>
    <div class="pd-full-grid reveal">
      <figure class="pd-full"><img src="${IIMG}wk-01.webp" alt="ICON, open workstations along the glazed facade" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IIMG}wk-03.webp" alt="ICON, task desks along the textured feature wall" loading="lazy" /></figure>
      <figure class="pd-full"><img src="${IIMG}wk-05.webp" alt="ICON, the meeting room with a glass table" loading="lazy" /></figure>
    </div>
  </div>
  <div class="container">
    <div class="pd-sec-head reveal pd-showcase__sub">
      <h2 class="h-lg">A closer look.</h2>
    </div>
  </div>
  <div class="slideshow reveal" data-autoplay="5500" aria-roledescription="carousel" aria-label="ICON office interior">
    <div class="slideshow__viewport">
      <figure class="slide is-active" data-cap="Open workstations run the length of the glazed facade."><img src="${IIMG}wk-01.webp" alt="ICON, open workstations by the windows" /></figure>
      <figure class="slide" data-cap="Glass cabins keep the river view open to the whole floor."><img src="${IIMG}wk-02.webp" alt="ICON, glass cabins with the river view" loading="lazy" /></figure>
      <figure class="slide" data-cap="Task desks line the textured charcoal feature wall."><img src="${IIMG}wk-03.webp" alt="ICON, desks along the textured wall" loading="lazy" /></figure>
      <figure class="slide" data-cap="A director's cabin framed by art and glass."><img src="${IIMG}wk-04.webp" alt="ICON, a director's cabin" loading="lazy" /></figure>
      <figure class="slide" data-cap="The meeting room, screened by soft daylight blinds."><img src="${IIMG}wk-05.webp" alt="ICON, the meeting room" loading="lazy" /></figure>
    </div>
    <button class="slideshow__nav slideshow__nav--prev" aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 5l-7 7 7 7"/></svg></button>
    <button class="slideshow__nav slideshow__nav--next" aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 5l7 7-7 7"/></svg></button>
    <div class="slideshow__bar">
      <div class="container slideshow__bar-inner">
        <span class="slideshow__cap">Open workstations run the length of the glazed facade.</span>
        <div class="slideshow__dots" role="tablist"></div>
        <span class="slideshow__counter"><span class="cur">01</span><span class="sep">&thinsp;/&thinsp;</span><span class="total">05</span></span>
      </div>
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

const PIMG = 'assets/projects/pyramid-palacia/';
const pyramidPalacia = `
<div class="pd-hero pd-hero--tall">
  <img src="${PIMG}hero.webp" alt="Pyramid Palacia, serene warm-neutral bedroom" />
  <div class="pd-hero__cap"><div class="container">
    <span class="tag" style="color:#29465B">Interior Design, Residence · Surat</span>
    <h1>Pyramid Palacia</h1>
    <p class="pd-hero__sub">A warm, modern-luxury home grounded by brass and earthy texture.</p>
  </div></div>
</div>

<section class="section pd-intro">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">The project</p>
        <h2 class="statement">A clean, minimal foundation dressed in classic, high-end finishes, balanced around <em>visual equilibrium.</em></h2>
      </div>
      <div class="reveal d1">
        <p class="lead">Pyramid Palacia is a residence composed in the Modern Luxury Contemporary key. A warm base of creams and greys is grounded by rich, earthy brown; geometric wall paneling draws the eye upward, softened by floor-to-ceiling sheer drapery.</p>
        <p class="muted">Earth tones anchor the seating with comfort and intimacy, muted sage adds a cooling natural balance, and gold and brass bring a timeless refinement to lighting, inlays and table bases. Lighting is treated as sculptural art, layered daylight, sleek track light and grounding pendants in brushed brass and frosted glass, warming wood, stone and marble through every room.</p>
      </div>
    </div>
  </div>
  <div class="container" style="margin-top:clamp(46px,6vw,72px)">
    <div class="pd-meta reveal">
      <div><div class="k">Scope</div><div class="v">Interior Design</div></div>
      <div><div class="k">Style</div><div class="v">Modern Luxury Contemporary</div></div>
      <div><div class="k">Palette</div><div class="v">Warm neutrals &amp; brass</div></div>
      <div><div class="k">Location</div><div class="v">Surat, Gujarat</div></div>
    </div>
    <p class="pd-credits reveal">Principal Designer <b>Bhavin Swami</b> &middot; Senior Designer <b></b></p>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal"><p class="eyebrow">The idea</p><h2 class="h-lg">Grounded luxury.</h2></div>
      <div class="reveal d1 cpsych">
        <div class="cpsych__item"><div class="cpsych__k">Warm neutrals</div><p>Creams and greys for tranquility and an open, inviting calm.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Earth tones</div><p>Rich brown anchors the seating with comfort and intimacy.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Muted sage</div><p>A restorative, cooling natural balance within the minimal scheme.</p></div>
        <div class="cpsych__item"><div class="cpsych__k">Gold &amp; brass</div><p>Timeless elegance in the lighting, inlays and table bases.</p></div>
      </div>
    </div>
    <div class="matstrip reveal">
      <span>Wood</span><span>Brass</span><span>Marble</span><span>Textured plaster</span><span>Fabric</span>
    </div>
  </div>
</section>

<section class="pd-showcase">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">The space</p>
      <h2 class="h-lg">Room by room.</h2>
    </div>
    <div class="pd-full-grid pd-full-grid--quad pd-full-grid--tall reveal">
      <figure class="pd-full"><img src="${PIMG}space-01.webp" alt="Pyramid Palacia, master bedroom with a book-matched marble feature wall" loading="lazy" /><figcaption class="pd-full__cap">Master bedroom &middot; book-matched marble &amp; brass pendants</figcaption></figure>
      <figure class="pd-full"><img src="${PIMG}space-02.webp" alt="Pyramid Palacia, bedroom with fluted panelling and a media wall" loading="lazy" /><figcaption class="pd-full__cap">Bedroom &middot; fluted panelling &amp; wood media console</figcaption></figure>
      <figure class="pd-full"><img src="${PIMG}space-03.webp" alt="Pyramid Palacia, ensuite bathroom with a glazed partition and timber vanity" loading="lazy" /><figcaption class="pd-full__cap">Ensuite &middot; glazed partition &amp; fluted timber vanity</figcaption></figure>
      <figure class="pd-full"><img src="${PIMG}space-04.webp" alt="Pyramid Palacia, marble bathroom framed in brushed brass" loading="lazy" /><figcaption class="pd-full__cap">Bathroom &middot; grey marble framed in brushed brass</figcaption></figure>
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
    <p class="lead reveal" style="max-width:600px;margin-top:18px">Three connected disciplines under one roof, architecture, interiors and furniture, integrated into a single, comprehensive approach to transforming spaces.</p>
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
      <div class="step"><div class="step__n">01</div><h4>Sketch</h4><p>Ideas begin on paper, concept studies that capture the intent.</p></div>
      <div class="step"><div class="step__n">02</div><h4>Plan</h4><p>Rough thinking is resolved into a considered, comprehensive plan.</p></div>
      <div class="step"><div class="step__n">03</div><h4>Craft</h4><p>Production is set in motion with custom craftsmanship.</p></div>
      <div class="step"><div class="step__n">04</div><h4>Deliver</h4><p>The space or piece is refined, resolved and handed over.</p></div>
    </div>
  </div>
</section>

<section class="cta section">
  <div class="container reveal">
    <h2>Not sure which service you need?</h2>
    <p>Tell us about your project and we'll point you to the right starting point, no obligation.</p>
    <a href="contact.html" class="btn btn--ghost-light">Talk to us ${ARROW}</a>
  </div>
</section>`;

const about = `
<section class="section namesec" style="padding-top:clamp(120px,15vh,190px)">
  <div class="container">
    <div class="namesec__inner reveal">
      <img class="namesec__logo" src="assets/logo.png" alt="Tvastra Design LLP" />
      <p class="eyebrow no-rule" style="justify-content:center">The name</p>
      <h2 class="h-lg namesec__title">Rooted in tradition. Driven by the <em>power of creativity.</em></h2>
      <p class="lead namesec__lead">The name Tvastra traces back to the Sanskrit word for the supreme fashioner, the original architect responsible for giving shape to the unformed.</p>
      <p class="muted namesec__body">At Tvastra Design, architecture is more than constructing walls; it is the art of giving purpose to space. We harness the power of creativity to design structures that harmoniously balance proportion, light and material craftsmanship. From the conceptual sketch to the final execution, we shape spaces designed to stand the test of time.</p>
    </div>
  </div>
</section>

<section class="section section--paper2 leadership">
  <div class="container">
    <div class="pd-sec-head reveal">
      <p class="eyebrow">The people behind Tvastra</p>
      <h2 class="h-lg">Leadership.</h2>
    </div>
    <div class="ldr reveal">
      <figure class="ldr__photo">
        <img src="assets/founder/leadership-bw.webp" alt="Bhavin Swami and Alpa Swami, designated partners of Tvastra Design LLP" loading="lazy" />
        <figcaption>Bhavin Swami &amp; Alpa Swami &middot; Designated Partners</figcaption>
      </figure>
      <div class="ldr__bios">
        <div class="ldr__bio">
          <h3 class="ldr__name">Bhavin Swami</h3>
          <p class="ldr__role">Managing Director &amp; Principal Designer</p>
          <p class="muted">Bhavin Swami leads Tvastra Design LLP as its Managing Director and principal architect. With over three decades of practice, he sets the studio's design direction across architecture, interiors and product, pairing a deep respect for tradition and craft with a modern, problem-solving mindset.</p>
          <p class="muted">Hands-on from the first sketch to final execution, he is known for balancing proportion, light and material honesty, and for treating every project as someone's dream to be realised. His leadership shapes both the creative vision and the values that define the studio, people before projects.</p>
        </div>
        <div class="ldr__bio">
          <h3 class="ldr__name">Alpa Swami</h3>
          <p class="ldr__role">Partner &amp; Interior Designer</p>
          <p class="muted">Alpa Swami is a partner and core team member at Tvastra Design, known for her refined eye for detail and warm design sensibility. As an interior designer, she contributes to shaping spaces with balance, comfort and character.</p>
          <p class="muted">She also manages office operations and internal systems, ensuring the studio runs smoothly. Her thoughtful presence and organised approach make her an integral part of Tvastra's everyday functioning.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container grid-2 top">
    <div class="reveal">
      <p class="eyebrow">The studio</p>
      <h1 class="display" style="font-size:clamp(42px,6vw,86px)">Tvastra<br />Design LLP</h1>
      <p class="muted" style="margin-top:20px;font-family:var(--serif);font-size:clamp(18px,2vw,22px);color:var(--clay)">Inspired by creativity. Defined by design.</p>
    </div>
    <div class="reveal d1">
      <p class="lead">Tvastra Design LLP is an architecture and interior design firm dedicated to creating spaces that are functional, timeless and meaningful.</p>
      <p class="muted">We believe every project is more than a design assignment. It is someone's dream, lifestyle and future, and we treat it that way, blending creative thinking with practical planning, technical precision and quality execution.</p>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="container grid-2 top">
    <div class="reveal"><p class="eyebrow">What we bring</p><h2 class="h-lg">Creativity, grounded.</h2></div>
    <ul class="approach reveal d1">
      <li>Creative thinking</li>
      <li>Practical planning</li>
      <li>Technical precision</li>
      <li>Quality execution</li>
      <li>Client satisfaction</li>
    </ul>
  </div>
</section>

<section class="section section--ink">
  <div class="container grid-2 top">
    <div class="reveal"><p class="eyebrow">Why we started</p><h2 class="h-lg">Design that solves real problems.</h2></div>
    <div class="reveal d1">
      <p class="lead" style="color:#cfd9e0">Tvastra was founded on one simple belief: great design is not just about beautiful spaces, it is about solving real problems.</p>
      <p class="muted" style="margin-bottom:20px">So every design we make sets out to be:</p>
      <ul class="approach">
        <li>Functional</li>
        <li>Practical</li>
        <li>Creative</li>
        <li>Budget friendly</li>
        <li>Long lasting</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="container grid-2 top">
    <div class="reveal"><p class="eyebrow">Our philosophy</p><h2 class="statement">People always come before <em>projects.</em></h2></div>
    <div class="reveal d1">
      <p class="muted" style="margin-bottom:20px">Whether it is a client, a vendor, a contractor or a team member, everyone deserves respect. That belief shows up as:</p>
      <ul class="approach">
        <li>Respect and trust</li>
        <li>Transparency</li>
        <li>Honest communication</li>
        <li>Long-term relationships</li>
      </ul>
    </div>
  </div>
</section>

<section class="cta section">
  <div class="container reveal">
    <h2>Let's build something worth returning to.</h2>
    <p>A home, a workspace, an interior or a single piece of furniture, we'd love to hear what you're planning.</p>
    <a href="contact.html" class="btn btn--ghost-light">Get in touch ${ARROW}</a>
  </div>
</section>`;

const contact = `
<section class="section" style="padding-top:clamp(120px,15vh,190px)">
  <div class="container reveal" style="max-width:760px;margin-bottom:clamp(40px,5vw,60px)">
    <p class="eyebrow">Say hello</p>
    <h1 class="display" style="font-size:clamp(44px,7vw,96px)">Let's talk.</h1>
    <p class="lead" style="margin-top:22px">Tell us a little about your project, the site, the idea, the timeline, and we'll get back to you within a couple of working days.</p>
  </div>
  <div class="container contact-grid">
    <div class="reveal">
      <div class="cinfo"><div class="k">Studio</div><div class="v">Patel Faliyu, near Pal-Umra Bridge,<br />opp. Karuna Sagar Temple, Umra Rd,<br />Athwalines, Surat, Gujarat 395007<br /><a class="link-arrow" style="font-size:12px;margin-top:12px" href="https://www.google.com/maps/search/?api=1&amp;query=Tvastra%20Design%20LLP%2C%20Umra%20Road%2C%20Athwalines%2C%20Surat%2C%20Gujarat%20395007" target="_blank" rel="noopener">View on Google Maps ${ARROW}</a></div></div>
      <div class="cinfo"><div class="k">Email</div><div class="v"><a href="mailto:info@tvastra.design">info@tvastra.design</a></div></div>
      <div class="cinfo"><div class="k">Phone</div><div class="v"><a href="tel:+919081813231">+91 90818 13231</a></div></div>
      <div class="cinfo"><div class="k">Hours</div><div class="v">Mon to Sat, 10:00 to 18:00</div></div>
      <div class="socials" style="margin-top:16px">
        <a href="https://www.instagram.com/tvastradesignllp/" aria-label="Instagram" target="_blank" rel="noopener" style="border-color:var(--line)">${IG}</a>
        <a href="https://www.linkedin.com/company/tvastra-design-/" aria-label="LinkedIn" target="_blank" rel="noopener" style="border-color:var(--line)">${LI}</a>
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
    <p class="lead" style="margin-top:22px">Considered, crafted work, and the honours it has quietly earned along the way.</p>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <div class="rec-list reveal">
      <div class="rec-item">
        <div class="rec-item__year"><img class="rec-item__seal rec-item__seal--adc" src="assets/awards/adc.png" alt="Gold Winner, International Architecture &amp; Design Awards 2025" loading="lazy" /><span>2025</span></div>
        <div>
          <h3 class="rec-item__title">Gold Winner</h3>
          <div class="rec-item__where">IADA 2025 &middot; Architecture &amp; Design Collection</div>
          <p class="muted" style="margin:0">Custom Interior Design Category, for <a href="metal-life.html" class="crumb">Metal Life</a>, our raw industrial shell warmed with terracotta, copper and light.</p>
        </div>
        <a class="rec-item__tag rec-item__tag--link" href="https://ad-c.org/winner/metal-life-gold-winner-custom-interior-design-category-iada-2025/" target="_blank" rel="noopener">View award ${ARROW}</a>
      </div>
      <div class="rec-item">
        <div class="rec-item__year"><img class="rec-item__seal rec-item__seal--apsda" src="assets/awards/apsda.png" alt="Asia-Pacific Space Designers Association" loading="lazy" /><span>2025</span></div>
        <div>
          <h3 class="rec-item__title">Honorary Mention</h3>
          <div class="rec-item__where">APSDA Awards 2025 &middot; Asia-Pacific Space Designers Association</div>
          <p class="muted" style="margin:0">Residential Category, for <a href="metal-life.html" class="crumb">Metal Life</a>, recognised among the Asia-Pacific's finest interiors.</p>
        </div>
        <a class="rec-item__tag rec-item__tag--link" href="https://apsda.org/competition/apsda-awards-2025/finalist-list/" target="_blank" rel="noopener">View listing ${ARROW}</a>
      </div>
      <div class="rec-item">
        <div class="rec-item__year"><img class="rec-item__seal rec-item__seal--id" src="assets/awards/interior-design.png" alt="Interior Design magazine" loading="lazy" /><span>2024</span></div>
        <div>
          <h3 class="rec-item__title">Best of Year 2024</h3>
          <div class="rec-item__where">Interior Design magazine</div>
          <p class="muted" style="margin:0">Recognised in Interior Design magazine's Best of Year 2024, for the Medium City House residence.</p>
        </div>
        <a class="rec-item__tag rec-item__tag--link" href="https://interiordesign.net/awards/best-of-year/2024/tvastra-design-medium-city-house/" target="_blank" rel="noopener">View feature ${ARROW}</a>
      </div>
      <div class="rec-item">
        <div class="rec-item__year"><img class="rec-item__seal rec-item__seal--adc" src="assets/awards/platinum.png" alt="Platinum Winner, Architecture &amp; Design Collection Awards 2023" loading="lazy" /><span>2023</span></div>
        <div>
          <h3 class="rec-item__title">Platinum Winner</h3>
          <div class="rec-item__where">Architecture &amp; Design Collection Awards</div>
          <p class="muted" style="margin:0">Honoured for design that integrates utility, aesthetics, function and style into a single, considered whole.</p>
        </div>
        <a class="rec-item__tag rec-item__tag--link" href="https://architecture-collection.com/winner/platinum-winner-meshobase-adca2023/" target="_blank" rel="noopener">View award ${ARROW}</a>
      </div>
    </div>
    <p class="muted reveal" style="margin-top:30px;font-size:15px">More awards and press features will appear here as they're announced. Have a feature to share? <a href="contact.html" class="link-arrow" style="font-size:12px">Get in touch ${ARROW}</a></p>
  </div>
</section>

<section class="section section--ink">
  <div class="container">
    <div class="stats reveal" style="border:0;padding:0;margin:0">
      <div class="stat"><div class="n">29</div><div class="l">Years of practice</div></div>
      <div class="stat"><div class="n">4</div><div class="l">Awards &amp; honours</div></div>
      <div class="stat"><div class="n">3</div><div class="l">Design disciplines</div></div>
      <div class="stat"><div class="n">Surat</div><div class="l">Gujarat, India</div></div>
    </div>
    <p class="muted reveal" style="text-align:center;margin-top:40px;font-size:15px">Led by designated partners Bhavin Ghanshyambhai Swami &amp; Alpaben Bhavinbhai Swami.</p>
  </div>
</section>

<section class="cta section">
  <div class="container reveal">
    <h2>Let's create something worth celebrating.</h2>
    <p>Tell us about your project, we'd love to help shape it.</p>
    <a href="contact.html" class="btn btn--ghost-light">Get in touch ${ARROW}</a>
  </div>
</section>`;

const foundersMind = `
<div class="pd-hero pd-hero--tall fmind-hero">
  <img src="assets/founder/founder-wide-hd.webp" alt="The founder of Tvastra Design LLP" />
  <div class="pd-hero__cap"><div class="container">
    <span class="tag" style="color:#004477">The founder</span>
    <h1>Inside the founder's mind</h1>
    <p class="pd-hero__sub">Designing since 1995, a way of seeing, before it is a way of building.</p>
  </div></div>
</div>

<section class="section pd-intro">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">The founder's journey</p>
        <h2 class="statement">Passion became <em>purpose.</em></h2>
      </div>
      <div class="reveal d1">
        <p class="lead">The passion for designing started during college, learning by balancing education with real site work, days on projects and nights on assignments.</p>
        <p class="muted">Real-world experience became the biggest teacher. Every project strengthened both knowledge and confidence, and taught a simple lesson that still guides the studio: success comes from continuous learning and practical experience.</p>
        <p class="muted">My journey has been shaped by over three decades of exploring how people truly live in and interact with spaces. Early on I realised that design is not just about aesthetics but about creating experiences, a philosophy that blends functionality, sustainability and timeless elegance, so every project enhances both lifestyle and well-being.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--ink">
  <div class="container">
    <div class="reveal" style="max-width:760px">
      <p class="eyebrow">What I believe</p>
      <h2 class="h-lg" style="margin-bottom:26px">Good design is quiet.</h2>
      <p class="lead" style="color:#cfd9e0">It does not announce itself. It earns its place through proportion, light and material, through the patience to resolve the unseen details, and the discipline to leave out everything that isn't needed.</p>
      <p class="muted" style="margin-top:16px">I begin by understanding the aspirations of the client and the cultural context of the project, then distil those insights into spatial experiences, natural light, proportion, texture and materiality, that engage the senses. The concept comes alive when architecture responds to human emotion, not just physical needs.</p>
      <p class="muted" style="margin-top:16px">A few things stay non-negotiable. A home should breathe, so natural light, generous proportions and the honest use of materials like stone, wood and glass are where every project begins, and where timelessness is earned.</p>
      <p class="lead" style="color:#cfd9e0;margin-top:22px">Three words, in the end: <em>timeless, experiential, refined.</em></p>
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

<section class="section section--paper2">
  <div class="container">
    <div class="grid-2 top">
      <div class="reveal">
        <p class="eyebrow">Continued learning</p>
        <h2 class="h-lg">Certifications.</h2>
        <p class="muted" style="margin-top:16px;max-width:34ch">An ongoing commitment to sustainable, responsible building, kept current through green-building and ESG training.</p>
      </div>
      <ul class="certs reveal d1">
        <li class="cert"><span class="cert__yr">2026</span><div class="cert__body"><div class="cert__title">Natural Building Course</div><div class="cert__by">Completed &middot; Certificate 26-06964</div></div><a class="cert__thumb" href="assets/founder/certs/natural-building.webp" target="_blank" rel="noopener"><img src="assets/founder/certs/natural-building.webp" alt="Natural Building Course certificate" loading="lazy" /></a></li>
        <li class="cert"><span class="cert__yr">2025</span><div class="cert__body"><div class="cert__title">Carbon Accounting Masterclass</div><div class="cert__by">ESG Academy by Tattva ESG Solutions</div></div><a class="cert__thumb" href="assets/founder/certs/carbon-accounting.webp" target="_blank" rel="noopener"><img src="assets/founder/certs/carbon-accounting.webp" alt="Carbon Accounting Masterclass certificate" loading="lazy" /></a></li>
        <li class="cert"><span class="cert__yr">2024</span><div class="cert__body"><div class="cert__title">Sustainable Home Week</div><div class="cert__by">UGREEN &mdash; Green Building School</div></div><a class="cert__thumb" href="assets/founder/certs/sustainable-home-week.webp" target="_blank" rel="noopener"><img src="assets/founder/certs/sustainable-home-week.webp" alt="Sustainable Home Week certificate, UGREEN" loading="lazy" /></a></li>
        <li class="cert"><span class="cert__yr">2023</span><div class="cert__body"><div class="cert__title">Sustainable Architecture Workshop</div><div class="cert__by">UGREEN &mdash; Green Building School &middot; 16-hour Green Building Training</div></div><a class="cert__thumb" href="assets/founder/certs/sustainable-architecture.webp" target="_blank" rel="noopener"><img src="assets/founder/certs/sustainable-architecture.webp" alt="Sustainable Architecture Workshop certificate, UGREEN" loading="lazy" /></a></li>
      </ul>
    </div>
  </div>
</section>

<a class="fpband reveal" href="founder-portfolio.html" aria-label="Open the founder's portfolio">
  <img class="fpband__img" src="assets/founder/portfolio-band-bw.webp" alt="The founder marking timber beside furniture design sketches in the workshop" loading="lazy" />
  <span class="fpband__blur" aria-hidden="true"></span>
  <span class="fpband__shade" aria-hidden="true"></span>
  <div class="fpband__inner">
    <div class="fpband__text">
      <p class="eyebrow">The founder's portfolio</p>
      <h2 class="fpband__title">A designer's eye, off the drawing board.</h2>
      <p class="fpband__lead">From the first pencil sketch to the finished joint, a personal archive of the founder's projects and craft.</p>
      <span class="link-arrow">View the portfolio ${ARROW}</span>
    </div>
  </div>
</a>

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

// The founder's personal portfolio — projects and photographs, added over time.
// To add a piece, drop its image in assets/founder/portfolio/ and append an entry:
//   { img: 'assets/founder/portfolio/<file>.webp', name: 'Title', side: 'Place · Year', href: 'optional-link.html' }
const FOUNDER_WORKS = [
];

function fwcard(num, w) {
  return `<a class="dcol reveal" href="${w.href || '#'}">
      <div class="dcol__img"><img src="${w.img}" alt="${w.name}" loading="lazy" /></div>
      <div class="dcol__top"><span class="dcol__num">${num}</span><span class="dcol__title">${w.name}</span></div>
      <span class="dcol__side">${w.side || ''}</span>
      ${PLUS}
    </a>`;
}

const founderPortfolio = `
<section class="dsec">
  <div class="container">
    <div class="whead reveal">
      <span class="whead__ghost" aria-hidden="true">Portfolio</span>
      <p class="eyebrow"><a href="founders-mind.html" class="crumb">Inside the founder's mind</a> &middot; Portfolio</p>
      <h1 class="whead__title display" style="font-size:clamp(40px,6.4vw,88px)">The portfolio.</h1>
    </div>
    <p class="lead reveal" style="max-width:640px;margin-top:18px">A personal archive of projects and photographs by the founder of Tvastra Design LLP and former founding partner of Utopia Designs, a designer's eye at work beyond the drawing board.</p>
  </div>
  ${FOUNDER_WORKS.length
    ? `<div class="pcols">\n      ${FOUNDER_WORKS.map(function (w, i) { return fwcard(String(i + 1).padStart(2, '0'), w); }).join('\n      ')}\n    </div>`
    : `<div class="container"><div class="disc-empty disc-empty--dark reveal"><span>The portfolio is being compiled. Projects and photographs will be added here.</span><a href="contact.html" class="link-arrow">Enquire ${ARROW}</a></div></div>`}
</section>
`;

const PERKS = [
  ['Professional development', 'Ongoing training for skill growth and career advancement.'],
  ['Rewarding culture', 'An annual allowance to empower your journey.'],
  ['Enrichment workshops', 'Broaden your expertise and advance your career.'],
  ['Project variety', 'Diverse projects from residential to commercial keep the work dynamic.'],
  ['Collaborative environment', 'A team-oriented atmosphere that encourages creativity.'],
  ['Sustainability initiatives', 'Join eco-friendly projects that make a real difference.'],
];

const ROLES = [
  { title: 'Architect', qual: 'B.Arch', overview: 'We are looking for architects to work across our residential and commercial projects, from concept and design development through documentation, approvals and site execution. Open to a range of experience.', points: ['Develop design and construction drawing sets', 'Prepare 3D models and renders to communicate design intent', 'Coordinate approvals, consultants and statutory drawings', 'Visit site to check execution against drawings'] },
  { title: 'Interior Designer', qual: 'Degree or diploma in Interior Design', overview: 'We are looking for interior designers to shape considered residential and commercial interiors, from concept and material selection through documentation and site coordination. Open to a range of experience.', points: ['Develop working, joinery and detail drawing sets', 'Prepare 3D models, renders and walkthroughs', 'Select materials, finishes and FF&E and prepare schedules', 'Coordinate vendors and check execution on site'] },
];

function roleItem(r) {
  return `<details class="role reveal">
      <summary class="role__head">
        <span class="role__title">${r.title}</span>
        <span class="role__exp">Full-time &middot; Surat</span>
        <span class="role__toggle" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 5v14M5 12h14"/></svg></span>
      </summary>
      <div class="role__body">
        <p class="role__overview">${r.overview}</p>
        <div class="role__meta">
          <div><span class="role__k">Qualification</span>${r.qual}</div>
          <div><span class="role__k">Type</span>Full-time &middot; Surat</div>
        </div>
        <ul class="role__points">${r.points.map(function (p) { return `<li>${p}</li>`; }).join('')}</ul>
        <a class="link-arrow" href="mailto:info@tvastra.design?subject=${encodeURIComponent('Application: ' + r.title)}">Apply for this role ${ARROW}</a>
      </div>
    </details>`;
}

const careers = `
<section class="section" style="padding-top:clamp(120px,15vh,190px)">
  <div class="container grid-2 top">
    <div class="reveal">
      <p class="eyebrow">Join us</p>
      <h1 class="display" style="font-size:clamp(44px,7vw,96px)">Careers.</h1>
    </div>
    <div class="reveal d1">
      <p class="lead">We are always looking for thoughtful, curious people who care about the craft of building. If you want to learn by doing, from the first sketch to the finished site, we would love to hear from you.</p>
      <p class="muted">Tvastra is a hands-on studio. People come before projects, and that is the same culture we bring to our team: respect, trust, transparency and long-term relationships.</p>
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="container">
    <div class="reveal" style="max-width:640px;margin-bottom:clamp(34px,4.5vw,52px)"><p class="eyebrow">Life at Tvastra</p><h2 class="h-lg">Perks &amp; benefits.</h2></div>
    <div class="perks reveal">
      ${PERKS.map(function (p) { return `<div class="perk"><h4 class="perk__t">${p[0]}</h4><p>${p[1]}</p></div>`; }).join('\n      ')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="reveal" style="max-width:640px;margin-bottom:clamp(30px,4vw,44px)"><p class="eyebrow">Open roles</p><h2 class="h-lg">Join the studio.</h2></div>
    <div class="roles reveal">
      ${ROLES.map(roleItem).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--ink" style="text-align:center">
  <div class="container reveal">
    <p class="eyebrow no-rule" style="justify-content:center">How to apply</p>
    <h2 class="h-lg" style="margin-bottom:16px">Send us your work.</h2>
    <p class="lead" style="color:#cfd9e0;max-width:56ch;margin:0 auto 30px">Email your CV and portfolio and tell us which role interests you. We read every application.</p>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a href="mailto:info@tvastra.design?subject=Career%20at%20Tvastra%20Design%20LLP" class="btn btn--ghost-light">Email your portfolio ${ARROW}</a>
      <a href="contact.html" class="btn btn--ghost-light">Contact the studio</a>
    </div>
  </div>
</section>`;

/* ---------- assemble ---------- */
// The founder's video library. To add a film, drop the .mp4 in assets/gospels/videos/
// and a poster in assets/gospels/, then append an entry:
//   { title:'', topic:'', length:'12:04', desc:'', poster:'assets/gospels/<file>.webp', video:'assets/gospels/videos/<file>.mp4' }
const GOSPELS = [
  {
    title: 'What is the meaning of Tvastra?',
    topic: 'Ideas',
    length: '0:56',
    desc: 'The founder on the name Tvastra and the idea behind the studio, an episode of Arch Corner by ConcreeXpo.',
    poster: 'assets/gospels/ep-tvastra-poster.webp',
    video: 'assets/gospels/videos/tvastra-meaning.mp4',
  },
  {
    title: 'Golden words for every young designer',
    topic: 'Points of view',
    length: '1:07',
    desc: 'Thirty years in, the founder shares his advice for every upcoming designer, an episode of Arch Corner by ConcreeXpo.',
    poster: 'assets/gospels/ep-golden-words-poster.webp',
    video: 'assets/gospels/videos/golden-words.mp4',
  },
  {
    title: 'The biggest challenges in site supervision',
    topic: 'Thought process',
    length: '1:13',
    desc: 'The founder on the realities of site supervision and getting a project executed.',
    poster: 'assets/gospels/ep-reel-1-poster.webp',
    video: 'assets/gospels/videos/reel-1.mp4',
  },
  {
    title: 'Are you choosing the right colour for your space?',
    topic: 'Ideas',
    length: '1:56',
    desc: 'The founder on choosing colour for a space, and why it matters more than you think.',
    poster: 'assets/gospels/ep-reel-2-poster.webp',
    video: 'assets/gospels/videos/reel-2.mp4',
  },
  {
    title: 'What shapes the feeling of a space?',
    topic: 'Points of view',
    length: '1:19',
    desc: 'The founder on what most influences how a space feels to be in.',
    poster: 'assets/gospels/ep-reel-3-poster.webp',
    video: 'assets/gospels/videos/reel-3.mp4',
  },
  {
    title: 'Meet the founder, in three points',
    topic: 'Thought process',
    length: '1:42',
    desc: 'A short introduction from the founder, and the three points he keeps coming back to.',
    poster: 'assets/gospels/ep-reel-4-poster.webp',
    video: 'assets/gospels/videos/reel-4.mp4',
  },
];
function gcard(v) {
  return `<figure class="gclip reveal">
      <video class="gclip__video" controls playsinline preload="none" poster="${v.poster}" src="${v.video}"></video>
      <figcaption class="gclip__body">
        ${v.topic ? `<span class="gcard__tag">${v.topic}</span>` : ''}
        <span class="gcard__title">${v.title}</span>
        ${v.desc ? `<span class="gcard__desc">${v.desc}</span>` : ''}
      </figcaption>
    </figure>`;
}

const gospels = `
<section class="gband">
  <img class="gband__img" src="assets/gospels/founder-band-bw.webp" alt="The founder of Tvastra Design LLP in conversation on a workshop floor" />
  <span class="gband__blur" aria-hidden="true"></span>
  <span class="gband__shade" aria-hidden="true"></span>
  <div class="gband__inner">
    <div class="gband__text">
      <p class="eyebrow">The founder's voice</p>
      <h1 class="gband__title">Gospels.</h1>
      <p class="gband__lead">A growing library of short films where the founder shares his thought process, ideas and points of view, the thinking behind the work, in his own words.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="matstrip reveal"><span>Thought process</span><span>Ideas</span><span>Points of view</span></div>
    ${GOSPELS.length
      ? `<div class="gvid-grid reveal">\n      ${GOSPELS.map(gcard).join('\n      ')}\n    </div>`
      : `<div class="disc-empty reveal" style="margin-top:clamp(28px,4vw,46px)"><span>The first films are being recorded. Soon you'll find the founder's thoughts, ideas and points of view here.</span><a href="contact.html" class="link-arrow">Get in touch ${ARROW}</a></div>`}
  </div>
</section>

<section class="cta section">
  <div class="container reveal">
    <h2>Have a question for the founder?</h2>
    <p>Send it in, it might become the next film.</p>
    <a href="contact.html" class="btn btn--ghost-light">Get in touch ${ARROW}</a>
  </div>
</section>`;

const PAGES = [
  { file: 'index.html',                id: 'home',      nav: 'index.html',    dark: true,  title: 'Tvastra Design LLP, Architecture, Interiors & Product Design', desc: 'Tvastra Design LLP, an established architecture, interior and product design practice in Surat blending ethnical and cultural elegance with contemporary craft.', content: home },
  { file: 'recognition.html',          id: 'recognition', nav: 'recognition.html', dark: false, title: 'Recognition, Tvastra Design LLP', desc: 'Awards and recognition for Tvastra Design LLP, including the 2023 A&D Collection Platinum Award.', content: recognition },
  { file: 'careers.html',              id: 'careers',   nav: 'careers.html',  dark: false, title: 'Careers, Tvastra Design LLP', desc: 'Careers at Tvastra Design LLP. Join a hands-on architecture, interior and product design studio in Surat.', content: careers },
  { file: 'gospels.html',              id: 'gospels',   nav: 'gospels.html',  dark: true, title: 'Gospels, Tvastra Design LLP', desc: "Gospels, a video library where the founder of Tvastra Design LLP shares his thought process, ideas and points of view.", content: gospels },
  { file: 'projects.html',             id: 'projects',  nav: 'projects.html', dark: true,  title: 'Work, Tvastra Design LLP', desc: 'Selected architecture, interior and product design work by Tvastra Design LLP, including Vritta.', content: projects },
  { file: 'projects-architecture.html', id: 'proj-arch', nav: 'projects.html', dark: true, title: 'Architecture Projects, Tvastra Design LLP', desc: 'Residential architecture projects by Tvastra Design LLP across Surat, Gujarat.', content: projArch },
  { file: 'projects-interior.html',    id: 'proj-int',  nav: 'projects.html', dark: true,  title: 'Interior Design Projects, Tvastra Design LLP', desc: 'Interior design work by Tvastra Design LLP, considered materials, custom furniture and contemporary warmth.', content: projInterior },
  { file: 'projects-product.html',     id: 'proj-prod', nav: 'projects.html', dark: true,  title: 'Product Design Projects, Tvastra Design LLP', desc: 'Furniture and product design by Tvastra Design LLP.', content: projProduct },
  { file: 'vritta.html', id: 'project',   nav: 'projects.html', dark: true,  title: 'Vritta, Tvastra Design LLP', desc: 'Vritta, a sculptural brick-and-concrete family home in Surat by Tvastra Design LLP.', content: vritta },
  { file: 'rju.html',   id: 'project3',  nav: 'projects.html', dark: true,  title: 'Ṛju, Tvastra Design LLP', desc: 'Ṛju, a green, terraced residence with cascading planting and a brick-jaali screen in Surat by Tvastra Design LLP.', content: rju },
  { file: 'jalika.html', id: 'project4', nav: 'projects.html', dark: true,  title: 'Jālikā, Tvastra Design LLP', desc: 'Jālikā, a terracotta-and-concrete family home with vertical gardens and timber-jaali screens in Surat by Tvastra Design LLP.', content: jalika },
  { file: 'vallabh-nivas.html',   id: 'project5', nav: 'projects.html', dark: true,  title: 'Vallabh Nivas, Tvastra Design LLP', desc: 'Vallabh Nivas, a concrete-and-timber family home with planted balconies and cascading greenery in Surat by Tvastra Design LLP.', content: vallabhNivas },
  { file: 'urdhva.html',  id: 'project6', nav: 'projects.html', dark: true,  title: 'Urdhva, Tvastra Design LLP', desc: 'Urdhva, a crisp white-and-sage cubic villa with a glowing exposed-brick jaali in Surat by Tvastra Design LLP.', content: urdhva },
  { file: 'valuka.html', id: 'project7', nav: 'projects.html', dark: true,  title: 'Vālukā, Tvastra Design LLP', desc: 'Vālukā, a warm earthen courtyard home in clay render and rammed-earth-textured stone in Surat by Tvastra Design LLP.', content: valuka },
  { file: 'asamvrta.html',  id: 'project8', nav: 'projects.html', dark: true,  title: 'Asaṁvṛta, Tvastra Design LLP', desc: 'Asaṁvṛta, a contemporary stone-and-brick apartment building with deep balconies and a rooftop pavilion in Surat by Tvastra Design LLP.', content: asamvrta },
  { file: 'metal-life.html',   id: 'proj-nehal', nav: 'projects.html', dark: true, title: 'Metal Life, Interior Design by Tvastra Design LLP', desc: 'Metal Life, a raw industrial interior warmed with terracotta, copper and greenery in Surat by Tvastra Design LLP.', content: metalLife },
  { file: 'juneberry.html',    id: 'proj-juneberry', nav: 'projects.html', dark: true, title: 'Juneberry, Café Interior by Tvastra Design LLP', desc: 'Juneberry, a 1,170 sq ft sustainable specialty-coffee café in Surat (2025) by Tvastra Design LLP, sculpted-plaster walls, upcycled-textile installations and waste-into-art craft.', content: juneberry },
  { file: 'calibre.html',      id: 'proj-calibre', nav: 'projects.html', dark: true, title: 'Calibre, Boutique Interior by Tvastra Design LLP', desc: 'Calibre, a 1,950 sq ft luxury fashion boutique in Vesu, Surat (2025) by Tvastra Design LLP, sweeping curved plaster walls, sculptural forms and a fluid, immersive retail experience.', content: calibre },
  { file: 'icon.html',         id: 'proj-icon',    nav: 'projects.html', dark: true, title: 'ICON, Corporate Office Interior by Tvastra Design LLP', desc: 'ICON, a top-floor corporate office for ROSCA in Surat by Tvastra Design LLP, a transparent, glass-partitioned workplace in grey stone, oak veneer and textured fabric.', content: icon },
  { file: 'pyramid-palacia.html', id: 'proj-pyramid', nav: 'projects.html', dark: true, title: 'Pyramid Palacia, Residential Interior by Tvastra Design LLP', desc: 'Pyramid Palacia, a Modern Luxury Contemporary residential interior in Surat by Tvastra Design LLP, warm neutrals, earthy texture, marble and brass.', content: pyramidPalacia },
  { file: 'services.html',             id: 'services',  nav: 'services.html', dark: true,  title: 'Disciplines, Tvastra Design LLP', desc: 'Architecture, interior design and product design disciplines of Tvastra Design LLP.', content: services },
  { file: 'about.html',                id: 'about',     nav: 'about.html',    dark: false, title: 'Studio, Tvastra Design LLP', desc: 'About Tvastra Design LLP, an established architecture, interior and product design practice; our philosophy, vision and principles.', content: about },
  { file: 'founders-mind.html',        id: 'founders-mind', nav: 'about.html', dark: true, title: "Inside the Founder's Mind, Tvastra Design LLP", desc: "Inside the founder's mind, designing since 1995 across architecture, interiors, product design, turn-key projects and project management.", content: foundersMind },
  { file: 'founder-portfolio.html',    id: 'founder-portfolio', nav: 'about.html', dark: true, title: "The Founder's Portfolio, Tvastra Design LLP", desc: "The founder's portfolio, a personal archive of projects and photographs by the founder of Tvastra Design LLP.", content: founderPortfolio },
  { file: 'contact.html',              id: 'contact',   nav: 'contact.html',  dark: false, title: 'Contact, Tvastra Design LLP', desc: 'Get in touch with Tvastra Design LLP to discuss your architecture, interior or furniture project.', content: contact },
];

for (const p of PAGES) {
  const html = head(p.title, p.desc) + header(p.nav, p.dark) + p.content + FOOTER;
  fs.writeFileSync(path.join(ROOT, p.file), html);
  console.log('wrote', p.file);
}

/* ---------- preview bundle (SPA, data-URI images) ---------- */
if (process.argv[2] === 'preview') {
  const OUTP = process.argv[3] || path.join(ROOT, 'preview.html');
  const mime = { '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4' };
  const OVERRIDE = process.env.PREVIEW_ASSETS || ''; // dir of downscaled/compressed copies
  const cache = {};
  function toData(rel) {
    if (cache[rel]) return cache[rel];
    const ext = path.extname(rel).toLowerCase();
    const mt = mime[ext] || 'application/octet-stream';
    // Prefer a downscaled/compressed override copy to keep the bundle small.
    if (OVERRIDE) {
      const ov = path.join(OVERRIDE, rel);
      if (fs.existsSync(ov)) {
        const uri = `data:${mt};base64,${fs.readFileSync(ov).toString('base64')}`;
        cache[rel] = uri; return uri;
      }
    }
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) return rel;
    const uri = `data:${mt};base64,${fs.readFileSync(abs).toString('base64')}`;
    cache[rel] = uri; return uri;
  }
  const css = fs.readFileSync(path.join(ROOT, 'css/style.css'), 'utf8');
  const hmap = {}; PAGES.forEach(p => hmap[p.file] = '#' + p.id);

  function prep(content) {
    // data-URI images
    content = content.replace(/(src=")(assets\/[^"]+)(")/g, (m,a,rel,b) => a + toData(rel) + b);
    // data-URI videos (Gospels) so they play inside the single-file preview
    content = content.replace(/(data-video=")(assets\/[^"]+)(")/g, (m,a,rel,b) => a + toData(rel) + b);
    // data-URI video posters
    content = content.replace(/(poster=")(assets\/[^"]+)(")/g, (m,a,rel,b) => a + toData(rel) + b);
    // *.html -> hash
    content = content.replace(/href="([a-z0-9-]+\.html)(#[a-z0-9-]+)?"/g, (m,f) => `href="${hmap[f] || ('#'+f)}"`);
    return content;
  }

  let sections = '';
  for (const p of PAGES) sections += `\n<div class="page" id="${p.id}" data-dark="${p.dark?1:0}">\n${prep(p.content)}\n</div>\n`;

  const navLinks = [['home','Home'],['services','Discipline'],['about','About Us'],['gospels','Gospels'],['recognition','Recognition'],['careers','Careers'],['contact','Contact Us']]
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
  if(form) form.addEventListener('submit', function(e){ e.preventDefault(); var n=form.querySelector('.form-status'); if(n) n.textContent="Thank you, your enquiry has reached us. (Preview: not actually sent.)"; form.reset(); });

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

  // Gospels: inline players, one at a time
  var gclips = [].slice.call(document.querySelectorAll('.gclip__video'));
  gclips.forEach(function(v){ v.addEventListener('play', function(){ gclips.forEach(function(o){ if(o!==v) o.pause(); }); }); });

  var start = (location.hash||'#home').slice(1);
  show(document.getElementById(start)?start:'home');
})();
</script>`;

  const banner = `<div style="position:fixed;bottom:0;left:0;right:0;z-index:200;background:var(--ink);color:#cfd9e0;font:500 12px/1.4 var(--sans);letter-spacing:.02em;text-align:center;padding:8px 16px">Interactive preview, click through every page. Web-font rendering differs slightly from the deployed site.</div>`;

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
