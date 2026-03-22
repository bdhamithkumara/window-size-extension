// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "showOverlay") {
        createOverlay();
        updateSize();
        sendResponse({ status: "overlay shown" });
    } else if (message.action === "hideOverlay") {
        removeOverlay();
        sendResponse({ status: "overlay hidden" });
    }
});

// Create the overlay div
function createOverlay() {
    if (document.getElementById("size-overlay")) return; // Avoid duplicates

    const sizeOverlay = document.createElement("div");
    sizeOverlay.id = "size-overlay";
    sizeOverlay.style.position = "fixed";
    sizeOverlay.style.top = "10px";
    sizeOverlay.style.right = "10px"; // Default position
    sizeOverlay.style.padding = "5px 10px";
    sizeOverlay.style.borderRadius = "5px";
    sizeOverlay.style.fontFamily = "Arial, sans-serif";
    sizeOverlay.style.fontSize = "14px";
    sizeOverlay.style.fontWeight = "bold";
    sizeOverlay.style.zIndex = "9999";
    sizeOverlay.style.pointerEvents = "auto";
    sizeOverlay.style.display = "flex";
    sizeOverlay.style.alignItems = "center";
    sizeOverlay.style.gap = "10px";
    sizeOverlay.style.backgroundColor = "white";
    sizeOverlay.style.color = "black";

    const closeButton = document.createElement("button");
    closeButton.innerText = "✖";
    closeButton.style.border = "none";
    closeButton.style.background = "transparent";
    closeButton.style.color = "black";
    closeButton.style.fontSize = "16px";
    closeButton.style.cursor = "pointer";
    closeButton.style.padding = "0";
    closeButton.style.marginLeft = "5px";

    closeButton.addEventListener("click", () => {
        removeOverlay();
        chrome.runtime.sendMessage({ action: "overlayClosed" });
    });

    sizeOverlay.appendChild(closeButton);
    document.body.appendChild(sizeOverlay);

    window.addEventListener("resize", updateSize);
}

// Remove the overlay
function removeOverlay() {
    const sizeOverlay = document.getElementById("size-overlay");
    if (sizeOverlay) {
        sizeOverlay.remove();
        window.removeEventListener("resize", updateSize);
    }
}

// Update size display
function updateSize() {
    const sizeOverlay = document.getElementById("size-overlay");
    if (sizeOverlay) {
        sizeOverlay.innerHTML = `Width: ${window.innerWidth}px | Height: ${window.innerHeight}px `;
        const closeButton = document.createElement("button");
        closeButton.innerText = "✖";
        closeButton.style.border = "none";
        closeButton.style.background = "transparent";
        closeButton.style.color = "black";
        closeButton.style.fontSize = "16px";
        closeButton.style.cursor = "pointer";
        closeButton.style.padding = "0";
        closeButton.style.marginLeft = "5px";
        closeButton.addEventListener("click", () => {
            removeOverlay();
            chrome.runtime.sendMessage({ action: "overlayClosed" });
        });
        sizeOverlay.appendChild(closeButton);
    }
}