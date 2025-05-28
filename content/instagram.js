let lastSeenText = "";

const instaObserver = new MutationObserver(() => {
    const videoContainers = document.querySelectorAll("video");

    if (videoContainers.length > 0) {
        const mainVideo = videoContainers[0];
        const videoSrc = mainVideo.src;

        if (videoSrc && videoSrc !== lastSeenText) {
            lastSeenText = videoSrc;
            console.log("New Instagram reel detected:", videoSrc);
            chrome.runtime.sendMessage({ type: "scrollDetected" });
        }
    }
});

instaObserver.observe(document.body, {
    childList: true,
    subtree: true
});
