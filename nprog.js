/* ─── Page transition progress bar (nprog-style) ─── */
(function () {
  const BAR_ID = "__petr_nprog";
  const DURATION_IN  = 280;   // quick ramp on click
  const INITIAL      = 0.10;  // small instant kick so the bar is visible immediately
  const STALL_AT     = 0.85;  // stall position while waiting for next page
  const STALL_MS     = 1200;  // slow creep from stall to 0.95 while waiting
  const DONE_MS      = 260;   // animate to 100% on arrival
  const FADE_MS      = 280;   // then fade out

  function ensureBar() {
    let el = document.getElementById(BAR_ID);
    if (el) return el;
    el = document.createElement("div");
    el.id = BAR_ID;
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
    // Force reflow so initial transforms animate properly
    void el.offsetWidth;
    return el;
  }

  function setProgress(el, p, durMs, easing) {
    el.style.transition = `transform ${durMs}ms ${easing || "cubic-bezier(.2,.8,.2,1)"}, opacity ${FADE_MS}ms linear`;
    el.style.transform  = `scaleX(${p})`;
  }

  function start() {
    const el = ensureBar();
    el.style.opacity = "1";
    // Instantly jump to small initial width so the bar is visible right away
    setProgress(el, INITIAL, 0, "linear");
    void el.offsetWidth;
    // Then quickly ramp to stall position
    setProgress(el, STALL_AT, DURATION_IN);
    // slow creep from STALL_AT → 0.95
    setTimeout(() => {
      const cur = document.getElementById(BAR_ID);
      if (cur) setProgress(cur, 0.95, STALL_MS, "cubic-bezier(.2,.6,.2,1)");
    }, DURATION_IN + 20);
  }

  function finishAndFade() {
    const el = ensureBar();
    el.style.opacity = "1";
    setProgress(el, 1, DONE_MS, "cubic-bezier(.2,.8,.2,1)");
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => { el.remove(); }, FADE_MS + 50);
    }, DONE_MS + 30);
  }

  // On arrival: if we navigated from an internal link, resume → finish
  function boot() {
    let navigated = false;
    try { navigated = sessionStorage.getItem("__petr_navigating") === "1"; } catch(e) {}
    if (navigated) {
      try { sessionStorage.removeItem("__petr_navigating"); } catch(e) {}
      const el = ensureBar();
      el.style.opacity = "1";
      // Start already high (give the impression of continuity)
      setProgress(el, STALL_AT, 0, "linear");
      void el.offsetWidth;
      // Then complete
      requestAnimationFrame(finishAndFade);
    }
  }

  // Intercept internal link clicks to kick off the progress bar
  function isInternalAnchor(a) {
    if (!a || a.tagName !== "A") return false;
    const href = a.getAttribute("href");
    if (!href) return false;
    if (a.target && a.target !== "" && a.target !== "_self") return false;
    if (href.startsWith("#")) return false;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;
    // Absolute URL on same origin, or relative
    try {
      const url = new URL(href, location.href);
      if (url.origin !== location.origin) return false;
      // same page? skip
      if (url.pathname === location.pathname && url.search === location.search) return false;
      return true;
    } catch(e) { return false; }
  }

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    let t = e.target;
    while (t && t !== document.body && t.tagName !== "A") t = t.parentElement;
    if (!isInternalAnchor(t)) return;
    try { sessionStorage.setItem("__petr_navigating", "1"); } catch(e) {}
    start();
  }, true);

  // Back/forward cache: treat BFCache restore as arrival too
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      const el = document.getElementById(BAR_ID);
      if (el) { el.style.opacity = "0"; setTimeout(() => el.remove(), FADE_MS); }
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
