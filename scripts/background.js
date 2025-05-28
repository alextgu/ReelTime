const rotMessages = [
    "Time to rot your brain!",
    "Don't forget to scroll!",
    "You deserve a break!",
    "Time to indulge in some mindless scrolling!",
    "Don't let your feed go cold!",
    "Your next scroll is just a click away!",
    "You are being too productive!",
    "Don't forget to take a break and scroll!",
];

const encouragementMessages = [
    "You are doing great!",
    "Keep up the good work!",
    "You are making progress!",
    "Don't stop now, you're on a roll!",
    "You are on the right track!",
    "Keep pushing forward!",
];

function getRandomMessage(messagesArray) {
    const index = Math.floor(Math.random() * messagesArray.length);
    return messagesArray[index];
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "rotAlarm") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;

      const currentURL = tabs[0].url;
      const doomSites = [
        "tiktok.com",
        "instagram.com",
        "youtube.com/shorts"
      ];

      const isOnDoomSite = doomSites.some(site => currentURL.includes(site));

      const message = isOnDoomSite
        ? getRandomMessage(encouragementMessages)
        : getRandomMessage(rotMessages);

      chrome.notifications.create({
        type: "basic",
        iconUrl: "images/icon-48.png",
        title: isOnDoomSite ? "Rot Status: Excellent" : "Rot Reminder",
        message: message
      });
    });
  }
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "scrollDetected") {
    const today = new Date().toISOString().split('T')[0];
    chrome.storage.local.get([today], (data) => {
      const currentCount = data[today] || 0;
      chrome.storage.local.set({ [today]: currentCount + 1 });
    });
  }
});

});
