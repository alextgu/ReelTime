const platforms = ["youtube", "instagram", "facebook", "tiktok"];

const tiktokVideoPattern = /tiktok\.com\/@[\w.-]+\/video\/\d+/;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    if (changeInfo.url.includes("youtube.com/shorts/")) {
      updateCount("youtube");
    } else if (changeInfo.url.includes("instagram.com/reels/")) {
      updateCount("instagram");
    } else if (changeInfo.url.includes("facebook.com/reel/")) {
      updateCount("facebook");
    } else if (tiktokVideoPattern.test(changeInfo.url)) {
      updateCount("tiktok");
    }
  }
});

function updateCount(platform) {
  chrome.storage.local.get(platforms, (data) => {
    const newPlatformCount = (data[platform] || 0) + 1;
    data[platform] = newPlatformCount;

    const total = platforms.reduce((sum, p) => sum + (data[p] || 0), 0);

    chrome.storage.local.set({
      ...platforms.reduce((obj, p) => ({ ...obj, [p]: data[p] }), {}),
      total: total
    }, () => {
      console.log(`Updated counts: total=${total}, ${platform}=${newPlatformCount}`);
    });
  });
}
