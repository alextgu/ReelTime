document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('total', (data) => {
    document.getElementById('counter').textContent = data.total || 0;
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.total) {
      document.getElementById('counter').textContent = changes.total.newValue;
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const platforms = ["youtube", "instagram", "facebook", "tiktok"];

  // Fetch and display individual platform counts
  chrome.storage.local.get(platforms, (data) => {
    platforms.forEach((platform) => {
      const el = document.getElementById(`counter-${platform}`);
      if (el) {
        el.textContent = data[platform] || 0;
      }
    });
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local") {
      platforms.forEach((platform) => {
        if (changes[platform]) {
          const el = document.getElementById(`counter-${platform}`);
          if (el) {
            el.textContent = changes[platform].newValue;
          }
        }
      });
    }
  });
});
