/* ==========================================================================
   Tvastra Design LLP — static site builder
   Generates the 7 HTML pages from shared header/footer + per-page content,
   and (optionally) a single-file interactive preview bundle.
   Run:  node build.js         -> writes the site pages
         node build.js preview -> also writes preview.html (data-URI, SPA)
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;

/* ---------- shared bits ---------- */
const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin /><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..500;1,9..144,300..500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />';

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
<link rel="stylesheet" href="css/style.css" />
</head>
<body>`;
}

const NAV = [['projects.html','Work'],['services.html','Services'],['about.html','Studio'],['contact.html','Contact']];
function header(active, dark) {
  var cls = dark ? 'site-header' : 'site-header solid on-light';
  var links = NAV.map(function(n){
    var a = n[0] === active ? ' class="active"' : '';
    return `<li><a href="${n[0]}"${a}>${n[1]}</a></li>`;
  }).join('');
  return `
<header class="${cls}">
  <div class="container nav">
    <a class="brand" href="index.html" aria-label="Tvastra Design LLP — home">
      <span class="name">Tvastra</span><span class="sub">Design LLP</span>
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
        <div class="name">Tvastra</div><div class="sub">Design LLP</div>
        <p>Architecture, interiors &amp; product design — a 29-year practice blending historical elegance with contemporary craft.</p>
      </div>
      <div>
        <h5>Explore</h5>
        <ul><li><a href="projects.html">Work</a></li><li><a href="services.html">Services</a></li><li><a href="about.html">Studio</a></li><li><a href="contact.html">Contact</a></li></ul>
      </div>
      <div>
        <h5>Disciplines</h5>
        <ul><li><a href="services.html">Architecture</a></li><li><a href="services.html">Interior Design</a></li><li><a href="services.html">Product Design</a></li><li><a href="vatrusa.html">Vatrusa Furniture</a></li></ul>
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
<script src="js/main.js"></script>
</body>
</html>`;

/* ---------- page contents ---------- */
const IMG = 'assets/projects/aashihbhai/';
const IMG2 = 'assets/projects/dilipbhai/';
const IMG3 = 'assets/projects/junebhai/';
const IMG4 = 'assets/projects/kalpeshbhai/';
const IMG5 = 'assets/projects/kamalbhai/';
const IMG6 = 'assets/projects/mukeshbhai/';

// Central list of real projects — add one entry (+ a detail page) to publish a new project.
const PROJECTS_LIST = [
  { name: 'Aashihbhai Residence',  file: 'aashihbhai-residence.html',  cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG}01-day.webp`,   feat: `${IMG}04-day-side.webp` },
  { name: 'Dilipbhai Residence',   file: 'dilipbhai-residence.html',   cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG2}01-day.jpg`,   feat: `${IMG2}02-night.webp` },
  { name: 'Junebhai Residence',    file: 'junebhai-residence.html',    cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG3}02-dusk.webp`, feat: `${IMG3}02-dusk.webp` },
  { name: 'Kalpeshbhai Residence', file: 'kalpeshbhai-residence.html', cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG4}01-night.webp`, feat: `${IMG4}01-night.webp` },
  { name: 'Kamalbhai Residence',   file: 'kamalbhai-residence.html',   cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG5}01-night.webp`, feat: `${IMG5}01-night.webp` },
  { name: 'Mukeshbhai Residence',  file: 'mukeshbhai-residence.html',  cat: 'architecture', meta: 'Residential · Surat, Gujarat', card: `${IMG6}01-night.webp`, feat: `${IMG6}01-night.webp` },
];
// "Forthcoming" entries (no photography yet)
const PROJECTS_SOON = [
  { name: 'Avadh Habitat', cat: 'interior', meta: 'Residential interior · 2,567 sq ft · Completed', label: 'Photography coming', file: '' },
  { name: 'Vatrusa',       cat: 'product',  meta: 'Custom furniture · Teak / Oak / Walnut',        label: 'The furniture line', file: 'vatrusa.html' },
];

function pcard(p, i) {
  const inner = `<div class="pcard__media"><img src="${p.card}" alt="${p.name}" /></div>
      <div class="pcard__body"><div><div class="pcard__title">${p.name}</div><div class="pcard__meta">${p.meta}</div></div><span class="pcard__cat">${p.cat.charAt(0).toUpperCase()+p.cat.slice(1)}</span></div>`;
  return `<a class="pcard reveal${i%2?' d1':''}" href="${p.file}" data-cat="${p.cat}">${inner}</a>`;
}
function pcardSoon(p, i) {
  const body = `<div class="pcard__media"><span>${p.label}</span></div>
      <div class="pcard__body"><div><div class="pcard__title">${p.name}</div><div class="pcard__meta">${p.meta}</div></div><span class="pcard__cat">${p.cat.charAt(0).toUpperCase()+p.cat.slice(1)}</span></div>`;
  return p.file
    ? `<a class="pcard pcard--soon reveal${i%2?' d1':''}" href="${p.file}" data-cat="${p.cat}">${body}</a>`
    : `<div class="pcard pcard--soon reveal${i%2?' d1':''}" data-cat="${p.cat}">${body}</div>`;
}

