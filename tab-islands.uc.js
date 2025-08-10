(() => {
  const waitForReady = () => {
    if (!window.gBrowserInit || !gBrowserInit.delayedStartupFinished || !window.gBrowser) {
      setTimeout(waitForReady, 150);
      return;
    }

    if (document.querySelector(".tab-island-shelf-root")) return;

    const css = `
      .tab-island-shelf-root {
        padding: 8px;
        box-sizing: border-box;
      }
      .tab-island-shelf {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .tab-island {
        min-width: 140px;
        max-width: 260px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        padding: 8px;
        box-sizing: border-box;
        transition: transform 0.2s ease;
      }
      .tab-island:hover {
        transform: scale(1.05);
      }
      .tab-island-title {
        font-weight: bold;
        margin-bottom: 4px;
      }
      .tab-island-content {
        font-size: 0.9em;
        color: #ccc;
      }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    const shelf = document.createElement("div");
    shelf.className = "tab-island-shelf-root";
    shelf.innerHTML = `
      <div class="tab-island-shelf">
        <div class="tab-island">
          <div class="tab-island-title">Island 1</div>
          <div class="tab-island-content">Content for Island 1</div>
        </div>
        <div class="tab-island">
          <div class="tab-island-title">Island 2</div>
          <div class="tab-island-content">Content for Island 2</div>
        </div>
        <div class="tab-island">
          <div class="tab-island-title">Island 3</div>
          <div class="tab-island-content">Content for Island 3</div>
        </div>
      </div>
    `;
    document.body.appendChild(shelf);
  };
  waitForReady();
})();
