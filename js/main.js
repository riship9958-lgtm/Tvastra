/* Tvastra Design LLP — interactions (v2) */
(function () {
  "use strict";

  // ---- Header: solid on scroll (only on pages with a dark hero) ----
  var header = document.querySelector(".site-header");
  if (header && !header.classList.contains("on-light")) {
    var onScroll = function () {
      if (window.scrollY > 40) header.classList.add("solid");
      else header.classList.remove("solid");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---- Mobile nav ----
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // ---- Reveal on scroll ----
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // ---- Project filtering ----
  var filters = document.querySelectorAll(".filter");
  var cards = document.querySelectorAll(".pgrid .pcard");
  if (filters.length && cards.length) {
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filters.forEach(function (f) { f.classList.remove("active"); });
        btn.classList.add("active");
        var cat = btn.getAttribute("data-filter");
        cards.forEach(function (card) {
          var show = cat === "all" || card.getAttribute("data-cat") === cat;
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  // ---- Slideshow / carousel ----
  window.initSlideshows = function (root) {
    var scope = root || document;
    scope.querySelectorAll(".slideshow").forEach(function (ss) {
      if (ss.__init) return; ss.__init = true;
      var slides = [].slice.call(ss.querySelectorAll(".slide"));
      if (!slides.length) return;
      var dotsWrap = ss.querySelector(".slideshow__dots");
      var capEl = ss.querySelector(".slideshow__cap");
      var curEl = ss.querySelector(".slideshow__counter .cur");
      var idx = 0;
      slides.forEach(function (s, i) { if (s.classList.contains("is-active")) idx = i; });
      var dots = slides.map(function (_, i) {
        var b = document.createElement("button");
        b.className = "dot" + (i === idx ? " is-active" : "");
        b.setAttribute("role", "tab");
        b.setAttribute("aria-label", "Slide " + (i + 1));
        b.addEventListener("click", function () { go(i, true); });
        if (dotsWrap) dotsWrap.appendChild(b);
        return b;
      });
      function go(n, user) {
        idx = (n + slides.length) % slides.length;
        slides.forEach(function (s, i) { s.classList.toggle("is-active", i === idx); });
        dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
        if (curEl) curEl.textContent = ("0" + (idx + 1)).slice(-2);
        if (capEl) capEl.textContent = slides[idx].getAttribute("data-cap") || "";
        if (user) restart();
      }
      var prev = ss.querySelector(".slideshow__nav--prev");
      var next = ss.querySelector(".slideshow__nav--next");
      if (prev) prev.addEventListener("click", function () { go(idx - 1, true); });
      if (next) next.addEventListener("click", function () { go(idx + 1, true); });
      var delay = parseInt(ss.getAttribute("data-autoplay"), 10) || 0, timer = null;
      function restart() { if (!delay) return; clearInterval(timer); timer = setInterval(function () { go(idx + 1); }, delay); }
      ss.addEventListener("mouseenter", function () { clearInterval(timer); });
      ss.addEventListener("mouseleave", restart);
      // touch swipe
      var x0 = null;
      ss.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      ss.addEventListener("touchend", function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1), true);
        x0 = null;
      }, { passive: true });
      restart();
    });
  };
  window.initSlideshows();

  // ---- Gospels: inline players, only one at a time ----
  var gclips = [].slice.call(document.querySelectorAll(".gclip__video"));
  gclips.forEach(function (v) {
    v.addEventListener("play", function () {
      gclips.forEach(function (o) { if (o !== v) o.pause(); });
    });
  });

  // ---- Smooth image reveal (fade lazy images in instead of a hard pop) ----
  (function () {
    var imgs = [].slice.call(document.querySelectorAll('img[loading="lazy"]'));
    imgs.forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) return; // already here, no fade needed
      img.classList.add("img-fade");
      var show = function () { img.classList.add("img-ready"); };
      img.addEventListener("load", show, { once: true });
      img.addEventListener("error", show, { once: true });
    });
  })();

  // ---- Instant navigation: prerender (or prefetch) the next page on hover ----
  (function () {
    function internal(a) {
      if (!a || a.origin !== location.origin) return false;
      if (a.hasAttribute("download") || a.target === "_blank") return false;
      var h = a.getAttribute("href") || "";
      if (!h || h.charAt(0) === "#" || /^(mailto:|tel:)/i.test(h)) return false;
      return a.pathname === "/" || /\.html$/.test(a.pathname);
    }

    // Chrome/Edge: prerender the full page (HTML + images) on moderate hover.
    if (typeof HTMLScriptElement !== "undefined" &&
        HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules")) {
      var s = document.createElement("script");
      s.type = "speculationrules";
      s.textContent = JSON.stringify({
        prerender: [{
          source: "document",
          where: { and: [
            { href_matches: "/*" },
            { not: { selector_matches: "[download], [target=_blank], .no-prerender" } }
          ] },
          eagerness: "moderate"
        }]
      });
      document.body.appendChild(s);
      return;
    }

    // Everyone else: warm the next page's HTML on hover / touch.
    var done = {};
    function warm(e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || !internal(a) || done[a.href]) return;
      done[a.href] = 1;
      var l = document.createElement("link");
      l.rel = "prefetch"; l.as = "document"; l.href = a.href;
      document.head.appendChild(l);
    }
    document.addEventListener("pointerover", warm, { passive: true });
    document.addEventListener("touchstart", warm, { passive: true });
  })();

  // ---- Enlarge grid images: first hover (or tap) opens the lightbox, then navigate with arrows ----
  (function () {
    var grids = [].slice.call(document.querySelectorAll('.pd-full-grid--zoom'));
    if (!grids.length) return;
    var canHover = !window.matchMedia || window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    var ov = document.createElement('div');
    ov.className = 'imgzoom';
    ov.setAttribute('aria-hidden', 'true');
    var cap = document.createElement('div'); cap.className = 'imgzoom__cap';
    var big = document.createElement('img'); big.alt = '';
    var prev = document.createElement('button');
    prev.type = 'button'; prev.className = 'imgzoom__nav imgzoom__nav--prev'; prev.setAttribute('aria-label', 'Previous image');
    prev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 5l-7 7 7 7"/></svg>';
    var next = document.createElement('button');
    next.type = 'button'; next.className = 'imgzoom__nav imgzoom__nav--next'; next.setAttribute('aria-label', 'Next image');
    next.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 5l7 7-7 7"/></svg>';
    var closeb = document.createElement('button');
    closeb.type = 'button'; closeb.className = 'imgzoom__close'; closeb.setAttribute('aria-label', 'Close');
    closeb.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    ov.appendChild(cap); ov.appendChild(big); ov.appendChild(prev); ov.appendChild(next); ov.appendChild(closeb);
    document.body.appendChild(ov);

    var curImgs = [], curIdx = 0, curGrid = null;

    function render() {
      var img = curImgs[curIdx];
      if (!img) return;
      var withCap = curGrid && curGrid.classList.contains('pd-full-grid--zoomcap');
      var fig = img.closest('.pd-full');
      var figcap = fig && fig.querySelector('.pd-full__cap');
      big.src = img.currentSrc || img.src;
      big.alt = img.alt || '';
      if (withCap && figcap) { cap.textContent = figcap.textContent; ov.classList.add('has-cap'); }
      else { cap.textContent = ''; ov.classList.remove('has-cap'); }
      var multi = curImgs.length > 1;
      prev.hidden = !multi; next.hidden = !multi;
    }
    function open(grid, img) {
      curGrid = grid;
      curImgs = [].slice.call(grid.querySelectorAll('.pd-full img'));
      curIdx = curImgs.indexOf(img); if (curIdx < 0) curIdx = 0;
      ov.classList.toggle('pop', !!(grid && grid.classList.contains('pd-full-grid--zoompop')));
      render();
      ov.classList.add('on');
    }
    function close() { ov.classList.remove('on'); }
    function step(d) { if (curImgs.length < 2) return; curIdx = (curIdx + d + curImgs.length) % curImgs.length; render(); }

    grids.forEach(function (grid) {
      [].slice.call(grid.querySelectorAll('.pd-full img')).forEach(function (img) {
        // First hover initiates the zoom (desktop); tap initiates it on touchscreens.
        if (canHover) img.addEventListener('mouseenter', function () { if (!ov.classList.contains('on')) open(grid, img); });
        img.addEventListener('click', function (e) { e.preventDefault(); open(grid, img); });
      });
    });

    // Once open, arrows navigate; backdrop / X / Esc close.
    prev.addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
    next.addEventListener('click', function (e) { e.stopPropagation(); step(1); });
    closeb.addEventListener('click', function (e) { e.stopPropagation(); close(); });
    big.addEventListener('click', function (e) { e.stopPropagation(); });
    cap.addEventListener('click', function (e) { e.stopPropagation(); });
    ov.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (!ov.classList.contains('on')) return;
      if (e.key === 'Escape' || e.keyCode === 27) close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
  })();

  // ---- Interactive elevation viewer: rotate + lights (night) ----
  (function () {
    var m = document.querySelector('.model3d');
    if (!m) return;
    var img = m.querySelector('.model3d__img');
    var viewEl = m.querySelector('.model3d__view');
    var lights = m.querySelector('.model3d__lights');
    var frames;
    try { frames = JSON.parse(m.getAttribute('data-frames') || '[]'); } catch (e) { frames = []; }
    if (!frames.length) return;
    var i = 0, night = false;
    function render() {
      var f = frames[i];
      img.src = night ? f.night : f.day;
      if (viewEl) viewEl.textContent = f.label || '';
    }
    function rotate(dir) { i = (i + dir + frames.length) % frames.length; render(); }
    var prev = m.querySelector('.model3d__prev'), next = m.querySelector('.model3d__next');
    if (prev) prev.addEventListener('click', function () { rotate(-1); });
    if (next) next.addEventListener('click', function () { rotate(1); });
    if (lights) lights.addEventListener('click', function () {
      night = !night;
      m.classList.toggle('is-night', night);
      document.body.classList.toggle('night-mode', night);
      lights.setAttribute('aria-pressed', night ? 'true' : 'false');
      var lbl = lights.querySelector('.model3d__lights-label');
      if (lbl) lbl.textContent = night ? 'Lights off' : 'Lights on';
      render();
    });
    // drag to rotate
    var stage = m.querySelector('.model3d__stage');
    var x0 = null;
    if (stage) {
      stage.addEventListener('pointerdown', function (e) { x0 = e.clientX; m.classList.add('grabbing'); });
      window.addEventListener('pointerup', function () { x0 = null; m.classList.remove('grabbing'); });
      stage.addEventListener('pointermove', function (e) {
        if (x0 === null) return;
        var dx = e.clientX - x0;
        if (Math.abs(dx) > 44) { rotate(dx < 0 ? 1 : -1); x0 = e.clientX; }
      });
      stage.addEventListener('dragstart', function (e) { e.preventDefault(); });
    }
    render();
  })();

  // ---- Standalone Lights / night-mode toggle ----
  (function () {
    var btns = [].slice.call(document.querySelectorAll('.nightbtn'));
    if (!btns.length) return;
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var on = !document.body.classList.contains('night-mode');
        document.body.classList.toggle('night-mode', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        var l = btn.querySelector('.nightbtn__label');
        if (l) l.textContent = on ? 'Lights off' : 'Lights on';
        // swap elevation images between day and night
        [].forEach.call(document.querySelectorAll('.pd-full-grid--elev img[data-night]'), function (im) {
          var t = on ? im.getAttribute('data-night') : im.getAttribute('data-day');
          if (t) im.src = t;
        });
      });
    });
  })();

  // ---- Contact form (front-end demo) ----
  var form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector(".form-status");
      if (note) note.textContent = "Thank you — your enquiry has reached us. We'll respond within a couple of working days.";
      form.reset();
    });
  }
})();