const home = `
<section class="hero">
  <div class="hero__media"><img src="${IMG}01-day.webp" alt="Aashihbhai Residence — brick and concrete façade" /></div>
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

<section class="section section--paper2">
  <div class="container">
    <div class="reveal" style="display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:40px">
      <div><p class="eyebrow">Selected work</p><h2 class="h-lg">Recent projects.</h2></div>
      <a href="projects.html" class="link-arrow">All projects ${ARROW}</a>
    </div>
    <a href="${PROJECTS_LIST[0].file}" class="feature reveal">
      <div class="feature__img"><img src="${PROJECTS_LIST[0].feat}" alt="${PROJECTS_LIST[0].name}" /></div>
      <div class="feature__meta">
        <span class="index-num">01</span>
        <h3 class="feature__title">${PROJECTS_LIST[0].name}</h3>
        <span class="tag">Architecture — Residential · Surat</span>
      </div>
    </a>
    <div class="pgrid" style="margin-top:clamp(28px,4vw,54px)">
      ${PROJECTS_LIST.slice(1).map(function (p, i) { return pcard(p, i); }).join('\n      ')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="reveal" style="margin-bottom:10px"><p class="eyebrow">What we do</p><h2 class="h-lg">Three disciplines, one studio.</h2></div>
    <div class="disc reveal">
      <div class="disc__row"><div class="disc__n">01</div><h3>Architecture</h3><div class="muted">Residential and commercial buildings that prioritise sustainability and function — aesthetically resolved and environmentally responsible, from concept to construction detail.</div></div>
      <div class="disc__row"><div class="disc__n">02</div><h3>Interior Design</h3><div class="muted">Interiors that blend aesthetic elegance with everyday function — material, light and detail composed to reflect how a space is truly lived in.</div></div>
      <div class="disc__row"><div class="disc__n">03</div><h3>Product Design</h3><div class="muted">Custom furniture under our label <em class="serif-em">Vatrusa</em> — each piece a harmony of utility, aesthetics and craft, integrated with the architecture around it.</div></div>
    </div>
    <div class="reveal" style="margin-top:40px"><a href="services.html" class="btn">Explore services ${ARROW}</a></div>
  </div>
</section>

<section class="hero" style="min-height:70svh">
  <div class="hero__media"><img src="${IMG}03-night.webp" alt="Aashihbhai Residence illuminated at night" /></div>
  <div class="container hero__inner" style="padding-bottom:clamp(56px,8vw,110px)">
    <p class="eyebrow no-rule">Our vision</p>
    <h2 style="font-size:clamp(30px,4.6vw,64px);max-width:20ch;font-weight:320">Every home a sanctuary of comfort, style and individuality.</h2>
  </div>
</section>

<section class="cta section">
  <div class="container reveal">
    <h2>Have a site, a brief, or just an idea?</h2>
    <p>We work with individuals, developers and institutions to shape spaces worth returning to. Tell us what you're planning.</p>
    <a href="contact.html" class="btn btn--ghost-light">Start a conversation ${ARROW}</a>
  </div>
</section>`;

const projects = `
<section class="section" style="padding-top:clamp(120px,15vh,190px);padding-bottom:0">
  <div class="container reveal" style="max-width:760px">
    <p class="eyebrow">Selected work</p>
    <h1 class="display" style="font-size:clamp(44px,7vw,96px)">Projects.</h1>
    <p class="lead" style="margin-top:22px">A selection of work across our three disciplines. Each project integrates utility, aesthetics, function and style into a single, considered whole.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="filters reveal">
      <button class="filter active" data-filter="all">All</button>
      <button class="filter" data-filter="architecture">Architecture</button>
      <button class="filter" data-filter="interior">Interior</button>
      <button class="filter" data-filter="product">Product</button>
    </div>
    <div class="pgrid">
      ${PROJECTS_LIST.map(function (p, i) { return pcard(p, i); }).join('\n      ')}
      ${PROJECTS_SOON.map(function (p, i) { return pcardSoon(p, PROJECTS_LIST.length + i); }).join('\n      ')}
    </div>
    <p class="muted reveal" style="margin-top:40px;font-size:15px">More projects are being added as photography is finalised. Have a specific project in mind? <a href="contact.html" class="link-arrow" style="font-size:12px">Get in touch ${ARROW}</a></p>
  </div>
</section>`;

