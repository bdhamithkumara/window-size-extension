chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "overlayClosed") {
        chrome.tabs.sendMessage(sender.tab.id, { action: "hideOverlay" });
    }
});