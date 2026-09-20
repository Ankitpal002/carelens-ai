/**
 * CareLens AI - Main Orchestrator & UI Application Logic
 */

// Global State
window.activeApiKey = localStorage.getItem('GEMINI_API_KEY') || '';
window.activeLanguage = localStorage.getItem('CARELENS_LANG') || 'English';
window.defaultWhatsApp = localStorage.getItem('CARELENS_WHATSAPP') || '';
window.currentImageBase64 = null;
window.currentAnalysis = null;
window.currentFontSizeIndex = 0;

window.fontScales = [
  { scale: '1rem', labelKey: 'Normal' },
  { scale: '1.15rem', labelKey: 'Large' },
  { scale: '1.3rem', labelKey: 'Huge' }
];

// Helper to retrieve CSRF token
window.getCSRFToken = function() {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue || '';
};

// ----------------------------------------------------
// TRANSLATION DICTIONARY MATRIX (13 Languages)
// ----------------------------------------------------
window.TRANSLATIONS = {
  English: {
    seniorBadge: 'Senior Companion Mode Active',
    textSizePrefix: 'Text:',
    textSizeNormal: 'Normal',
    textSizeLarge: 'Large',
    textSizeHuge: 'Huge',
    whatsappBtn: 'WhatsApp',
    apiKeyBtn: 'API Key',
    heroTitle: 'Point at Anything — CareLens Explains It!',
    heroDesc: 'Point your camera at any item, medicine bottle, paper bill, appliance dial, food, or letter. Tap one button and CareLens will speak what it is and what to do.',
    aiStatusTitleNoKey: 'Live AI Status: API Key Needed for Real Image Analysis',
    aiStatusSubtitleNoKey: 'To analyze real photos with Google Gemini AI, please enter your free API key.',
    aiStatusTitleKey: '✅ Live AI Connected: Google Gemini Vision is Active',
    aiStatusSubtitleKey: 'Your photos will be analyzed in real-time by Gemini AI.',
    setApiKeyBtn: '🔑 Set API Key',
    cameraBtnTitle: 'Tap Here to Open Camera',
    cameraBtnSub: 'Opens live camera viewfinder to scan anything',
    uploadBtn: '📁 Or Upload Photo / Document from Device',
    sampleTitle: '💡 Testing without a physical object? Try quick sample images',
    sampleClick: 'Click to expand',
    sampleMed: '💊 Medicine Bottle',
    sampleBill: '⚡ Electric Bill',
    sampleScam: '🚨 Suspicious Letter',
    loadingTitle: 'Analyzing Your Photo...',
    loadingDesc: 'Please give CareLens just a moment. We are consulting Gemini AI.',
    scanAnotherBtn: '⬅️ Scan Another',
    photoCaptured: 'Photo captured',
    plainSummaryBadge: 'Plain Language Summary',
    voiceCompanion: 'Voice Audio Companion',
    voicePace: 'Gentle pace (0.88x speed) for easy listening',
    readAloud: 'Read Aloud to Me',
    pauseReading: 'Pause Reading',
    askTitle: 'Have a question about this? Ask CareLens:',
    questionPlaceholder: 'Type your question here...',
    askBtn: 'Ask CareLens This Question',
    voiceStatusDefault: 'e.g. "When should I take this?" or "Is this a scam?"',
    voiceStatusListening: '🎙️ Listening... speak now',
    voiceStatusError: 'Could not hear clearly. Tap mic to try again.',
    answerTitle: 'CareLens Answer:',
    readAnswerAloud: '🔊 Read Answer Aloud',
    caregiverTitle: 'Want a second opinion?',
    caregiverDesc: 'Send this summary to your family or caregiver on WhatsApp.',
    sendFamily: 'Send to Family (WhatsApp)',
    sendOther: 'Send to Other Number',
    savedCaregiverPrefix: 'Saved caregiver: +',
    savedCaregiverSuffix: ' — tap to share instantly.',
    noCaregiverHint: 'Set a caregiver number (💬 in toolbar) for one-tap sharing.',
    promptEnterWa: 'Enter WhatsApp number with country code (e.g. 14155552671):',
    webcamHeader: '📹 Point camera at anything',
    webcamReticle: 'Hold item inside this frame',
    webcamSnap: '📸 Tap to Take Photo Now',
    webcamCancel: 'Cancel and go back',
    apiKeyModalTitle: '🔑 Connect Gemini AI',
    apiKeyModalDesc: 'Enter your Google Gemini API key to activate real AI vision on your photos.',
    apiKeyModalLink: '👉 Get a free key in 30 seconds at:',
    apiKeyModalSave: '✔ Save & Connect',
    apiKeyModalCancel: 'Cancel',
    apiKeyModalNote: '🔒 Your key is stored only in your browser (localStorage). Never shared.',
    waModalTitle: 'Caregiver WhatsApp',
    waModalDesc: 'Save your family member or caregiver\'s WhatsApp number for instant 1-tap second opinion sharing.',
    waModalLabel: 'Phone Number (with country code)',
    waModalSave: '✔ Save Number',
    waModalCancel: 'Cancel',
    waModalNote: '🔒 Stored locally on this device.',
    closePhoto: 'Close Photo'
  },
  Hindi: {
    seniorBadge: 'वरिष्ठ साथी मोड सक्रिय',
    textSizePrefix: 'अक्षर:',
    textSizeNormal: 'सामान्य',
    textSizeLarge: 'बड़ा',
    textSizeHuge: 'विशाल',
    whatsappBtn: 'व्हाट्सएप',
    apiKeyBtn: 'एपीआई कुंजी',
    heroTitle: 'किसी भी वस्तु पर कैमरा लगाएं — केयरलेंस समझाएगा!',
    heroDesc: 'दवाई की शीशी, बिजली का बिल, पत्र या किसी वस्तु पर कैमरा लगाएं। एक बटन दबाएं और केयरलेंस बोलकर समझाएगा।',
    aiStatusTitleNoKey: 'लाइव एआई स्थिति: वास्तविक विश्लेषण के लिए एपीआई कुंजी आवश्यक',
    aiStatusSubtitleNoKey: 'गूगल जेमिनी एआई द्वारा विश्लेषण के लिए कृपया अपनी मुफ्त एपीआई कुंजी दर्ज करें।',
    aiStatusTitleKey: '✅ लाइव एआई कनेक्टेड: गूगल जेमिनी विज़न सक्रिय है',
    aiStatusSubtitleKey: 'आपकी तस्वीरें जेमिनी एआई द्वारा रीयल-टाइम में समझी जाएंगी।',
    setApiKeyBtn: '🔑 एपीआई कुंजी सेट करें',
    cameraBtnTitle: 'कैमरा खोलने के लिए यहाँ टैप करें',
    cameraBtnSub: 'किसी भी वस्तु को स्कैन करने के लिए लाइव कैमरा खोलता है',
    uploadBtn: '📁 या डिवाइस से फोटो / दस्तावेज़ अपलोड करें',
    sampleTitle: '💡 क्या आपके पास कोई वस्तु नहीं है? नमूना चित्र आज़माएं',
    sampleClick: 'खोलने के लिए टैप करें',
    sampleMed: '💊 दवाई की शीशी',
    sampleBill: '⚡ बिजली का बिल',
    sampleScam: '🚨 संदिग्ध पत्र / धोखाधड़ी',
    loadingTitle: 'आपकी फोटो का विश्लेषण हो रहा है...',
    loadingDesc: 'कृपया कुछ पल प्रतीक्षा करें। केयरलेंस एआई से परामर्श ले रहा है।',
    scanAnotherBtn: '⬅️ दूसरा स्कैन करें',
    photoCaptured: 'फोटो खींची गई',
    plainSummaryBadge: 'सरल भाषा में सारांश',
    voiceCompanion: 'आवाज साथी',
    voicePace: 'सहज गति (0.88x रफ्तार) सुनने में आसान',
    readAloud: 'मुझे बोलकर सुनाएं',
    pauseReading: 'पढ़ना रोकें',
    askTitle: 'क्या आपका कोई सवाल है? केयरलेंस से पूछें:',
    questionPlaceholder: 'अपना सवाल यहाँ लिखें...',
    askBtn: 'केयरलेंस से यह सवाल पूछें',
    voiceStatusDefault: 'उदा. "मुझे यह कब लेना चाहिए?" या "क्या यह धोखाधड़ी है?"',
    voiceStatusListening: '🎙️ सुन रहा हूँ... अब बोलें',
    voiceStatusError: 'स्पष्ट सुनाई नहीं दिया। माइक पर फिर से टैप करें।',
    answerTitle: 'केयरलेंस का जवाब:',
    readAnswerAloud: '🔊 जवाब बोलकर सुनाएं',
    caregiverTitle: 'परिवार की राय चाहिए?',
    caregiverDesc: 'यह सारांश अपने परिवार या देखभालकर्ता को व्हाट्सएप पर भेजें।',
    sendFamily: 'परिवार को भेजें (WhatsApp)',
    sendOther: 'अन्य नंबर पर भेजें',
    savedCaregiverPrefix: 'सहेजा गया नंबर: +',
    savedCaregiverSuffix: ' — तुरंत भेजने के लिए टैप करें।',
    noCaregiverHint: '1-टैप शेयरिंग के लिए देखभालकर्ता नंबर (टूलबार में 💬) सेट करें।',
    promptEnterWa: 'देश कोड सहित व्हाट्सएप नंबर दर्ज करें (उदा. 919876543210):',
    webcamHeader: '📹 किसी भी वस्तु पर कैमरा लगाएं',
    webcamReticle: 'वस्तु को इस चौखट के अंदर रखें',
    webcamSnap: '📸 फोटो लेने के लिए यहाँ टैप करें',
    webcamCancel: 'रद्द करें और वापस जाएं',
    apiKeyModalTitle: '🔑 जेमिनी एआई कनेक्ट करें',
    apiKeyModalDesc: 'अपनी फोटो पर असली एआई विज़न सक्रिय करने के लिए जेमिनी एपीआई कुंजी दर्ज करें।',
    apiKeyModalLink: '👉 30 सेकंड में मुफ्त कुंजी प्राप्त करें:',
    apiKeyModalSave: '✔ सहेजें और कनेक्ट करें',
    apiKeyModalCancel: 'रद्द करें',
    apiKeyModalNote: '🔒 आपकी कुंजी केवल आपके ब्राउज़र में सुरक्षित रहती है।',
    waModalTitle: 'परिवार / देखभालकर्ता व्हाट्सएप',
    waModalDesc: '1-टैप शेयरिंग के लिए अपने परिवार का व्हाट्सएप नंबर सहेजें।',
    waModalLabel: 'फोन नंबर (देश कोड के साथ)',
    waModalSave: '✔ नंबर सहेजें',
    waModalCancel: 'रद्द करें',
    waModalNote: '🔒 इस डिवाइस पर सुरक्षित रूप से सहेजा गया।',
    closePhoto: 'फोटो बंद करें'
  }
};