const aashihbhai = `
<div class="pd-hero">
  <img src="${IMG}01-day.webp" alt="Aashihbhai Residence" />
  <div class="pd-hero__cap"><div class="container"><span class="tag" style="color:#e6b7a3">Architecture — Residential</span><h1>Aashihbhai Residence</h1></div></div>
</div>

<section class="section" style="padding-bottom:clamp(40px,6vw,70px)">
  <div class="container wrap-narrow reveal">
    <p class="eyebrow">The project</p>
    <p class="lead">A sculptural family residence where warm brick and board-formed concrete are stacked and shifted into a play of solid and void — terraces carved out, greenery threaded through, and circular apertures cut like lenses into the façade.</p>
    <p class="muted">The massing steps back as it rises, giving each level its own outdoor room. Vertical brick screens filter the Surat light and soften the concrete mass, while the round openings frame the sky and draw daylight deep into the plan. At night, concealed uplights wash the textures and the apertures glow from within.</p>
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
      <img src="${IMG}02-dusk.webp" alt="Aashihbhai Residence at dusk" />
      <figcaption>Dusk — the brick volumes warm as the interiors light up.</figcaption>
    </figure>
    <div class="pd-duo reveal d1" style="margin-bottom:clamp(14px,2vw,22px)">
      <figure class="pd-figure"><img src="${IMG}04-day-side.webp" alt="Aashihbhai Residence — daytime side view" /></figure>
      <figure class="pd-figure"><img src="${IMG}05-night-side.webp" alt="Aashihbhai Residence — side elevation with brick jaali at night" /></figure>
    </div>
    <figure class="pd-figure reveal">
      <img src="${IMG}03-night.webp" alt="Aashihbhai Residence illuminated at night" />
      <figcaption>Night — concealed lighting reveals the depth of the brick and the circular openings.</figcaption>
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

const dilipbhai = `
<div class="pd-hero">
  <img src="${IMG2}02-night.webp" alt="Dilipbhai Residence at night" />
  <div class="pd-hero__cap"><div class="container"><span class="tag" style="color:#cfe0c4">Architecture — Residential</span><h1>Dilipbhai Residence</h1></div></div>
</div>

<section class="section" style="padding-bottom:clamp(40px,6vw,70px)">
  <div class="container wrap-narrow reveal">
    <p class="eyebrow">The project</p>
    <p class="lead">A contemporary family villa in stone and sage — dressed-stone cladding and warm timber screens set against muted green stucco, with the studio's signature circular apertures cut through the façade at the entrance and upper levels.</p>
    <p class="muted">Interlocking volumes step and cantilever to carve out balconies and a raised garden terrace, while full-height glazing draws the greenery indoors. Board-marked and travertine surfaces give the house a quiet, tactile weight; at night, concealed uplights graze the stone and the round openings glow like lanterns from within.</p>
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
      <img src="${IMG2}01-day.jpg" alt="Dilipbhai Residence by day" />
      <figcaption>Daylight — the stone, timber and sage-green volumes in full detail.</figcaption>
    </figure>
    <div class="pd-duo reveal d1" style="margin-bottom:clamp(14px,2vw,22px)">
      <figure class="pd-figure"><img src="${IMG2}03-day-side.jpg" alt="Dilipbhai Residence — side view by day" /></figure>
      <figure class="pd-figure"><img src="${IMG2}04-night-side.webp" alt="Dilipbhai Residence — side elevation at night" /></figure>
    </div>
    <figure class="pd-figure reveal">
      <img src="${IMG2}05-day-front.jpg" alt="Dilipbhai Residence — street elevation" />
      <figcaption>Street elevation — the circular motif carried from gate to upper façade.</figcaption>
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

