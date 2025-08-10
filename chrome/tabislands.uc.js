// Tab Islands Shelf for Zen - tabislands.uc.js
// - Standalone (does NOT modify Sine files)
// - Waits for Zen UI to be ready
// - Auto-create islands when a tab opens a link (opener present)
// - Islands expanded by default, manually collapsible
// - Side-by-side shelf layout with falling animation
// - Place in profile/chrome/ and ensure userChrome.js loader runs .uc.js files

(function () {
  "use strict";

  // Wait for Zen's tab system to be ready
  function zenReady() {
    return window.gBrowserInit && gBrowserInit.delayedStartupFinished && ("gBrowser" in window);
  }

  function bootWhenReady() {
    if (!zenReady()) {
      setTimeout(bootWhenReady, 150);
      return;
    }
    try {
      initTabIslands();
    } catch (e) {
      console.error("TabIslands init error:", e);
    }
  }
  setTimeout(bootWhenReady, 150);

  // Main
  function initTabIslands() {
    // Prevent double init
    if (document.querySelector(".tab-island-shelf-root")) return;

    // Find a safe place in the sidebar — respect Sine: append into #sidebar-box
    const sidebar = document.querySelector("#sidebar-box") || document.querySelector("#sidebar");
    if (!sidebar) {
      console.warn("TabIslands: sidebar container not found, aborting.");
      return;
    }

    // Create root container
    const root = document.createElement("div");
    root.className = "tab-island-shelf-root";
    // Ensure we append near top but not replace anything
    // Append at end so Sine content isn't replaced
    sidebar.appendChild(root);

    // Build the shelf
    const shelf = document.createElement("div");
    shelf.className = "tab-island-shelf";
    root.appendChild(shelf);

    // Internal state: map openerTabId -> island object
    const islands = new Map();
    const palette = [
      "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#9D4EDD",
      "#FF924C", "#00C2BA", "#F72585", "#FFBE0B", "#8338EC"
    ];
    let nextColorIndex = 0;

    // Helper: pick color (round-robin)
    function pickColor() {
      const c = palette[nextColorIndex % palette.length];
      nextColorIndex++;
      return c;
    }

    // Helper: create island DOM
    function makeIsland(openerTab, initialTabs = []) {
      const color = pickColor();
      const island = document.createElement("div");
      island.className = "tab-island island-expanded zti-falling"; // start with falling animation
      island.style.setProperty("--island-color", color);

      // header (click toggles)
      const header = document.createElement("div");
      header.className = "island-header";
      header.textContent = openerTab.label || shortenUrlTitle(openerTab);
      header.title = header.textContent;
      header.addEventListener("click", () => {
        island.classList.toggle("island-expanded");
        island.classList.toggle("island-collapsed");
      });

      // controls area: collapse button
      const controls = document.createElement("div");
      controls.className = "island-controls";
      const collapseBtn = document.createElement("button");
      collapseBtn.className = "island-btn";
      collapseBtn.textContent = "▾";
      collapseBtn.title = "Collapse / Expand";
      collapseBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        island.classList.toggle("island-expanded");
        island.classList.toggle("island-collapsed");
      });
      controls.appendChild(collapseBtn);
      header.appendChild(controls);

      const body = document.createElement("div");
      body.className = "island-body";

      // add initial tabs
      initialTabs.forEach(t => {
        const entry = makeTabEntry(t);
        body.appendChild(entry);
      });

      island.appendChild(header);
      island.appendChild(body);

      // remove falling class after animation
      setTimeout(() => island.classList.remove("zti-falling"), 520);

      return { island, openerId: openerTab._tPos || openerTab.getAttribute && openerTab.getAttribute("id") || getTabUniqueId(openerTab), color };
    }

    function makeTabEntry(tabEl) {
      const entry = document.createElement("div");
      entry.className = "island-tab-entry";
      // Get title safely
      let label = tabEl.label || shortenUrlTitle(tabEl) || "Tab";
      entry.textContent = label;
      entry.title = label;

      // click focuses the tab
      entry.addEventListener("click", () => {
        try {
          gBrowser.selectedTab = tabEl;
          gBrowser.selectedBrowser.focus();
        } catch (e) {}
      });

      // small close button per tab
      const closeBtn = document.createElement("button");
      closeBtn.className = "tab-close-btn";
      closeBtn.textContent = "✕";
      closeBtn.title = "Close tab";
      closeBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        try { gBrowser.removeTab(tabEl, { animate: true }); } catch (err) {}
      });
      entry.appendChild(closeBtn);

      return entry;
    }

    // helpers to identify tabs (some builds don't expose stable id)
    function getTabUniqueId(tabEl) {
      try {
        // try using element's linked browser id if present
        const linked = tabEl.linkedBrowser;
        if (linked && linked.currentURI) return String(linked.currentURI.spec) + "|" + (tabEl._tPos || Math.random());
      } catch (e) {}
      return "tab_" + (Date.now() + Math.floor(Math.random() * 1000));
    }

    function shortenUrlTitle(tabEl) {
      try {
        const lb = tabEl.linkedBrowser;
        const uri = lb && lb.currentURI && lb.currentURI.spec;
        if (!uri) return "";
        // simple host fallback
        const host = new URL(uri).hostname;
        return host.replace(/^www\./, "");
      } catch (e) {
        return "";
      }
    }

    // create or add to island for opener
    function ensureIslandForOpener(openerTabEl) {
      const key = getTabUniqueId(openerTabEl);
      if (islands.has(key)) return islands.get(key);
      const { island, openerId, color } = makeIsland(openerTabEl, [openerTabEl]);
      // set CSS color on island root so header/body can use it
      island.style.setProperty("--island-color", color);
      island.dataset.openerKey = key;
      shelf.appendChild(island);
      islands.set(key, { openerTabEl, island, tabs: new Set([openerTabEl]), color });
      return islands.get(key);
    }

    // add a child tab element to an island
    function addTabToIsland(islandObj, tabEl) {
      if (!islandObj) return;
      if (islandObj.tabs.has(tabEl)) return;
      const entry = makeTabEntry(tabEl);
      const body = islandObj.island.querySelector(".island-body");
      if (body) body.appendChild(entry);
      islandObj.tabs.add(tabEl);
    }

    // remove tab from any island(s)
    function removeTabFromIslands(tabEl) {
      for (const [key, obj] of islands.entries()) {
        if (obj.tabs.has(tabEl)) {
          obj.tabs.delete(tabEl);
          // remove entry DOM (match by title)
          const body = obj.island.querySelector(".island-body");
          if (body) {
            const entries = Array.from(body.querySelectorAll(".island-tab-entry"));
            for (const en of entries) {
              if (en.title === (tabEl.label || shortenUrlTitle(tabEl))) {
                en.remove();
                break;
              }
            }
          }
          // if island only has opener removed & no tabs left, remove island
          // We'll remove island when its opener is closed or when tabs set empty.
          if (obj.tabs.size === 0) {
            obj.island.remove();
            islands.delete(key);
          }
        }
      }
    }

    // When a new tab opens: if opener exists, create or add to that opener's island
    gBrowser.tabContainer.addEventListener("TabOpen", (ev) => {
      try {
        const newTab = ev.target;
        // Some builds provide newTab.linkedBrowser.opener -> browser element
        let openerBrowser = (newTab.linkedBrowser && newTab.linkedBrowser.opener) || null;
        let openerTab = null;
        try { if (openerBrowser) openerTab = gBrowser.getTabForBrowser(openerBrowser); } catch (e) { openerTab = null; }
        // fallback: if we detect recent active tab (heuristic), use that only if no opener provided
        if (!openerTab) {
          // don't auto-group if there's no opener to avoid noise
          return;
        }

        // Ensure an island for opener exists (expanded by default)
        const islandObj = ensureIslandForOpener(openerTab);
        // Add opener element to island if not present (ensure opener visible in list)
        addTabToIsland(islandObj, openerTab);
        // Add new tab to island
        addTabToIsland(islandObj, newTab);
        // Make sure island is expanded and animate falling
        islandObj.island.classList.add("island-expanded", "zti-falling");
        setTimeout(() => islandObj.island.classList.remove("zti-falling"), 520);
      } catch (e) {
        // be silent — don't break the browser
        console.error("TabIslands TabOpen handler error:", e);
      }
    }, true);

    // Tab close: remove references from islands
    gBrowser.tabContainer.addEventListener("TabClose", (ev) => {
      try {
        const closedTab = ev.target;
        removeTabFromIslands(closedTab);
      } catch (e) {
        console.error("TabIslands TabClose handler error:", e);
      }
    }, true);

    // Optional: If a tab's title updates, update island entry labels (listen to TabAttrModified)
    gBrowser.tabContainer.addEventListener("TabAttrModified", (ev) => {
      try {
        const tab = ev.target;
        // update matching entries text/title
        for (const [, obj] of islands.entries()) {
          if (obj.tabs.has(tab)) {
            const body = obj.island.querySelector(".island-body");
            if (!body) continue;
            const entries = Array.from(body.querySelectorAll(".island-tab-entry"));
            for (const en of entries) {
              // crude match by existing title; update if same
              if (en.title && (en.title === en.textContent)) {
                // update text if label changed
                en.textContent = tab.label || shortenUrlTitle(tab);
                en.title = en.textContent;
                // re-add close btn
                const cb = document.createElement("button");
                cb.className = "tab-close-btn";
                cb.textContent = "✕";
                cb.title = "Close tab";
                cb.addEventListener("click", (ev) => { ev.stopPropagation(); try { gBrowser.removeTab(tab); } catch (err) {} });
                en.appendChild(cb);
              }
            }
          }
        }
      } catch (e) {
        /* ignore */
      }
    });

    console.log("TabIslands: initialized.");
  } // end initTabIslands
})();