// ----------------------------------------------------
// INITIALIZATION
// ----------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  // 1. Theme restoration
  const savedTheme = localStorage.getItem('CARELENS_THEME');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
  if (isDark) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  updateThemeIcon(isDark);

  // 2. Language restoration
  const langSel = document.getElementById('langSelector');
  if (langSel && window.activeLanguage) langSel.value = window.activeLanguage;
  applyUiTranslations(window.activeLanguage);

  // 3. API key restoration
  if (window.activeApiKey) {
    const keyInput = document.getElementById('apiKeyInput');
    if (keyInput) keyInput.value = window.activeApiKey;
  }
});

function onLanguageChange() {
  const langSel = document.getElementById('langSelector');
  if (!langSel) return;
  window.activeLanguage = langSel.value;
  localStorage.setItem('CARELENS_LANG', window.activeLanguage);
  applyUiTranslations(window.activeLanguage);
}

function applyUiTranslations(lang) {
  window.activeLanguage = lang || window.activeLanguage || 'English';
  const t = window.TRANSLATIONS[window.activeLanguage] || window.TRANSLATIONS['English'];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.innerText = t[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) el.setAttribute('placeholder', t[key]);
  });

  const currentScaleObj = window.fontScales[window.currentFontSizeIndex] || window.fontScales[0];
  const sizeKey = `textSize${currentScaleObj.labelKey}`;
  const sizeText = t[sizeKey] || currentScaleObj.labelKey;
  const textSizeLabel = document.getElementById('textSizeLabel');
  if (textSizeLabel) textSizeLabel.innerText = `${t.textSizePrefix || 'Text:'} ${sizeText}`;

  updateAiStatusCard(!!window.activeApiKey);
  updateWhatsAppHint();
}

