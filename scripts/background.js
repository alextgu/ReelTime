/// Detects the URL Change and calls updateCount for URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.includes("youtube.com/shorts/")) {
    updateCount("youtube");
  } else if (changeInfo.url && changeInfo.url.includes("instagram.com/reels/")) {
    updateCount("instagram");
  } else if (changeInfo.url && changeInfo.url.includes("facebook.com/reel/")) {
    updateCount("facebook");
  }
});

/// Tiktok detection using content script

/// Condition -> updateCount("tiktok");

/// Increments the count for the specified platform 
function updateCount(platform) {
  chrome.storage.local.get(["total", platform], (data) => {
    const total = (data.total || 0) + 1;
    const platformCount = (data[platform] || 0) + 1;

    chrome.storage.local.set({
      total: total,
      [platform]: platformCount
    }, () => {
      console.log(`Updated counts: total=${total}, ${platform}=${platformCount}`);
    });
  });
}


/// Alert System for Benchmarks