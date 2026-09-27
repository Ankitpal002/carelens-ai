/**
 * CareLens AI - Accessible Visual Feature Pointer & Walkthrough Engine
 * Uses a non-modal directional pointer, glowing spotlight, and bouncing beacon
 * to point one-by-one to core features and explain their usability in plain language.
 */

window.currentTourStep = 0;
window.isTourActive = false;

// Step Definitions for the Main Home / Capture Screen
const CAPTURE_TOUR_STEPS = [
  {
    step: 1,
    icon: '📸',
    badge: 'Feature 1 of 8 • Point & Scan',
    title: '1. Tap to Open Camera',
    selector: '#cameraDropzone',
    description: 'Tap this giant blue shutter button to open your live camera viewfinder. Point at any medicine bottle, paper bill, appliance dial, food, or letter.',
    usability: 'Zero tech anxiety: giant touch targets accommodate tremors or arthritis. Once opened, you can scan anything in 1 tap.',
    tip: '💡 Testing on a laptop or desktop? Your webcam will open smoothly.',
    preferredPlacement: 'top'
  },
  {
    step: 2,
    icon: '💡',
    badge: 'Feature 2 of 8 • Demo Samples',
    title: '2. Try Instant Sample Images',
    selector: '#samplePresetsCard',
    description: 'Don\'t have an item in front of you right now? Tap any of these 3 demo buttons to immediately test how CareLens reads medicines, bills, or notices.',
    usability: 'Instantly tests real-world AI reasoning, 3-tier scam detection, and audio summaries without needing a physical object.',
    tip: '💡 Tap "⚡ Electric Bill" or "💊 Medicine Bottle" anytime to see full analysis.',
    preferredPlacement: 'top',
    onActivate: () => {
      const details = document.getElementById('samplePresetsDetails');
      if (details) {
        details.open = true;
        setTimeout(() => {
          if (window.isTourActive && window.currentTourStep === 1) {
            repositionPointer();
          }
        }, 150);
      }
    }
  },
  {
    step: 3,
    icon: '🔍',
    badge: 'Feature 3 of 8 • Text Magnifier',
    title: '3. Instant Text Size Magnifier',
    selector: '#textSizeBtn',
    description: 'Struggling with small print? Tap this button once to make all text across the screen Large, and tap again for Extra Large.',
    usability: 'Increases typography up to 135% with WCAG 2.2 AAA high contrast, making buttons and labels effortless to read.',
    tip: '💡 Cycles cleanly: Normal ➔ Large ➔ Extra Large.',
    preferredPlacement: 'bottom'
  },
  {
    step: 4,
    icon: '🌐',
    badge: 'Feature 4 of 8 • 13 Languages',
    title: '4. Speak & Read in 13 Languages',
    selector: '#langSelector',
    description: 'CareLens supports 13 regional Indian & global languages: Hindi, Marathi, Tamil, Telugu, Gujarati, Bengali, Punjabi, Urdu, Kannada, Malayalam, Arabic, Spanish, and English.',
    usability: 'All AI summaries, scam warnings, and voice narrations translate into your native tongue in real time.',
    tip: '💡 Change the language anytime using this dropdown selector.',
    preferredPlacement: 'bottom'
  },
  {
    step: 5,
    icon: '🌙',
    badge: 'Feature 5 of 8 • Eye Comfort',
    title: '5. Midnight Slate Dark Mode',
    selector: '#contrastBtn',
    description: 'Tap the moon icon to activate Midnight Slate dark mode. It eliminates blinding white glare and protects tired eyes in dim rooms.',
    usability: 'Specially tuned high-contrast dark theme reduces eye fatigue while keeping text sharp and crisp.',
    tip: '💡 Tap again anytime to switch back to warm linen daylight mode.',
    preferredPlacement: 'bottom'
  },
  {
    step: 6,
    icon: '💬',
    badge: 'Feature 6 of 8 • Family Net',
    title: '6. Family WhatsApp Safety Net',
    selector: '#whatsappHeaderBtn',
    description: 'Tap here to save your daughter, son, or caregiver\'s WhatsApp number.',
    usability: 'When you scan any confusing letter or bill, you can send them a 1-tap summary and scam verdict for peace of mind.',
    tip: '💡 Save the number once and it stays ready for instant 1-tap sharing.',
    preferredPlacement: 'bottom'
  },
  {
    step: 7,
    icon: '🔑',
    badge: 'Feature 7 of 8 • Gemini AI',
    title: '7. Powered by Google Gemini AI',
    selector: '#apiKeyHeaderBtn',
    description: 'CareLens uses Google Gemini Multimodal Vision to understand text, medication dosages, and dials.',
    usability: 'Enter your free Google AI Studio key here to enable live camera photo analysis.',
    tip: '💡 Free keys take just 1 minute to generate on Google AI Studio.',
    preferredPlacement: 'bottom'
  },
  {
    step: 8,
    icon: '📖',
    badge: 'Feature 8 of 8 • Replay Anytime',
    title: '8. Replay This Guide Anytime',
    selector: '#quickGuideBtn',
    description: 'Need a reminder later? Tap this 📖 Quick Guide button anytime to point through all features again.',
    usability: 'You can also press Left / Right arrow keys on your keyboard to navigate between features at your own pace.',
    tip: '💡 You are now ready to start exploring CareLens AI!',
    preferredPlacement: 'bottom'
  }
];

