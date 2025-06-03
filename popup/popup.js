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
