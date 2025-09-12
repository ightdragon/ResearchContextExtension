document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup loaded ✅");

  const list = document.getElementById("queryList");
  const contextInput = document.getElementById("contextInput");
  const saveButton = document.getElementById("saveContext");
  const clearButton = document.getElementById("clearContext");
  const currentContext = document.getElementById("currentContext");
    const adminClearButton = document.getElementById("adminClearHistory");
    const strongContextCheckbox = document.getElementById("strongContext");

  function loadData() {
      chrome.storage.local.get({ context: "", queries: [], strong: false }, (data) => {
        contextInput.value = data.context || "";
        currentContext.textContent = data.context || "(none saved)";
        document.getElementById("strongContext").checked = data.strong || false;
      console.log("Loaded context:", data.context);
      console.log("Loaded queries:", data.queries);

      // Clear history before re-render
      list.innerHTML = "";

      // Show newest first
      [...data.queries].reverse().forEach((item) => {
      const li = document.createElement("li");

      // inner wrapper for query + timestamp
      const querySpan = document.createElement("span");
      querySpan.className = "history-query";
      querySpan.textContent = item.fullQuery;

      const tsSpan = document.createElement("span");
      tsSpan.className = "history-timestamp";
      tsSpan.textContent = item.timestamp;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-history";
      deleteBtn.innerHTML = "&times;";

      // ✅ Clicking the li (anywhere except delete button) re-runs query
        li.addEventListener("click", () => {
          chrome.storage.local.get({ strong: false }, (store) => {
            let queryToSearch = item.fullQuery;
            if (store.strong) {
              queryToSearch = `${queryToSearch}`;
            }
            chrome.storage.local.set({ skipContextOnce: true }, () => {
              const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(queryToSearch)}`;
              chrome.tabs.create({ url: searchUrl });
            });
          });
        });

  // ✅ Delete button removes entry without triggering li click
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    chrome.storage.local.get({ queries: [] }, (store) => {
      const updated = store.queries.filter(q => q.id !== item.id);
      chrome.storage.local.set({ queries: updated }, loadData);
    });
  });

  li.appendChild(querySpan);
  li.appendChild(tsSpan);
  li.appendChild(deleteBtn);
  list.appendChild(li);
});

    });
  }

  loadData();

  // Select all text on focus
  contextInput.addEventListener("focus", () => contextInput.select());

  // Enter saves context
  contextInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveContext();
    }
  });

  // Save context button
  saveButton.addEventListener("click", saveContext);

    // Save strong match immediately when checkbox is toggled
    strongContextCheckbox.addEventListener("change", () => {
      const strong = strongContextCheckbox.checked;
      chrome.storage.local.set({ strong }, () => {
        console.log("Strong match updated:", strong);
      });
    });

  // Clear only context
  clearButton.addEventListener("click", () => {
    chrome.storage.local.set({ context: "" }, () => {
      contextInput.value = "";
      currentContext.textContent = "(none saved)";
      console.log("Context cleared");
    });
  });


  function saveContext() {
      let context = contextInput.value.trim();
      const strong = document.getElementById("strongContext").checked;
      chrome.storage.local.set({ context, strong }, () => {
        currentContext.textContent = context || "(none saved)";
        console.log("Context saved:", {context, strong});
      });
  }
});