// Step Definitions if Results view is currently active
const RESULTS_TOUR_STEPS = [
  {
    step: 1,
    icon: '🛡️',
    badge: 'Result Feature 1 of 6 • Scam Shield',
    title: '1. Three-Tier Trust & Scam Shield',
    selector: '#safetyBadgeContainer',
    description: 'Every document is evaluated for fraud or predatory manipulation: 🟢 Verified Safe, 🟡 Caution, or 🚨 Scam Detected.',
    usability: 'Helps seniors avoid disconnection scams, fake bank notices, and fraudulent wire demands.',
    tip: '💡 If a notice is red, never call numbers or scan QR codes printed on it.',
    preferredPlacement: 'bottom'
  },
  {
    step: 2,
    icon: '📝',
    badge: 'Result Feature 2 of 6 • Plain Summary',
    title: '2. "Explain Like I\'m 75" Summary',
    selector: '#summaryText',
    description: 'CareLens extracts the core message into a 2-sentence explanation at a 6th-grade reading level.',
    usability: 'No confusing legal fine print: immediately tells you what this is and what you need to do.',
    tip: '💡 Answers the only two questions that matter: How much and when.',
    preferredPlacement: 'top'
  },
  {
    step: 3,
    icon: '🔊',
    badge: 'Result Feature 3 of 6 • Senior Audio',
    title: '3. Calm Voice Audio Companion',
    selector: '#audioToggleBtn',
    description: 'Tap "Read Aloud" to hear the explanation spoken aloud at a gentle 0.88x pace for easy listening.',
    usability: 'Calibrated specifically for seniors with hearing loss, cataracts, or tired eyes.',
    tip: '💡 Works in all 13 supported regional languages.',
    preferredPlacement: 'top'
  },
  {
    step: 4,
    icon: '💬',
    badge: 'Result Feature 4 of 6 • Voice Q&A',
    title: '4. Voice & Text Follow-Up Questions',
    selector: '#questionInput',
    description: 'Got a question? Tap the microphone 🎤 or type: "When should I take this?" or "How much is due?"',
    usability: 'CareLens reasons directly over the scanned document to give direct, immediate answers.',
    tip: '💡 Voice answers can also be read aloud in 1 tap.',
    preferredPlacement: 'top'
  },
  {
    step: 5,
    icon: '📲',
    badge: 'Result Feature 5 of 6 • WhatsApp Share',
    title: '5. 1-Tap Caregiver Second Opinion',
    selector: '#defaultShareLabel',
    description: 'Need a family member to double-check? Tap here to send the simplified summary and safety rating directly to their WhatsApp.',
    usability: 'Provides an instant safety net so seniors never have to guess alone.',
    tip: '💡 Shares cleanly formatted text without heavy attachments.',
    preferredPlacement: 'top'
  },
  {
    step: 6,
    icon: '⬅️',
    badge: 'Result Feature 6 of 6 • Scan Another',
    title: '6. Scan Another Item Anytime',
    selector: 'button[onclick="resetToHome()"]',
    description: 'Ready to check something else? Tap "Scan Another" to clear and return to the camera shutter.',
    usability: 'Fast 1-tap reset to keep daily scanning frictionless and fast.',
    tip: '💡 You can scan as many documents and items as you need.',
    preferredPlacement: 'bottom'
  }
];