function toggleTextSize() {
  window.currentFontSizeIndex = (window.currentFontSizeIndex + 1) % window.fontScales.length;
  document.documentElement.style.setProperty('--font-scale', window.fontScales[window.currentFontSizeIndex].scale);
  const t = window.TRANSLATIONS[window.activeLanguage] || window.TRANSLATIONS['English'];
  const currentScaleObj = window.fontScales[window.currentFontSizeIndex];
  const sizeKey = `textSize${currentScaleObj.labelKey}`;
  const sizeText = t[sizeKey] || currentScaleObj.labelKey;
  const lbl = document.getElementById('textSizeLabel');
  if (lbl) lbl.innerText = `${t.textSizePrefix || 'Text:'} ${sizeText}`;
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('CARELENS_THEME', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
  updateAiStatusCard(!!window.activeApiKey);
}

function updateThemeIcon(isDark) {
  const btn = document.getElementById('contrastBtn');
  if (btn) {
    btn.innerText = isDark ? '☀️' : '🌙';
    btn.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }
}

function updateAiStatusCard(hasKey) {
  const card = document.getElementById('aiStatusCard');
  const title = document.getElementById('aiStatusTitle');
  const subtitle = document.getElementById('aiStatusSubtitle');
  if (!card) return;
  const t = window.TRANSLATIONS[window.activeLanguage] || window.TRANSLATIONS['English'];
  card.removeAttribute('style');

  if (hasKey) {
    card.classList.remove('ai-status-no-key');
    card.classList.add('ai-status-connected');
    if (title) title.innerText = t.aiStatusTitleKey;
    if (subtitle) subtitle.innerText = t.aiStatusSubtitleKey;
  } else {
    card.classList.remove('ai-status-connected');
    card.classList.add('ai-status-no-key');
    if (title) title.innerText = t.aiStatusTitleNoKey;
    if (subtitle) subtitle.innerText = t.aiStatusSubtitleNoKey;
  }
}

// ----------------------------------------------------
// API KEY MODAL
// ----------------------------------------------------
function openApiKeyModal() {
  const input = document.getElementById('apiKeyInput');
  if (input) input.value = window.activeApiKey;
  const modal = document.getElementById('apiKeyModal');
  if (modal) modal.classList.remove('hidden');
}

function closeApiKeyModal() {
  const modal = document.getElementById('apiKeyModal');
  if (modal) modal.classList.add('hidden');
}

function saveApiKey() {
  const input = document.getElementById('apiKeyInput');
  const val = input ? input.value.trim() : '';
  if (!val) {
    localStorage.removeItem('GEMINI_API_KEY');
    window.activeApiKey = '';
    updateAiStatusCard(false);
    closeApiKeyModal();
    return;
  }
  window.activeApiKey = val;
  localStorage.setItem('GEMINI_API_KEY', val);
  updateAiStatusCard(true);
  closeApiKeyModal();
}

// ----------------------------------------------------
// IMAGE PROCESSING & DEMO PRESETS
// ----------------------------------------------------
window.processImage = async function(dataUrl) {
  showLoading(true);
  try {
    const res = await fetch('/api/analyze/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': window.getCSRFToken()
      },
      body: JSON.stringify({
        image_base64: window.currentImageBase64,
        api_key: window.activeApiKey || null,
        language: window.activeLanguage
      })
    });

    const json = await res.json();
    if (json.success && json.data) {
      window.currentAnalysis = json.data;
      renderResults(json.data, dataUrl);
    } else {
      alert('Analysis error: ' + (json.error || 'Could not analyze image.'));
    }
  } catch (err) {
    console.error('API Error:', err);
    // Fallback to local preset simulation if offline
    loadPreset('medication');
  } finally {
    showLoading(false);
  }
};

