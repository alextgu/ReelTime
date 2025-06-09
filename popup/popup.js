document.addEventListener('DOMContentLoaded', () => {
  // For stats.html counters:
  const counterEl = document.getElementById('counter');
  if (counterEl) {
    chrome.storage.local.get('total', (data) => {
      counterEl.textContent = data.total || 0;
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.total) {
        counterEl.textContent = changes.total.newValue;
      }
    });
  }

  // Platform-specific counters (stats.html)
  const platforms = ["youtube", "instagram", "facebook", "tiktok"];
  let hasPlatformCounters = platforms.some(p => document.getElementById(`counter-${p}`));
  if (hasPlatformCounters) {
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
  }

  // For settings.html checkbox and inputs
  const toggle = document.getElementById('toggle-alerts');
  const alertEveryInput = document.getElementById('alert-every');
  const dailyLimitInput = document.getElementById('daily-limit');

  if (toggle && alertEveryInput && dailyLimitInput) {
    // Load saved settings on page load
    chrome.storage.local.get(['alertsEnabled', 'alertEvery', 'dailyLimit'], (result) => {
      const enabled = result.alertsEnabled ?? false;
      toggle.checked = enabled;
      setInputsDisabled(!enabled);

      if (result.alertEvery) alertEveryInput.value = result.alertEvery;
      if (result.dailyLimit) dailyLimitInput.value = result.dailyLimit;
    });

    function setInputsDisabled(disabled) {
      [alertEveryInput, dailyLimitInput].forEach(input => {
        input.disabled = disabled;
      });
    }

    // Allow only numbers in inputs for alert settings
    [alertEveryInput, dailyLimitInput].forEach(input => {
      input.addEventListener('input', e => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        saveSettings();
      });
    });

    toggle.addEventListener('change', () => {
      setInputsDisabled(!toggle.checked);
      saveSettings();
    });

    function saveSettings() {
      chrome.storage.local.set({
        alertsEnabled: toggle.checked,
        alertEvery: alertEveryInput.value,
        dailyLimit: dailyLimitInput.value
      });
    }
  }
});
