// Show overlay when popup opens
document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId, { action: "showOverlay" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error showing overlay:", chrome.runtime.lastError.message);
                // Attempt to inject content script dynamically
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["content.js"]
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.error("Injection failed:", chrome.runtime.lastError.message);
                    } else {
                        // Retry sending the message after injection
                        chrome.tabs.sendMessage(tabId, { action: "showOverlay" }, (retryResponse) => {
                            if (chrome.runtime.lastError) {
                                console.error("Retry failed:", chrome.runtime.lastError.message);
                            } else {
                                console.log("Overlay shown successfully after retry");
                            }
                        });
                    }
                });
            } else {
                console.log("Overlay shown successfully:", response);
            }
        });
    });
});

function setPosition(position) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: updateOverlayPosition,
            args: [position]
        }).catch(error => console.error("Script Injection Error:", error));
    });
}

// Event listeners for position buttons (unchanged)
document.getElementById("top-left").addEventListener("click", () => setPosition("top-left"));
document.getElementById("top-center").addEventListener("click", () => setPosition("top-center"));
document.getElementById("top-right").addEventListener("click", () => setPosition("top-right"));
document.getElementById("bottom-left").addEventListener("click", () => setPosition("bottom-left"));
document.getElementById("bottom-center").addEventListener("click", () => setPosition("bottom-center"));
document.getElementById("bottom-right").addEventListener("click", () => setPosition("bottom-right"));

// Function to update overlay position (unchanged)
function updateOverlayPosition(position) {
    const sizeOverlay = document.getElementById("size-overlay");
    if (!sizeOverlay) return;

    sizeOverlay.style.top = "auto";
    sizeOverlay.style.bottom = "auto";
    sizeOverlay.style.left = "auto";
    sizeOverlay.style.right = "auto";
    sizeOverlay.style.transform = "none";

    if (position === "top-left") {
        sizeOverlay.style.top = "10px";
        sizeOverlay.style.left = "10px";
    } else if (position === "top-right") {
        sizeOverlay.style.top = "10px";
        sizeOverlay.style.right = "10px";
    } else if (position === "top-center") {
        sizeOverlay.style.top = "10px";
        sizeOverlay.style.left = "50%";
        sizeOverlay.style.transform = "translateX(-50%)";
    } else if (position === "bottom-left") {
        sizeOverlay.style.bottom = "10px";
        sizeOverlay.style.left = "10px";
    } else if (position === "bottom-center") {
        sizeOverlay.style.bottom = "10px";
        sizeOverlay.style.left = "50%";
        sizeOverlay.style.transform = "translateX(-50%)";
    } else if (position === "bottom-right") {
        sizeOverlay.style.bottom = "10px";
        sizeOverlay.style.right = "10px";
    }
}