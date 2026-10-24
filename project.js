/* ────────────────────────────────────────────────
   Shared scripts for all internal project pages.
   Renders the Header + Footer, wires up theme &
   language toggles. Each page declares window.PAGE
   with its own title/subtitle/meta (EN + RU).
   ──────────────────────────────────────────────── */

(function () {
  // ───── Metrica goals ─────
  function __goal(n){ if (typeof ym === 'function') ym(108676934, 'reachGoal', n); }
  document.addEventListener('click', function(e){
    var el = e.target;
    while (el && el !== document.body) {
      if (el.dataset && el.dataset.goal) { __goal(el.dataset.goal); break; }
      el = el.parentElement;
    }
  }, true);
  // ── Inherit theme/accent/serif from Portfolio's Tweaks (set on <html> in pre-boot) ──
  try {
    const saved = JSON.parse(localStorage.getItem("petr_tweaks") || "null");
    if (saved) {
      if (saved.theme)  document.documentElement.dataset.theme  = saved.theme;
      if (saved.accent) document.documentElement.dataset.accent = saved.accent;
      if (saved.serif)  document.documentElement.dataset.serif  = saved.serif;
    } else {
      document.documentElement.dataset.theme  = "light";
      document.documentElement.dataset.accent = "ink";
    }
  } catch(e) {}

  const LOGO_SVG = `<svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Petr Petryaev"><path d="M16.5625 36.7241V27.8342C16.5625 27.6496 16.7121 27.5 16.8967 27.5H26.0937C30.1496 27.5 33.4375 24.2121 33.4375 20.1562C33.4375 16.1004 30.1496 12.8125 26.0937 12.8125H17.7444C16.9876 12.8125 16.2619 12.5119 15.7268 11.9768L9.40403 5.65403C9.39332 5.64332 9.4009 5.625 9.41605 5.625H18.75C22.8921 5.625 26.25 8.98286 26.25 13.125C26.25 17.2671 22.8921 20.625 18.75 20.625H9.70916C9.52461 20.625 9.375 20.7746 9.375 20.9592L9.375 28.9108C9.375 29.4081 9.57254 29.885 9.92417 30.2367L16.4558 36.7683C16.4952 36.8077 16.5625 36.7798 16.5625 36.7241Z" stroke="currentColor" stroke-width="3.125"/></svg>`;

  const SUN_SVG = `<svg class="ic ic-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
  const MOON_SVG = `<svg class="ic ic-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`;

  const HEADER_HTML = `
    <div class="wrap inner">
      <a href="Portfolio.html" class="brand"><span class="mark">${LOGO_SVG}</span></a>
      <nav class="site">
        <a href="mailto:petryaev.p@gmail.com" class="cta" id="cta-btn" data-goal="cta_contact">Get in touch ↗</a>
        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme" title="Toggle theme">
          ${SUN_SVG}${MOON_SVG}
        </button>
        <span class="lang"><button class="lng" id="lang-btn" aria-label="Switch language">RU</button></span>
      </nav>
    </div>`;

  const FOOTER_HTML = `
    <div class="wrap">
      <div class="links">
        <a href="https://www.linkedin.com/in/peter-petryaev-818532b3" target="_blank" rel="noopener" data-goal="social_linkedin">LinkedIn</a>
        <a href="https://dribbble.com/petrPetr" target="_blank" rel="noopener" data-goal="social_dribbble">Dribbble</a>
        <a href="https://t.me/petr_petryaev" target="_blank" rel="noopener" data-goal="social_telegram">Telegram</a>
        <a href="mailto:petryaev.p@gmail.com" data-goal="social_email">petryaev.p@gmail.com</a>
      </div>
      <div class="copy">© 2026 · Petr Petryaev</div>
    </div>`;

  function renderHero() {
    const host = document.getElementById("p-hero");
    if (!host) return;
    const title = (window.PAGE && window.PAGE.en && window.PAGE.en.title) || document.title;
    const date  = (window.PAGE && window.PAGE.en && window.PAGE.en.date) || "";
    const meta  = (window.PAGE && window.PAGE.en && window.PAGE.en.meta) || "";

    // Split meta: "2025 · Mobile · Health · Product Design"
    // → year / industry (middle parts) / role (last part)
    const parts = meta.split(" · ").map(s => s.trim()).filter(Boolean);
    const year     = parts[0] || "";
    const role     = parts.length >= 2 ? parts[parts.length - 1] : "";
    const industry = parts.length >= 3 ? parts.slice(1, -1).join(" · ") : (parts[1] || "");

    host.innerHTML = `
      <h1 class="p-title">${title}</h1>
      <div class="p-hero-meta">
        <div>
          <div class="label" data-i18n-kicker="year">Year</div>
          <div class="val"><strong>${year}</strong></div>
        </div>
        <div>
          <div class="label" data-i18n-kicker="industry">Industry</div>
          <div class="val"><strong>${industry}</strong></div>
        </div>
        <div>
          <div class="label" data-i18n-kicker="role">Role</div>
          <div class="val"><strong>${role}</strong></div>
        </div>
      </div>
    `;
  }

  // ── Prev / Next navigation ──
  // Order matches the Works index on Portfolio.html
  const PROJECTS_ORDER = [
    { slug: "b2broker",          en: "B2broker",          ru: "B2broker" },
    { slug: "stepafter",         en: "Stepafter",         ru: "Stepafter" },
    { slug: "flowhealth-web",    en: "FlowHealth Web",    ru: "FlowHealth Web" },
    { slug: "flowhealth-mobile", en: "FlowHealth Mobile", ru: "FlowHealth Mobile" },
    { slug: "fh-collector",      en: "FH Collector",      ru: "FH Collector" },
    { slug: "mstv-ios",          en: "MSTV iOS App",      ru: "MSTV iOS App" },
    { slug: "mstv-tv",           en: "MSTV TV",           ru: "MSTV TV" },
    { slug: "motorsport-live",   en: "Motorsport Live",   ru: "Motorsport Live" },
    { slug: "domyland",          en: "Domyland",          ru: "Domyland" },
    { slug: "nexar",             en: "Nexar",             ru: "Nexar" },
    { slug: "ultracast",         en: "Ultracast",         ru: "Ultracast" },
    { slug: "about-the-fit",     en: "About The Fit",     ru: "About The Fit" },
    { slug: "allie-go",          en: "Allie Go",          ru: "Allie Go" },
    { slug: "allie-home",        en: "Allie Home",        ru: "Allie Home" },
    { slug: "ic-mycloud",        en: "IC MyCloud",        ru: "IC MyCloud" },
    { slug: "etrustie",          en: "eTrustie",          ru: "eTrustie" },
    { slug: "caishen",           en: "Caishen",           ru: "Caishen" },
  ];
  function currentSlug() {
    const m = location.pathname.match(/\/([^\/]+)\.html?$/i);
    return m ? m[1] : "";
  }
  function renderProjectNav() {
    const article = document.querySelector("main.article");
    if (!article) return;
    // don't double-inject
    if (article.querySelector(".p-nav")) return;

    const slug = currentSlug();
    const idx = PROJECTS_ORDER.findIndex(p => p.slug === slug);
    if (idx === -1) return;
    const prev = idx > 0 ? PROJECTS_ORDER[idx - 1] : null;
    const next = idx < PROJECTS_ORDER.length - 1 ? PROJECTS_ORDER[idx + 1] : null;

    const prevKicker = { en: "Previous", ru: "Предыдущий" };
    const nextKicker = { en: "Next",     ru: "Следующий" };

    const nav = document.createElement("nav");
    nav.className = "p-nav";
    nav.innerHTML = `
      ${prev ? `
        <a class="prev" href="${prev.slug}.html">
          <div class="p-nav-kicker" data-i18n-en="${prevKicker.en}" data-i18n-ru="${prevKicker.ru}">${prevKicker.en}</div>
          <div class="p-nav-title" data-i18n-en="${prev.en}" data-i18n-ru="${prev.ru}">${prev.en}</div>
        </a>
      ` : `<div></div>`}
      ${next ? `
        <a class="next" href="${next.slug}.html">
          <div class="p-nav-kicker" data-i18n-en="${nextKicker.en}" data-i18n-ru="${nextKicker.ru}">${nextKicker.en}</div>
          <div class="p-nav-title" data-i18n-en="${next.en}" data-i18n-ru="${next.ru}">${next.en}</div>
        </a>
      ` : `<div></div>`}
    `;
    article.appendChild(nav);
  }

  // Render header / footer shells
  document.addEventListener("DOMContentLoaded", () => {
    const h = document.querySelector("header.site");
    const f = document.querySelector("footer.site");
    if (h) h.innerHTML = HEADER_HTML;
    if (f) f.innerHTML = FOOTER_HTML;
    renderHero();
    renderProjectNav();
    bind();
    applyLang(curLang);
    __goal("case_view");
  });

  // ── Theme toggle ──
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    try {
      const saved = JSON.parse(localStorage.getItem("petr_tweaks") || "{}");
      saved.theme = t;
      localStorage.setItem("petr_tweaks", JSON.stringify(saved));
    } catch(e) {}
  }

  // ── Lang toggle ──
  let curLang = localStorage.getItem("petr_lang") || "en";
  function applyLang(l) {
    curLang = l;
    localStorage.setItem("petr_lang", l);
    document.documentElement.lang = l;
    const d = (window.PAGE && window.PAGE[l]) || {};
    const tEl = document.querySelector(".p-title");  if (tEl && d.title) tEl.textContent = d.title;

    // Hero meta (3-col grid): year | industry | role
    const heroMeta = document.querySelector(".p-hero-meta");
    if (heroMeta && d.meta) {
      const parts = d.meta.split(" · ").map(s => s.trim()).filter(Boolean);
      const year     = parts[0] || "";
      const role     = parts.length >= 2 ? parts[parts.length - 1] : "";
      const industry = parts.length >= 3 ? parts.slice(1, -1).join(" · ") : (parts[1] || "");
      const kickers = l === "ru"
        ? { year: "Год",  industry: "Индустрия", role: "Роль" }
        : { year: "Year", industry: "Industry",  role: "Role" };
      heroMeta.innerHTML = `
        <div>
          <div class="label">${kickers.year}</div>
          <div class="val"><strong>${year}</strong></div>
        </div>
        <div>
          <div class="label">${kickers.industry}</div>
          <div class="val"><strong>${industry}</strong></div>
        </div>
        <div>
          <div class="label">${kickers.role}</div>
          <div class="val"><strong>${role}</strong></div>
        </div>
      `;
    }
    const cta = document.getElementById("cta-btn");
    if (cta) cta.textContent = l === "en" ? "Get in touch ↗" : "Связаться ↗";
    const btn = document.getElementById("lang-btn");
    if (btn) btn.textContent = l === "en" ? "EN" : "RU";
    if (d.title) document.title = `${d.title} · Petr Petryaev`;

    // Body-scoped i18n: swap text on any element with data-i18n-<lang>
    document.querySelectorAll("[data-i18n-en]").forEach(el => {
      const other = l === "en" ? "en" : "ru";
      const val = el.getAttribute(`data-i18n-${other}`);
      if (val !== null) el.innerHTML = val;
    });
  }

  function bind() {
    const tt = document.getElementById("theme-toggle");
    if (tt) tt.addEventListener("click", () => {
      const cur = document.documentElement.dataset.theme || "light";
      applyTheme(cur === "dark" ? "light" : "dark"); __goal("theme_switch");
    });
    const lb = document.getElementById("lang-btn");
    if (lb) lb.addEventListener("click", () => { applyLang(curLang === "en" ? "ru" : "en"); __goal("lang_switch"); });
  }
})();
