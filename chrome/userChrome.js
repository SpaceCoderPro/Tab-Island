// tabislands.uc.js
(function tabIslandsLoader() {
  function ready() {
    return window.gBrowserInit && gBrowserInit.delayedStartupFinished;
  }

  if (!ready()) {
    return setTimeout(tabIslandsLoader, 150);
  }

  console.log("[TabIslands] Zen UI ready — injecting islands...");

  const sidebar = document.querySelector("#sidebar-box");
  if (!sidebar) {
    console.warn("[TabIslands] Sidebar not found — aborting.");
    return;
  }

  const container = document.createElement("div");
  container.className = "tab-island-container";
  container.innerHTML = `
    <div class="island-bar"></div>
    <div class="island-groups"></div>
  `;
  sidebar.appendChild(container);

  // Example: Whenever a new tab is opened from another tab, create an island
  gBrowser.tabContainer.addEventListener("TabOpen", (e) => {
    const opener = e.target.openerTab;
    if (opener) {
      createIsland(opener.label, e.target.label);
    }
  });

  function createIsland(parentTitle, childTitle) {
    const group = document.createElement("div");
    group.className = "tab-island falling";
    group.textContent = `${parentTitle} → ${childTitle}`;
    container.querySelector(".island-groups").appendChild(group);
    setTimeout(() => group.classList.remove("falling"), 500);
  }
})();
