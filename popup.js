document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup loaded ✅");
 
  const list = document.getElementById("queryList");
  const contextInput = document.getElementById("contextInput");
  const saveButton = document.getElementById("saveContext");
  const clearButton = document.getElementById("clearContext");
  const currentContext = document.getElementById("currentContext");

  function loadData() {
    chrome.storage.local.get({ context: "", queries: [] }, (data) => {
      contextInput.value = data.context || "";
      currentContext.textContent = data.context ? data.context : "(none saved)";
      console.log("Stored queries:", data.queries);
      // ✅ Always clear list before re-rendering
      list.innerHTML = "";

      // ✅ Reverse so newest appears first
      [...data.queries].reverse().forEach(item => {
        const li = document.createElement("li");
        console.log("check")
        li.innerHTML = `
          <span class="history-query">${item.fullQuery}</span>
          <small style="color:#777;">(${item.timestamp})</small>
        `;

        li.style.cursor = "pointer";
        li.title = "Click to re-run this exact query (with its original context)";
        li.addEventListener("click", () => {
          chrome.storage.local.set({ skipContextOnce: true }, () => {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(item.fullQuery)}`;
            chrome.tabs.create({ url: searchUrl });
          });
        });

        list.appendChild(li);
      });

      console.log("Rendered queries:", data.queries.length);
    });
  }

  loadData(); // ✅ run once

  // Select all text when focusing context box
  contextInput.addEventListener("focus", () => contextInput.select());

  // Enter saves context
  contextInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveContext();
    }
  });

  saveButton.addEventListener("click", saveContext);

  clearButton.addEventListener("click", () => {
    chrome.storage.local.clear(() => {
      contextInput.value = "";
      currentContext.textContent = "(none saved)";
      list.innerHTML = "";
    });
  });

  function saveContext() {
    const context = contextInput.value.trim();
    chrome.storage.local.set({ context }, () => {
      currentContext.textContent = context || "(none saved)";
    });
  }



  li.addEventListener("click", () => {
  // set a one-time skip flag
  chrome.storage.local.set({ skipContextOnce: true }, () => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(item.rawQuery)}`;
    chrome.tabs.create({ url: searchUrl });
  });
});
});