async function loadPreset(presetKey) {
  showLoading(true);
  try {
    const res = await fetch(`/api/presets/${presetKey}/?language=${window.activeLanguage}`);
    const json = await res.json();
    const data = json.data;
    window.currentAnalysis = data;
    const fakeDataUrl = createSvgPlaceholder(presetKey);
    setTimeout(() => {
      renderResults(data, fakeDataUrl);
      showLoading(false);
    }, 600);
  } catch (e) {
    showLoading(false);
  }
}

function createSvgPlaceholder(key) {
  const titles = { medication: 'MEDICINE BOTTLE', billing: 'ELECTRICITY BILL', scam: 'URGENT NOTICE (SCAM)' };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="#EFF6FF" rx="24"/><rect x="30" y="30" width="540" height="340" fill="#ffffff" stroke="#cbd5e1" stroke-width="4" rx="16"/><text x="50" y="100" font-family="sans-serif" font-size="28" font-weight="bold" fill="#1e293b">${titles[key] || 'DOCUMENT'}</text></svg>`;
  return 'data:image/svg+xml;base64,' + btoa(svg);
}

function renderResults(data, dataUrl) {
  const thumb = document.getElementById('resultThumbnail');
  if (thumb) thumb.src = dataUrl;
  const full = document.getElementById('fullImagePreview');
  if (full) full.src = dataUrl;

  const tag = document.getElementById('classificationTag');
  if (tag) tag.innerText = data.classification || 'DOCUMENT';
  const sum = document.getElementById('summaryText');
  if (sum) sum.innerText = data.summary;

  const badgeBox = document.getElementById('safetyBadgeContainer');
  const badgeIcon = document.getElementById('safetyBadgeIcon');
  const badgeTitle = document.getElementById('safetyBadgeTitle');
  const badgeDesc = document.getElementById('safetyBadgeDesc');

  const verdict = (data.safetyVerdict || 'SAFE').toUpperCase();
  if (verdict === 'SCAM') {
    badgeBox.className = "rounded-2xl p-5 border-4 border-crimson bg-crimson-light text-crimson flex items-center gap-4 shadow-sm";
    badgeIcon.innerText = "🚨";
    badgeTitle.innerText = "DANGER - SCAM DETECTED";
    badgeDesc.innerText = data.safetyExplanation || "Do not send money or click any links. This is a scam.";
  } else if (verdict === 'CAUTION') {
    badgeBox.className = "rounded-2xl p-5 border-4 border-honey bg-honey-light text-honey flex items-center gap-4 shadow-sm";
    badgeIcon.innerText = "⚠️";
    badgeTitle.innerText = "PROCEED WITH CAUTION";
    badgeDesc.innerText = data.safetyExplanation || "Please verify with a family member before taking action.";
  } else {
    badgeBox.className = "rounded-2xl p-5 border-4 border-sage bg-sage-light text-sage flex items-center gap-4 shadow-sm";
    badgeIcon.innerText = "🛡️";
    badgeTitle.innerText = "VERIFIED SAFE";
    badgeDesc.innerText = data.safetyExplanation || "This document appears legitimate and safe.";
  }

  if (data.actionItems) {
    document.getElementById('action1Label').innerText = data.actionItems.primaryField || 'Primary Detail';
    document.getElementById('action1Value').innerText = data.actionItems.primaryValue || '--';
    document.getElementById('action2Label').innerText = data.actionItems.secondaryField || 'Important Note';
    document.getElementById('action2Value').innerText = data.actionItems.secondaryValue || '--';
  }

  stopAudio();
  setTimeout(() => playAudio(data.summary), 500);

  document.getElementById('viewCapture').classList.add('hidden');
  document.getElementById('viewResults').classList.remove('hidden');
}

function showLoading(isLoading) {
  if (isLoading) {
    document.getElementById('viewCapture').classList.add('hidden');
    document.getElementById('viewResults').classList.add('hidden');
    document.getElementById('viewLoading').classList.remove('hidden');
  } else {
    document.getElementById('viewLoading').classList.add('hidden');
  }
}

function resetToHome() {
  stopAudio();
  document.getElementById('viewResults').classList.add('hidden');
  document.getElementById('viewLoading').classList.add('hidden');
  document.getElementById('viewCapture').classList.remove('hidden');
  document.getElementById('voiceAnswerBox').classList.add('hidden');
  const qi = document.getElementById('questionInput');
  if (qi) qi.value = '';
}

function openImageModal() {
  const modal = document.getElementById('imageModal');
  if (modal) modal.classList.remove('hidden');
}

function closeImageModal() {
  const modal = document.getElementById('imageModal');
  if (modal) modal.classList.add('hidden');
}
