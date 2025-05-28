console.log("YouTube Shorts content script loaded");
console.log("RotMax YouTube content script loaded");
let lastUrl = location.href;

const observer = new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        console.log("Detected scroll (video changed):", currentUrl);

        chrome.runtime.sendMessage({ type: "scrollDetected" });
    }
});

observer.observe(document.body, { childList: true, subtree: true });
