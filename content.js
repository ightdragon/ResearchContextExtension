chrome.storage.local.get({ context: "" }, (data) => {
  if (data.context) {
    const banner = document.createElement("div");
    banner.innerHTML = `
      <span style="font-weight:bold;">Context:</span> ${data.context}
      <button id="dismissContextBanner"
        style="margin-left:10px; padding:2px 6px; font-size:12px;
               border:none; border-radius:4px; cursor:pointer;">
        ✕
      </button>
    `;

    banner.style.cssText = `
      position: sticky;
      top: 0;
      z-index: 9999;
      background: green;
      padding: 8px;
      text-align: center;
      font-family: Arial, sans-serif;
      font-size: 14px;
      font-weight: normal;
      border-bottom: 2px solid #000000ff;
    `;

    document.body.prepend(banner);

    document.getElementById("dismissContextBanner").addEventListener("click", () => {
      banner.remove();
    });
  }
});