/**
 * Returns active steps depending on whether results or capture view is open
 */
function getActiveTourSteps() {
  const resultsView = document.getElementById('viewResults');
  if (resultsView && !resultsView.classList.contains('hidden')) {
    return RESULTS_TOUR_STEPS;
  }
  return CAPTURE_TOUR_STEPS;
}

/**
 * Launches the pointer walkthrough
 */
function startOnboardingTour() {
  window.isTourActive = true;
  window.currentTourStep = 0;

  const cutout = document.getElementById('tourSpotlightCutout');
  const pointerCard = document.getElementById('tourPointerCard');
  const beacon = document.getElementById('tourPointerBeacon');

  if (cutout) cutout.classList.remove('hidden');
  if (pointerCard) pointerCard.classList.remove('hidden');
  if (beacon) beacon.classList.remove('hidden');

  renderCurrentTourStep();
}

/**
 * Alias for feature tour trigger
 */
function startFeatureTour() {
  startOnboardingTour();
}

/**
 * Renders the active step and moves the pointer to point directly at the feature
 */
function renderCurrentTourStep() {
  const steps = getActiveTourSteps();
  if (window.currentTourStep < 0) window.currentTourStep = 0;
  if (window.currentTourStep >= steps.length) {
    finishOnboardingTour();
    return;
  }

  const stepData = steps[window.currentTourStep];
  if (!stepData) return;

  // Execute onActivate hook if present (e.g. opening sample details)
  if (typeof stepData.onActivate === 'function') {
    try { stepData.onActivate(); } catch (e) {}
  }

  // Update card UI contents
  const badgeEl = document.getElementById('tourStepBadge');
  if (badgeEl) badgeEl.innerText = stepData.badge;

  const counterEl = document.getElementById('tourStepCounter');
  if (counterEl) counterEl.innerText = `Step ${window.currentTourStep + 1} of ${steps.length} • Usability Guide`;

  const iconEl = document.getElementById('tourStepIcon');
  if (iconEl) iconEl.innerText = stepData.icon;

  const titleEl = document.getElementById('tourStepTitle');
  if (titleEl) titleEl.innerText = stepData.title;

  const descEl = document.getElementById('tourStepDescription');
  if (descEl) descEl.innerText = stepData.description;

  const tipEl = document.getElementById('tourStepTipText');
  if (tipEl) tipEl.innerText = stepData.tip;

  // Update progress bar
  const progressBar = document.getElementById('tourProgressBar');
  if (progressBar) {
    const pct = ((window.currentTourStep + 1) / steps.length) * 100;
    progressBar.style.width = `${pct}%`;
  }

  // Update buttons
  const prevBtn = document.getElementById('tourPrevBtn');
  const nextBtn = document.getElementById('tourNextBtn');
  const finishBtn = document.getElementById('tourFinishBtn');

  if (prevBtn) {
    if (window.currentTourStep === 0) prevBtn.classList.add('hidden');
    else prevBtn.classList.remove('hidden');
  }

  if (window.currentTourStep === steps.length - 1) {
    if (nextBtn) nextBtn.classList.add('hidden');
    if (finishBtn) finishBtn.classList.remove('hidden');
  } else {
    if (nextBtn) nextBtn.classList.remove('hidden');
    if (finishBtn) finishBtn.classList.add('hidden');
  }

  // Render step dots
  renderTourDots(steps);

  // Focus target and position pointer
  focusAndPointToElement(stepData.selector, stepData.preferredPlacement);
}

/**
 * Highlights target element and calculates pointer coordinates
 */
