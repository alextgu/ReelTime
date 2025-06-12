document.addEventListener('DOMContentLoaded', () => {
  // ------------------ STATS.HTML COUNTERS ------------------
  const counterEl = document.getElementById('counter');
  const platforms = ["youtube", "instagram", "facebook", "tiktok"];

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

    document.addEventListener('DOMContentLoaded', function () {
    const platforms = ['instagram', 'tiktok', 'youtube', 'facebook'];

    platforms.forEach(platform => {
      const count = parseInt(localStorage.getItem(`reelCount-${platform}`)) || 0;
      const element = document.getElementById(`counter-${platform}`);
      if (element) {
        element.textContent = count;
      }
    });
  });

  // ------------------ SETTINGS.HTML HANDLING ------------------
  const toggle = document.getElementById('toggle-alerts');
  const alertEveryInput = document.getElementById('alert-every');
  const dailyLimitInput = document.getElementById('daily-limit');

  if (toggle && alertEveryInput && dailyLimitInput) {
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
        alertEvery: parseInt(alertEveryInput.value, 10),
        dailyLimit: dailyLimitInput.value
      });
    }
  }


  

  // ------------------ POPUP.HTML COUNTER + RESET ------------------
  const counterElement = document.getElementById('counter');
  const resetBtn = document.getElementById('reset-btn');
  const modal = document.getElementById('confirmation-modal');
  const confirmBtn = document.getElementById('confirm-reset');
  const cancelBtn = document.getElementById('cancel-reset');

  if (counterElement) {
    chrome.storage.local.get('total', (data) => {
      counterElement.textContent = data.total || 0;
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.total) {
        counterElement.textContent = changes.total.newValue;
      }
    });
  }

  if (resetBtn && modal && confirmBtn && cancelBtn) {
    resetBtn.addEventListener('click', function (e) {
      e.preventDefault();
      modal.classList.remove('hidden');
    });

    confirmBtn.addEventListener('click', function () {
      const resetValues = { total: 0 };
      platforms.forEach(p => resetValues[p] = 0);

      chrome.storage.local.set(resetValues, () => {
        counterElement.textContent = '0';
        modal.classList.add('hidden');
      });
    });

    cancelBtn.addEventListener('click', function () {
      modal.classList.add('hidden');
    });
  }
});
