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
