const platforms = ["youtube", "instagram", "facebook", "tiktok"];
const tiktokVideoPattern = /tiktok\.com\/@[\w.-]+\/video\/\d+/;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.url) return;

  if (changeInfo.url.includes("youtube.com/shorts/")) {
    updateCount("youtube");
  } else if (changeInfo.url.includes("instagram.com/reels/")) {
    updateCount("instagram");
  } else if (changeInfo.url.includes("facebook.com/reel/")) {
    updateCount("facebook");
  } else if (tiktokVideoPattern.test(changeInfo.url)) {
    updateCount("tiktok");
  }
});

function updateCount(platform) {
  chrome.storage.local.get([...platforms, 'alertsEnabled', 'alertEvery', 'dailyLimit', 'lastDate'], (data) => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Reset counts if new day
    if (data.lastDate !== today) {
      platforms.forEach(p => data[p] = 0);
      data.total = 0;
    }

    // Update platform count
    data[platform] = (data[platform] || 0) + 1;

    // Calculate total count
    const total = platforms.reduce((sum, p) => sum + (data[p] || 0), 0);

    // Save updated counts and date
    chrome.storage.local.set({
      ...Object.fromEntries(platforms.map(p => [p, data[p]])),
      total,
      lastDate: today
    });

    // Alert logic
    const alertsEnabled = data.alertsEnabled ?? false;
    const alertEvery = Number(data.alertEvery) || 0;
    const dailyLimit = Number(data.dailyLimit) || null;

    if (!alertsEnabled) return;

    // Notify every alertEvery count reached
    if (alertEvery > 0 && total > 0 && total % alertEvery === 0) {
      chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("images/icon-128.png"),
      title: "ReelTime Alert",
      message: `You've watched ${total} reels. Take a break!`,
      priority: 1
});
    }

    // Notify if daily limit reached or exceeded
    if (dailyLimit && total >= dailyLimit) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("images/icon-128.png"),
        title: "Daily Limit Reached",
        message: `You've hit your daily limit of ${dailyLimit} reels.`,
        priority: 2
      });
    }
  });
}
