/**
 * CareLens AI - Accessible Interactive Onboarding Guide & Walkthrough Engine
 * Designed specifically for Senior visual and audio accessibility.
 */

window.currentTourStep = 0;

window.TOUR_STEPS = [
  {
    step: 1,
    icon: '📸',
    badgeKey: 'tourBadge1',
    badgeDefault: 'Step 1 of 6 • Point & Scan',
    titleKey: 'tourTitle1',
    titleDefault: '1. Point Camera at Anything',
    descKey: 'tourDesc1',
    descDefault: 'Tap the giant blue camera shutter or upload any photo. CareLens easily reads medicine bottles, paper utility bills, letters, notices, food labels, and appliance dials.',
    tipKey: 'tourTip1',
    tipDefault: '💡 Testing without a physical item? Use the collapsible "Sample Images" right on the home screen!',
    highlightSelector: '#cameraDropzone'
  },
  {
    step: 2,
    icon: '🔊',
    badgeKey: 'tourBadge2',
    badgeDefault: 'Step 2 of 6 • Senior Audio',
    titleKey: 'tourTitle2',
    titleDefault: '2. Clear Voice & Plain Summaries',
    descKey: 'tourDesc2',
    descDefault: 'CareLens gives a 2-sentence plain language summary and speaks it aloud at a calm, 0.88x gentle pace. Perfect for tired eyes or hearing assistance.',
    tipKey: 'tourTip2',
    tipDefault: '💡 You can pause or replay the voice audio anytime with the "Read Aloud" button.',
    highlightSelector: '#audioToggleBtn'
  },
  {
    step: 3,
    icon: '🛡️',
    badgeKey: 'tourBadge3',
    badgeDefault: 'Step 3 of 6 • Scam Protection',
    titleKey: 'tourTitle3',
    titleDefault: '3. Three-Tier Trust & Scam Shield',
    descKey: 'tourDesc3',
    descDefault: 'Every document is verified: 🟢 Green for Verified Safe, 🟡 Yellow for Caution, and 🚨 Red for Dangerous Scams. Never get tricked by fake utility notices or financial scams.',
    tipKey: 'tourTip3',
    tipDefault: '💡 If a document is flagged red, do not call phone numbers or scan QR codes listed on it.',
    highlightSelector: '#safetyBadgeContainer'
  },
  {
    step: 4,
    icon: '💬',
    badgeKey: 'tourBadge4',
    badgeDefault: 'Step 4 of 6 • Voice Q&A',
    titleKey: 'tourTitle4',
    titleDefault: '4. Ask Any Follow-up Question',
    descKey: 'tourDesc4',
    descDefault: 'Got a question? Tap the microphone 🎤 or type: "When should I take this pill?" or "How much is due?" CareLens answers directly from the scanned document.',
    tipKey: 'tourTip4',
    tipDefault: '💡 Voice answers can also be read aloud in your chosen language with 1 tap.',
    highlightSelector: '#questionInput'
  },
  {
    step: 5,
    icon: '📲',
    badgeKey: 'tourBadge5',
    badgeDefault: 'Step 5 of 6 • Family Bridge',
    titleKey: 'tourTitle5',
    titleDefault: '5. 1-Tap Second Opinion on WhatsApp',
    descKey: 'tourDesc5',
    descDefault: 'Need your daughter, son, or caregiver to double check? Tap one button to share the simplified summary and safety verdict directly to their WhatsApp.',
    tipKey: 'tourTip5',
    tipDefault: '💡 Set your family\'s WhatsApp number using the 💬 WhatsApp button in the top bar.',
    highlightSelector: '#defaultShareLabel'
  },
  {
    step: 6,
    icon: '⚙️',
    badgeKey: 'tourBadge6',
    badgeDefault: 'Step 6 of 6 • Accessibility',
    titleKey: 'tourTitle6',
    titleDefault: '6. Text Magnifier, 13 Languages & Dark Mode',
    descKey: 'tourDesc6',
    descDefault: 'Use the top toolbar anytime to magnify text (🔍), switch between 13 regional Indian and global languages (🌐), or switch to Midnight Slate dark mode (🌙).',
    tipKey: 'tourTip6',
    tipDefault: '💡 You can reopen this Quick Guide anytime by clicking the 📖 Quick Guide button in the top bar!',
    highlightSelector: '#quickGuideBtn'
  }
];

function getTourTranslation(key, fallback) {
  const lang = window.activeLanguage || 'English';
  const t = (window.TRANSLATIONS && window.TRANSLATIONS[lang]) || {};
  return t[key] || fallback;
}

function startOnboardingTour() {
  window.currentTourStep = 0;
  const modal = document.getElementById('onboardingModal');
  if (modal) {
    modal.classList.remove('hidden');
    renderTourStep();
  }
}

