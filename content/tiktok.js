let lastVideoURL = null;

function checkTikTokVideoChange() {
    const currentURL = window.location.href;
    if (currentURL.includes("/video/") && currentURL !== lastVideoURL) {
        lastVideoURL = currentURL;
        console.log("New TikTok scroll detected:", currentURL);
        chrome.runtime.sendMessage({ type: "scrollDetected" });
    }
}

const tiktokObserver = new MutationObserver(() => {
    checkTikTokVideoChange();
});

tiktokObserver.observe(document.body, {
    childList: true,
    subtree: true
});
