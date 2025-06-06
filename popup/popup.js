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



document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle-alerts');
  const inputs = [
    document.getElementById('alert-every'),
    document.getElementById('daily-limit')
  ];

  // Load saved settings on page load
  chrome.storage.local.get(['alertsEnabled', 'alertEvery', 'dailyLimit'], (result) => {
    const enabled = result.alertsEnabled ?? false;
    toggle.checked = enabled;
    setInputsDisabled(!enabled);

    if (result.alertEvery) inputs[0].value = result.alertEvery;
    if (result.dailyLimit) inputs[1].value = result.dailyLimit;
  });

  function setInputsDisabled(disabled) {
    inputs.forEach(input => {
      input.disabled = disabled;
    });
  }

  // Allow only numbers in inputs
  inputs.forEach(input => {
    input.addEventListener('input', e => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
      saveSettings(); // save on input change
    });
  });

  toggle.addEventListener('change', () => {
    setInputsDisabled(!toggle.checked);
    saveSettings(); // save on toggle change
  });

  function saveSettings() {
    chrome.storage.local.set({
      alertsEnabled: toggle.checked,
      alertEvery: inputs[0].value,
      dailyLimit: inputs[1].value
    });
  }
});
