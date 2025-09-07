// Handle omnibox search: type "rc your search"
chrome.omnibox.onInputEntered.addListener((text) => {
  handleQuery(text, true);
});

// Intercept direct Google searches
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  // Only handle top-level navigation
  if (details.frameId !== 0) return;

  try {
    const url = new URL(details.url);

    // Only intercept Google search pages with ?q=
    if (url.hostname === "www.google.com" && url.pathname === "/search" && url.searchParams.has("q")) {
      const query = url.searchParams.get("q");
      if (!query) return;

      chrome.storage.local.get({ skipContextOnce: false }, (flags) => {
        if (flags.skipContextOnce) {
          // skip just this one
          chrome.storage.local.set({ skipContextOnce: false });
          return;
        }

        handleQuery(query, false, details.tabId);
      });
    }
  } catch (e) {
    console.error("Navigation interception failed:", e);
  }
});


// Core query handler
function handleQuery(query, forceAppend = false, tabId = null) {
  chrome.storage.local.get({ context: "", queries: [] }, (data) => {
    const context = (data.context || "").trim();
    let modifiedQuery = query;

    if (context) {
      if (forceAppend || !query.toLowerCase().includes(context.toLowerCase())) {
        modifiedQuery = `${query} ${context}`;
      }
    }

    let queries = data.queries;

    // ✅ Build new query entry
    const newEntry = {
      rawQuery: query,
      fullQuery: modifiedQuery,
      timestamp: new Date().toLocaleString()
    };

    // ✅ Prevent duplicates: check if fullQuery already exists as the last entry
    if (queries.length === 0 || queries[queries.length - 1].fullQuery !== newEntry.fullQuery) {
      queries.push(newEntry);

      // limit to 50
      if (queries.length > 15) {
        queries = queries.slice(-15);
      }

      chrome.storage.local.set({ queries });
    }

    // redirect only if modified
    if (modifiedQuery !== query) {
      const newUrl = `https://www.google.com/search?q=${encodeURIComponent(modifiedQuery)}`;
      if (tabId) {
        chrome.tabs.update(tabId, { url: newUrl });
      } else {
        chrome.tabs.create({ url: newUrl });
      }
    }
  });
}