const services = `
<section class="section" style="padding-top:clamp(120px,15vh,190px);padding-bottom:clamp(30px,4vw,50px)">
  <div class="container reveal" style="max-width:820px">
    <p class="eyebrow">What we offer</p>
    <h1 class="display" style="font-size:clamp(44px,7vw,96px)">Services.</h1>
    <p class="lead" style="margin-top:22px">Three connected disciplines under one roof — architecture, interiors and furniture, integrated into a single, comprehensive approach to transforming living spaces.</p>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <div class="disc reveal">
      <div class="disc__row">
        <div class="disc__n">01</div>
        <div><h3>Architecture</h3></div>
        <div><p class="muted">We shape architectural landscapes across residential and commercial projects, prioritising sustainability and function so every building is both beautiful and environmentally responsible.</p>
          <ul class="disc__list"><li>Residential &amp; commercial buildings</li><li>Sustainable, eco-conscious design</li><li>Façade &amp; material detailing</li><li>Concept through construction</li></ul></div>
      </div>
      <div class="disc__row">
        <div class="disc__n">02</div>
        <div><h3>Interior Design</h3></div>
        <div><p class="muted">Our interiors curate exquisite spaces that blend aesthetic elegance with functionality, reflecting your vision and enhancing the way you live and work.</p>
          <ul class="disc__list"><li>Space planning &amp; layouts</li><li>Material, finish &amp; lighting design</li><li>Custom furniture &amp; joinery</li><li>Styling &amp; handover</li></ul></div>
      </div>
      <div class="disc__row">
        <div class="disc__n">03</div>
        <div><h3>Product &amp; Furniture</h3></div>
        <div><p class="muted">Under our label <em class="serif-em">Vatrusa</em>, each piece embodies a harmony of utility, aesthetics and style — crafted with a commitment to timeless design, durability and affordability.</p>
          <ul class="disc__list"><li>Custom, made-to-order furniture</li><li>Solid Teak, Oak &amp; Walnut</li><li>Responsibly sourced, ethically made</li><li>Integrated with architecture &amp; interiors</li></ul>
          <a href="vatrusa.html" class="link-arrow" style="margin-top:18px">Explore Vatrusa ${ARROW}</a></div>
      </div>
    </div>
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

const vatrusa = `
<section class="section" style="padding-top:clamp(120px,15vh,190px);padding-bottom:clamp(30px,4vw,50px)">
  <div class="container reveal" style="max-width:820px">
    <p class="eyebrow">Product design — Furniture</p>
    <h1 class="display" style="font-size:clamp(46px,8vw,110px)">Vatrusa</h1>
    <p class="lead" style="margin-top:22px">Our furniture line. Tvastra goes beyond conventional furniture — each Vatrusa piece embodies a harmony of utility, aesthetics, functionality and style, crafted with a commitment to timeless design, durability and affordability.</p>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <div class="pd-meta reveal">
      <div><div class="k">Materials</div><div class="v">Teak · Oak · Walnut</div></div>
      <div><div class="k">Made</div><div class="v">Custom, to order</div></div>
      <div><div class="k">Approach</div><div class="v">Responsibly sourced</div></div>
      <div><div class="k">By</div><div class="v">Tvastra Design</div></div>
    </div>
  </div>
</section>

<section class="section section--ink" style="padding-top:clamp(56px,7vw,90px)">
  <div class="container grid-2 top">
    <div class="reveal"><p class="eyebrow">The inspiration</p><h2 class="statement" style="color:var(--paper)">Where <em>water</em> meets oil.</h2></div>
    <div class="reveal d1">
      <p class="muted">Vatrusa draws from the captivating interplay observed as oil converges with water — the fluid, unrepeatable patterns that form where the two blend. That movement is translated into form, grain and line.</p>
      <p class="muted">Available in Teak, Oak and Walnut, each piece integrates seamlessly with the architecture and interiors around it — a comprehensive approach to transforming living spaces.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="reveal" style="max-width:620px;margin-bottom:clamp(36px,5vw,56px)"><p class="eyebrow">From idea to object</p><h2 class="h-lg">How each piece is made.</h2></div>
    <div class="steps reveal">
      <div class="step"><div class="step__n">01</div><h4>Sketch</h4><p>The concept begins in sketching — capturing the interplay of water and oil.</p></div>
      <div class="step"><div class="step__n">02</div><h4>Plan</h4><p>Rough planning refines proportion and detail into a direction.</p></div>
      <div class="step"><div class="step__n">03</div><h4>Finalise</h4><p>The idea is translated into a comprehensive final plan.</p></div>
      <div class="step"><div class="step__n">04</div><h4>Craft</h4><p>Production is set in motion with custom craftsmanship.</p></div>
    </div>
  </div>
</section>

<section class="cta section">
  <div class="container reveal">
    <h2>Bring Vatrusa into your space.</h2>
    <p>Enquire about custom furniture in Teak, Oak or Walnut, made to suit your interiors.</p>
    <a href="contact.html" class="btn btn--ghost-light">Enquire now ${ARROW}</a>
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
            <select id="type" name="type"><option>Architecture</option><option>Interior design</option><option>Product / Furniture (Vatrusa)</option><option>Residential</option><option>Commercial</option><option>Other</option></select>
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