function renderTourStep() {
  const stepData = window.TOUR_STEPS[window.currentTourStep];
  if (!stepData) return;

  const totalSteps = window.TOUR_STEPS.length;
  const progressPercent = ((window.currentTourStep + 1) / totalSteps) * 100;

  // Update progress bar & counters
  const progressBar = document.getElementById('tourProgressBar');
  if (progressBar) progressBar.style.width = `${progressPercent}%`;

  const counter = document.getElementById('tourStepCounter');
  if (counter) {
    counter.innerText = `Step ${window.currentTourStep + 1} of ${totalSteps} • ${getTourTranslation(stepData.badgeKey, stepData.badgeDefault)}`;
  }

  // Update step icon, title, description, tip
  const iconEl = document.getElementById('tourStepIcon');
  if (iconEl) iconEl.innerText = stepData.icon;

  const badgeEl = document.getElementById('tourStepBadge');
  if (badgeEl) badgeEl.innerText = getTourTranslation(stepData.badgeKey, stepData.badgeDefault);

  const titleEl = document.getElementById('tourStepTitle');
  if (titleEl) titleEl.innerText = getTourTranslation(stepData.titleKey, stepData.titleDefault);

  const descEl = document.getElementById('tourStepDescription');
  if (descEl) descEl.innerText = getTourTranslation(stepData.descKey, stepData.descDefault);

  const tipEl = document.getElementById('tourStepTipText');
  if (tipEl) tipEl.innerText = getTourTranslation(stepData.tipKey, stepData.tipDefault);

  // Update Next/Prev/Finish buttons
  const prevBtn = document.getElementById('tourPrevBtn');
  const nextBtn = document.getElementById('tourNextBtn');
  const finishBtn = document.getElementById('tourFinishBtn');

  if (prevBtn) {
    if (window.currentTourStep === 0) {
      prevBtn.classList.add('hidden');
    } else {
      prevBtn.classList.remove('hidden');
    }
  }

  if (window.currentTourStep === totalSteps - 1) {
    if (nextBtn) nextBtn.classList.add('hidden');
    if (finishBtn) finishBtn.classList.remove('hidden');
  } else {
    if (nextBtn) nextBtn.classList.remove('hidden');
    if (finishBtn) finishBtn.classList.add('hidden');
  }

  // Update dots indicator
  document.querySelectorAll('.tour-dot').forEach((dot, idx) => {
    if (idx === window.currentTourStep) {
      dot.className = 'tour-dot w-4 h-3 rounded-full bg-sapphire scale-110 transition-all';
    } else if (idx < window.currentTourStep) {
      dot.className = 'tour-dot w-3 h-3 rounded-full bg-sage transition-all';
    } else {
      dot.className = 'tour-dot w-3 h-3 rounded-full bg-linen-300 transition-all';
    }
  });

  // Highlight corresponding DOM target if present
  highlightTourElement(stepData.highlightSelector);
}

function highlightTourElement(selector) {
  // Remove existing highlight rings
  document.querySelectorAll('.tour-highlight-active').forEach(el => {
    el.classList.remove('tour-highlight-active');
  });

  if (!selector) return;
  const target = document.querySelector(selector);
  if (target && !target.closest('#onboardingModal')) {
    target.classList.add('tour-highlight-active');
  }
}

function nextTourStep() {
  if (window.currentTourStep < window.TOUR_STEPS.length - 1) {
    window.currentTourStep++;
    renderTourStep();
  } else {
    finishOnboardingTour();
  }
}

function prevTourStep() {
  if (window.currentTourStep > 0) {
    window.currentTourStep--;
    renderTourStep();
  }
}

function readCurrentTourStepAloud() {
  const stepData = window.TOUR_STEPS[window.currentTourStep];
  if (!stepData) return;

  const title = getTourTranslation(stepData.titleKey, stepData.titleDefault);
  const desc = getTourTranslation(stepData.descKey, stepData.descDefault);
  const tip = getTourTranslation(stepData.tipKey, stepData.tipDefault);
  const fullNarration = `${title}. ${desc} Note: ${tip.replace('💡', '')}`;

  if (typeof window.playAudio === 'function') {
    window.playAudio(fullNarration);
  }
}

function finishOnboardingTour() {
  const modal = document.getElementById('onboardingModal');
  if (modal) modal.classList.add('hidden');

  // Remove element highlights
  document.querySelectorAll('.tour-highlight-active').forEach(el => {
    el.classList.remove('tour-highlight-active');
  });

  // Stop any audio playback
  if (typeof window.stopAudio === 'function') {
    window.stopAudio();
  }

  // Notify backend that tour was completed
  notifyTourCompletion();
}

function skipOnboardingTour() {
  finishOnboardingTour();
}

function notifyTourCompletion() {
  const csrfToken = typeof window.getCSRFToken === 'function' ? window.getCSRFToken() : '';
  fetch('/api/complete-tour/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken
    },
    body: JSON.stringify({ completed: true })
  }).then(res => res.json())
    .then(data => {
      console.log('CareLens onboarding tour completed state persisted:', data);
    }).catch(err => {
      console.warn('Could not persist tour completion state:', err);
    });
}

// Auto-launch tour if flagged on page load
window.addEventListener('DOMContentLoaded', () => {
  if (window.showOnboardingTour) {
    setTimeout(() => {
      startOnboardingTour();
    }, 600);
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('onboardingModal');
    if (modal && !modal.classList.contains('hidden')) {
      if (e.key === 'Escape') {
        skipOnboardingTour();
      } else if (e.key === 'ArrowRight') {
        nextTourStep();
      } else if (e.key === 'ArrowLeft') {
        prevTourStep();
      }
    }
  });
});
