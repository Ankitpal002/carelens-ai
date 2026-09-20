/**
 * CareLens AI - WhatsApp Caregiver Bridge Module
 */

function openWhatsAppModal() {
  const input = document.getElementById('waNumberInput');
  if (input) input.value = window.defaultWhatsApp || '';
  const modal = document.getElementById('whatsAppModal');
  if (modal) modal.classList.remove('hidden');
}

function closeWhatsAppModal() {
  const modal = document.getElementById('whatsAppModal');
  if (modal) modal.classList.add('hidden');
}

function saveWhatsAppNumber() {
  const input = document.getElementById('waNumberInput');
  const num = input.value.trim().replace(/[^0-9+]/g, '');
  window.defaultWhatsApp = num;
  localStorage.setItem('CARELENS_WHATSAPP', num);
  
  // Persist to Django backend if possible
  fetch('/api/save-caregiver/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': window.getCSRFToken ? window.getCSRFToken() : ''
    },
    body: JSON.stringify({ phone_number: num })
  }).catch(() => {});

  updateWhatsAppHint();
  closeWhatsAppModal();
}

function updateWhatsAppHint() {
  const hint = document.getElementById('whatsappRecipientHint');
  const lbl = document.getElementById('defaultShareLabel');
  const activeLang = window.activeLanguage || 'English';
  const t = window.TRANSLATIONS ? (window.TRANSLATIONS[activeLang] || window.TRANSLATIONS['English']) : {};
  if (!hint) return;

  if (window.defaultWhatsApp) {
    hint.innerText = `${t.savedCaregiverPrefix || 'Saved caregiver: +'}${window.defaultWhatsApp.replace('+','')}${t.savedCaregiverSuffix || ' — tap to share instantly.'}`;
    if (lbl) lbl.innerText = `+${window.defaultWhatsApp.replace('+','').slice(-4).padStart(window.defaultWhatsApp.length,'*')} (WhatsApp)`;
  } else {
    hint.innerText = t.noCaregiverHint || 'Set a caregiver number (💬 in toolbar) for one-tap sharing.';
    if (lbl) lbl.innerText = t.sendFamily || 'Send to Family (WhatsApp)';
  }
}

function shareViaWhatsApp(mode) {
  if (!window.currentAnalysis) return;
  const msg = encodeURIComponent(
    (window.currentAnalysis.caregiverMessage || 'Hi, please check this document I scanned on CareLens AI.') +
    '\n\n🔗 Scanned via CareLens AI: https://ankitpal002.github.io/carelens-ai/'
  );
  let number = '';
  if (mode === 'default') {
    if (!window.defaultWhatsApp) {
      openWhatsAppModal();
      return;
    }
    number = window.defaultWhatsApp.replace(/[^0-9]/g, '');
  } else {
    const activeLang = window.activeLanguage || 'English';
    const t = window.TRANSLATIONS ? (window.TRANSLATIONS[activeLang] || window.TRANSLATIONS['English']) : {};
    number = prompt(t.promptEnterWa || 'Enter WhatsApp number with country code (e.g. 14155552671):');
    if (!number) return;
    number = number.replace(/[^0-9]/g, '');
  }
  const url = number
    ? `https://wa.me/${number}?text=${msg}`
    : `https://wa.me/?text=${msg}`;
  window.open(url, '_blank');
}