/* ---------- assemble ---------- */
const PAGES = [
  { file: 'index.html',                id: 'home',      nav: 'index.html',    dark: true,  title: 'Tvastra Design LLP — Architecture, Interiors & Product Design', desc: 'Tvastra Design LLP — a 29-year architecture, interior and product design practice in Surat blending historical elegance with contemporary craft. Home of the Vatrusa furniture line.', content: home },
  { file: 'projects.html',             id: 'projects',  nav: 'projects.html', dark: false, title: 'Work — Tvastra Design LLP', desc: 'Selected architecture, interior and product design work by Tvastra Design LLP, including the Aashihbhai Residence.', content: projects },
  { file: 'aashihbhai-residence.html', id: 'project',   nav: 'projects.html', dark: true,  title: 'Aashihbhai Residence — Tvastra Design LLP', desc: 'Aashihbhai Residence — a sculptural brick-and-concrete family home in Surat by Tvastra Design LLP.', content: aashihbhai },
  { file: 'dilipbhai-residence.html',  id: 'project2',  nav: 'projects.html', dark: true,  title: 'Dilipbhai Residence — Tvastra Design LLP', desc: 'Dilipbhai Residence — a contemporary stone-and-sage family villa in Surat by Tvastra Design LLP.', content: dilipbhai },
  { file: 'junebhai-residence.html',   id: 'project3',  nav: 'projects.html', dark: true,  title: 'Junebhai Residence — Tvastra Design LLP', desc: 'Junebhai Residence — a green, terraced residence with cascading planting and a brick-jaali screen in Surat by Tvastra Design LLP.', content: junebhai },
  { file: 'kalpeshbhai-residence.html', id: 'project4', nav: 'projects.html', dark: true,  title: 'Kalpeshbhai Residence — Tvastra Design LLP', desc: 'Kalpeshbhai Residence — a terracotta-and-concrete family home with vertical gardens and timber-jaali screens in Surat by Tvastra Design LLP.', content: kalpeshbhai },
  { file: 'kamalbhai-residence.html',   id: 'project5', nav: 'projects.html', dark: true,  title: 'Kamalbhai Residence — Tvastra Design LLP', desc: 'Kamalbhai Residence — a concrete-and-timber family home with planted balconies and cascading greenery in Surat by Tvastra Design LLP.', content: kamalbhai },
  { file: 'mukeshbhai-residence.html',  id: 'project6', nav: 'projects.html', dark: true,  title: 'Mukeshbhai Residence — Tvastra Design LLP', desc: 'Mukeshbhai Residence — a crisp white-and-sage cubic villa with a glowing exposed-brick jaali in Surat by Tvastra Design LLP.', content: mukeshbhai },
  { file: 'services.html',             id: 'services',  nav: 'services.html', dark: false, title: 'Services — Tvastra Design LLP', desc: 'Architecture, interior design and product design services by Tvastra Design LLP.', content: services },
  { file: 'vatrusa.html',              id: 'vatrusa',   nav: 'services.html', dark: false, title: 'Vatrusa — Furniture by Tvastra Design LLP', desc: 'Vatrusa is the Tvastra Design LLP furniture line — custom pieces in Teak, Oak and Walnut, inspired by the interplay of water and oil.', content: vatrusa },
  { file: 'about.html',                id: 'about',     nav: 'about.html',    dark: false, title: 'Studio — Tvastra Design LLP', desc: 'About Tvastra Design LLP — a 29-year architecture, interior and product design practice; our philosophy, vision and principles.', content: about },
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
    content = content.replace(/href="([a-z0-9-]+\.html)"/g, (m,f) => `href="${hmap[f] || ('#'+f)}"`);
    return content;
  }

  let sections = '';
  for (const p of PAGES) sections += `\n<div class="page" id="${p.id}" data-dark="${p.dark?1:0}">\n${prep(p.content)}\n</div>\n`;

  const navLinks = [['home','Home'],['projects','Work'],['services','Services'],['about','Studio'],['contact','Contact']]
    .map(n => `<li><a href="#${n[0]}" data-page="${n[0]}">${n[1]}</a></li>`).join('');
  const spaHeader = `
<header class="site-header" id="hdr">
  <div class="container nav">
    <a class="brand" href="#home" data-page="home"><span class="name">Tvastra</span><span class="sub">Design LLP</span></a>
    <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>
    <ul class="nav-links">${navLinks}</ul>
  </div>
</header>`;
  const spaFooter = prep(FOOTER.replace('<script src="js/main.js"></script>','').replace('</body>','').replace('</html>',''));

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
