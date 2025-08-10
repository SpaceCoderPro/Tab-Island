// userChrome.js - Zen Tab Islands helper (minimal, copy to chrome/userChrome.js)
//
// This runs in chrome privileged context (userChrome). It adds classes to native tab elements
// to trigger CSS animations above. It's intentionally small and avoids heavy mutation logic.
// It uses the gBrowser tab events available in Firefox-based builds like Zen.

(function () {
  if (!("gBrowser" in window)) return;
  const paletteLen = 5;

  function getTabElFromTab(tab) {
    // tab is a XUL/tab object in chrome context
    try { return gBrowser.tabContainer.querySelector(`.tabbrowser-tab[linkedpanel="${tab.linkedPanel || tab.getAttribute('linkedpanel') || ''}"]`) || gBrowser.getTabForBrowser(tab.linkedBrowser); }
    catch (e) { return gBrowser.getTabForBrowser(tab.linkedBrowser); }
  }

  // safe helper to pick a color index (simple hash)
  function colorIndexForOpener(openerTab) {
    try {
      const id = openerTab && ((openerTab._tPos || openerTab.pos) || (openerTab.getAttribute && openerTab.getAttribute('id')) || Date.now());
      const n = String(id).split('').reduce((s,c)=>s+c.charCodeAt(0), 0);
      return n % paletteLen;
    } catch (e) { return Math.floor(Math.random()*paletteLen); }
  }

  // When a new tab opens, browserTabAdded event fires — we also watch tab container's TabOpen
  gBrowser.tabContainer.addEventListener("TabOpen", (ev) => {
    try {
      const newTab = ev.target;
      // add falling animation class
      newTab.classList.add("zti-falling");
      // remove after animation completes (match CSS var)
      setTimeout(() => newTab.classList.remove("zti-falling"), 600);

      // auto-group heuristic: if opener is available (openerTabId equivalent)
      // NOTE: in chrome context we can check newTab.linkedBrowser.opener or the event's detail if present
      let opener = null;
      try { opener = newTab.linkedBrowser && newTab.linkedBrowser.opener; } catch(e){}
      if (!opener && gBrowser.selectedTab) opener = gBrowser.selectedTab; // fallback: current tab

      if (opener) {
        // mark opener as group (give it an index) and highlight both opener & new tab
        const idx = colorIndexForOpener(opener);
        opener.classList.add("zti-group");
        opener.dataset.ztiColorIndex = idx;

        // also mark the new tab as part of that island
        newTab.classList.add("zti-group");
        newTab.dataset.ztiColorIndex = idx;

        // expand visual on opener to show group state for a short while
        opener.classList.add("zti-group-expanded");
        setTimeout(()=> opener.classList.remove("zti-group-expanded"), 1600);
      }
    } catch (e) {
      // quiet fail
      console.error("ZTI: TabOpen handler error", e);
    }
  }, { passive: true, capture: true });

  // When a tab is closed, clean dataset/classes
  gBrowser.tabContainer.addEventListener("TabClose", (ev) => {
    try {
      const closedTab = ev.target;
      closedTab.classList.remove("zti-falling", "zti-group", "zti-group-expanded");
      delete closedTab.dataset.ztiColorIndex;
    } catch (e) {}
  }, true);

  // Optional: on startup, tag existing tabs heuristically (by domain grouping) — small, safe pass
  setTimeout(() => {
    try {
      for (let t of gBrowser.tabs) {
        // quick domain-based bucket for persistent look
        try {
          let url = t.linkedBrowser.currentURI && t.linkedBrowser.currentURI.spec;
          if (!url) continue;
          const host = new URL(url).hostname.replace(/\W/g,'');
          const idx = (host.split('').reduce((s,c)=>s+c.charCodeAt(0),0) % paletteLen);
          t.classList.add("zti-group");
          t.dataset.ztiColorIndex = idx;
        } catch (e) { /* ignore */ }
      }
    } catch (ee) {}
  }, 1200);

})();