function focusAndPointToElement(selector, preferredPlacement) {
  // Remove existing element highlights
  document.querySelectorAll('.tour-target-focused').forEach(el => {
    el.classList.remove('tour-target-focused');
  });

  const targetEl = document.querySelector(selector);
  const pointerCard = document.getElementById('tourPointerCard');
  const arrow = document.getElementById('tourPointerArrow');
  const beacon = document.getElementById('tourPointerBeacon');

  if (!targetEl || !pointerCard) return;

  // Add focus highlight
  targetEl.classList.add('tour-target-focused');

  // Smooth scroll target into comfortable center view
  targetEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

  // Delay positioning slightly to allow smooth scroll to settle
  setTimeout(() => {
    repositionPointer();
  }, 220);
}

/**
 * Calculates real-time position of the pointer card and directional arrow
 */
function repositionPointer() {
  if (!window.isTourActive) return;

  const steps = getActiveTourSteps();
  const stepData = steps[window.currentTourStep];
  if (!stepData) return;

  const targetEl = document.querySelector(stepData.selector);
  const pointerCard = document.getElementById('tourPointerCard');
  const arrow = document.getElementById('tourPointerArrow');
  const beacon = document.getElementById('tourPointerBeacon');

  if (!targetEl || !pointerCard) return;

  const rect = targetEl.getBoundingClientRect();
  const cardRect = pointerCard.getBoundingClientRect();
  const cardWidth = cardRect.width || Math.min(420, window.innerWidth - 28);
  const cardHeight = cardRect.height || 310;

  // Position Spotlight Cutout Window directly over the target button (ZERO BLUR)
  const cutout = document.getElementById('tourSpotlightCutout');
  if (cutout) {
    const pad = 8;
    cutout.classList.remove('hidden');
    cutout.style.top = `${Math.max(4, rect.top - pad)}px`;
    cutout.style.left = `${Math.max(4, rect.left - pad)}px`;
    cutout.style.width = `${rect.width + (pad * 2)}px`;
    cutout.style.height = `${rect.height + (pad * 2)}px`;
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Determine whether to place ABOVE or BELOW
  let placement = stepData.preferredPlacement || 'bottom';
  const spaceBelow = viewportHeight - rect.bottom;
  const spaceAbove = rect.top;

  if (placement === 'bottom' && spaceBelow < cardHeight + 20 && spaceAbove > cardHeight + 20) {
    placement = 'top';
  } else if (placement === 'top' && spaceAbove < cardHeight + 20 && spaceBelow > cardHeight + 20) {
    placement = 'bottom';
  }

  // Calculate card Top position
  let cardTop = 0;
  if (placement === 'top') {
    cardTop = rect.top - cardHeight - 16;
  } else {
    cardTop = rect.bottom + 16;
  }

  // Clamp vertical bounds
  cardTop = Math.max(12, Math.min(cardTop, viewportHeight - cardHeight - 12));

  // Calculate card Left position (align with center of target)
  const targetCenter = rect.left + (rect.width / 2);
  let cardLeft = targetCenter - (cardWidth / 2);

  // Clamp horizontal bounds
  cardLeft = Math.max(12, Math.min(cardLeft, viewportWidth - cardWidth - 12));

  // Apply card coordinates
  pointerCard.style.top = `${cardTop}px`;
  pointerCard.style.left = `${cardLeft}px`;

  // Position the directional arrow caret on the card
  if (arrow) {
    arrow.className = 'pointer-arrow absolute w-5 h-5 transform rotate-45 transition-all duration-200';
    let arrowLeft = targetCenter - cardLeft - 10;
    arrowLeft = Math.max(24, Math.min(arrowLeft, cardWidth - 34));
    arrow.style.left = `${arrowLeft}px`;

    if (placement === 'top') {
      arrow.classList.add('arrow-bottom');
      arrow.style.bottom = '-10px';
      arrow.style.top = 'auto';
    } else {
      arrow.classList.add('arrow-top');
      arrow.style.top = '-10px';
      arrow.style.bottom = 'auto';
    }
  }

  // Position target beacon
  if (beacon) {
    const beaconLeft = Math.max(10, Math.min(targetCenter - 18, viewportWidth - 45));
    let beaconTop = 0;

    if (placement === 'top') {
      beaconTop = Math.max(8, rect.bottom - 16);
      const hand = document.getElementById('tourBeaconHand');
      if (hand) hand.innerText = '👆';
    } else {
      beaconTop = Math.max(8, rect.top - 24);
      const hand = document.getElementById('tourBeaconHand');
      if (hand) hand.innerText = '👇';
    }

    beacon.style.top = `${beaconTop}px`;
    beacon.style.left = `${beaconLeft}px`;
  }
}

/**
 * Renders interactive step dot pills in the card footer
 */
function renderTourDots(steps) {
  const container = document.getElementById('tourDotsContainer');
  if (!container) return;

  container.innerHTML = '';
  steps.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to step ${idx + 1}`);

    if (idx === window.currentTourStep) {
      dot.className = 'tour-dot w-6 h-2.5 rounded-full bg-sapphire transition-all scale-105';
    } else if (idx < window.currentTourStep) {
      dot.className = 'tour-dot w-2.5 h-2.5 rounded-full bg-sage transition-all';
    } else {
      dot.className = 'tour-dot w-2.5 h-2.5 rounded-full bg-linen-300 hover:bg-gray-400 transition-all';
    }

    dot.onclick = () => {
      window.currentTourStep = idx;
      renderCurrentTourStep();
    };

    container.appendChild(dot);
  });
}

/**
 * Advance to next step
 */
function nextTourStep() {
  const steps = getActiveTourSteps();
  if (window.currentTourStep < steps.length - 1) {
    window.currentTourStep++;
    renderCurrentTourStep();
  } else {
    finishOnboardingTour();
  }
}

/**
 * Move to previous step
 */
function prevTourStep() {
  if (window.currentTourStep > 0) {
    window.currentTourStep--;
    renderCurrentTourStep();
  }
}

/**
 * Reads feature usability instructions aloud using senior speech synthesis pace
 */
function readCurrentTourStepAloud() {
  const steps = getActiveTourSteps();
  const stepData = steps[window.currentTourStep];
  if (!stepData) return;

  const narration = `${stepData.title}. ${stepData.description} ${stepData.usability} Tip: ${stepData.tip.replace('💡', '')}`;

  if (typeof window.playAudio === 'function') {
    window.playAudio(narration);
  } else if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  }
}

/**
 * Closes the tour, removes highlights, and records completion
 */
function finishOnboardingTour() {
  window.isTourActive = false;
  window.showOnboardingTour = false;

  const cutout = document.getElementById('tourSpotlightCutout');
  const pointerCard = document.getElementById('tourPointerCard');
  const beacon = document.getElementById('tourPointerBeacon');

  if (cutout) cutout.classList.add('hidden');
  if (pointerCard) pointerCard.classList.add('hidden');
  if (beacon) beacon.classList.add('hidden');

  // Remove focus ring from target
  document.querySelectorAll('.tour-target-focused').forEach(el => {
    el.classList.remove('tour-target-focused');
  });

  // Stop any ongoing speech narration
  if (typeof window.stopAudio === 'function') {
    window.stopAudio();
  } else if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  try {
    sessionStorage.setItem('carelens_tour_dismissed', 'true');
  } catch (e) {}

  notifyTourCompletion();
}

/**
 * Skips the tour
 */
function skipOnboardingTour() {
  finishOnboardingTour();
}

/**
 * Persists tour completion flag to backend API
 */
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

// Keep pointer aligned on window scroll and resize
window.addEventListener('resize', () => {
  if (window.isTourActive) repositionPointer();
});

window.addEventListener('scroll', () => {
  if (window.isTourActive) repositionPointer();
}, { passive: true });

// Keyboard navigation listeners
document.addEventListener('keydown', (e) => {
  if (!window.isTourActive) return;

  if (e.key === 'Escape') {
    skipOnboardingTour();
  } else if (e.key === 'ArrowRight') {
    nextTourStep();
  } else if (e.key === 'ArrowLeft') {
    prevTourStep();
  }
});

// Auto-launch tour on page load if flagged for first-time login/signup
window.addEventListener('DOMContentLoaded', () => {
  if (window.showOnboardingTour) {
    let alreadyDismissed = false;
    try {
      alreadyDismissed = sessionStorage.getItem('carelens_tour_dismissed') === 'true';
    } catch (e) {}

    if (!alreadyDismissed) {
      setTimeout(() => {
        startOnboardingTour();
      }, 700);
    }
  }
});
