// background.js — service worker
// Adds a right-click "Explain with LinGUA" menu item and hands the selected
// text over to the popup via storage.

const MENU_ID = "lingua-explain";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: 'Explain "%s" with LinGUA',
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID) return;
  const selected = (info.selectionText || "").trim();
  if (!selected) return;

  // Save the pending text so the popup can auto-load it as soon as it opens.
  await chrome.storage.local.set({ pendingText: selected });

  // Let the user know a new explanation is ready via a badge.
  chrome.action.setBadgeText({ text: "1" });
  chrome.action.setBadgeBackgroundColor({ color: "#D9A62E" });

  // On newer Chromium versions we can open the popup directly since a
  // context-menu click counts as a user gesture.
  try {
    if (chrome.action.openPopup) {
      await chrome.action.openPopup();
    }
  } catch (e) {
    // If openPopup isn't available/allowed, the user just clicks the
    // toolbar icon — the badge "1" tells them something is waiting.
  }
});
