/**
 * CareLens AI - Audio Companion & Speech Synthesis Engine
 * Calibrated specifically for senior hearing (0.88x pace, high clarity)
 */

let isSpeaking = false;
let currentUtterance = null;

function toggleAudioPlayback() {
  if (isSpeaking) {
    stopAudio();
  } else {
    if (window.currentAnalysis && window.currentAnalysis.summary) {
      playAudio(window.currentAnalysis.summary);
    }
  }
}

function playAudio(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = 0.88;
  currentUtterance.pitch = 1.0;

  const langBcp47 = {
    'English': 'en-US', 'Hindi': 'hi-IN', 'Marathi': 'mr-IN', 'Tamil': 'ta-IN', 'Telugu': 'te-IN',
    'Bengali': 'bn-IN', 'Kannada': 'kn-IN', 'Malayalam': 'ml-IN', 'Gujarati': 'gu-IN',
    'Punjabi': 'pa-IN', 'Urdu': 'ur-IN', 'Arabic': 'ar-SA', 'Spanish': 'es-ES'
  };
  const activeLang = window.activeLanguage || 'English';
  const langCode = langBcp47[activeLang] || 'en-US';
  const langPrefix = langCode.split('-')[0];
  currentUtterance.lang = langCode;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang === langCode || v.lang.startsWith(langPrefix));
  if (preferredVoice) currentUtterance.voice = preferredVoice;

  const t = window.TRANSLATIONS ? (window.TRANSLATIONS[activeLang] || window.TRANSLATIONS['English']) : {};

  currentUtterance.onstart = () => {
    isSpeaking = true;
    const icon = document.getElementById('audioIcon');
    const lbl = document.getElementById('audioLabel');
    const wave = document.getElementById('waveContainer');
    if (icon) icon.innerText = '⏸️';
    if (lbl) lbl.innerText = t.pauseReading || 'Pause Reading';
    if (wave) wave.classList.remove('hidden');
  };

  currentUtterance.onend = () => stopAudio();
  currentUtterance.onerror = () => stopAudio();

  window.speechSynthesis.speak(currentUtterance);
}

function stopAudio() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isSpeaking = false;
  const activeLang = window.activeLanguage || 'English';
  const t = window.TRANSLATIONS ? (window.TRANSLATIONS[activeLang] || window.TRANSLATIONS['English']) : {};
  const icon = document.getElementById('audioIcon');
  const lbl = document.getElementById('audioLabel');
  const wave = document.getElementById('waveContainer');
  if (icon) icon.innerText = '🔊';
  if (lbl) lbl.innerText = t.readAloud || 'Read Aloud to Me';
  if (wave) wave.classList.add('hidden');
}
