// ==UserScript==
// @name           Tab Islands Shelf for Zen
// @description    Opera-style tab islands in Zen sidebar without breaking Sine
// @version        1.0
// ==/UserScript==

(function tabIslandsLoader() {
  function ready() {
    return window.gBrowserInit && gBrowserInit.delayedStartupFinished;
  }

  if (!ready()) {
    return setTimeout(tabIslandsLoader, 150);
  }

  console.log("[TabIslands] Zen UI ready — injecting islands shelf...");

  const sidebar = document.querySelector("#sidebar-box");
  if (!sidebar) {
    console.warn("[TabIslands] Sidebar not found — aborting.");
    return;
  }

  // Create the shelf container
  const container = document.createElement("div");
  container.className = "tab-island-shelf";
  sidebar.appendChild(container);

  const colors = [
    "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#9D4EDD",
    "#FF924C", "#00C2BA", "#F72585", "#FFBE0B", "#8338EC"
  ];
  let colorIndex = 0;

  // Create a new island
  function createIsland(parentTab, childTab) {
    const color = colors[colorIndex++ % colors.length];

    const island = document.createElement("div");
    island.className = "tab-island expanded";
    island.style.setProperty("--island-color", color);

    const header = document.createElement("div");
    header.className = "island-header";
    header.textContent = parentTab.label;
    header.addEventListener("click", () => {
      island.classList.toggle("expanded");
    });

    const body = document.createElement("div");
    body.className = "island-body";
    body.innerHTML = `
      <div class="island-tab">${parentTab.label}</div>
      <div class="island-tab">${childTab.label}</div>
    `;

    island.appendChild(header);
    island.appendChild(body);

    container.appendChild(island);
  }

  // Listen for linked tab opens
  gBrowser.tabContainer.addEventListener("TabOpen", (e) => {
    const opener = e.target.openerTab;
    if (opener) {
      createIsland(opener, e.target);
    }
  });

})();
