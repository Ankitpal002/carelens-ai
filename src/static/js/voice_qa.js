/**
 * CareLens AI - Voice Question & Conversational Reasoning Module
 */

let recognition = null;
let isListening = false;

function submitTextQuestion() {
  const input = document.getElementById('questionInput');
  const q = input.value.trim();
  if (!q) return;
  document.getElementById('voiceQuestionStatus').innerText = `"${q}"`;
  answerSeniorQuestion(q);
}

function toggleSpeechQuestion() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) {
    alert('Voice input is not supported in this browser. Please type your question instead.');
    return;
  }
  if (isListening && recognition) {
    recognition.stop();
    return;
  }

  recognition = new SpeechRec();
  const langMap = {
    'English':'en-US','Hindi':'hi-IN','Marathi':'mr-IN','Tamil':'ta-IN','Telugu':'te-IN',
    'Bengali':'bn-IN','Kannada':'kn-IN','Malayalam':'ml-IN','Gujarati':'gu-IN',
    'Punjabi':'pa-IN','Urdu':'ur-IN','Arabic':'ar-SA','Spanish':'es-ES'
  };
  const activeLang = window.activeLanguage || 'English';
  recognition.lang = langMap[activeLang] || 'en-US';
  recognition.interimResults = false;

  const t = window.TRANSLATIONS ? (window.TRANSLATIONS[activeLang] || window.TRANSLATIONS['English']) : {};

  recognition.onstart = () => {
    isListening = true;
    document.getElementById('micIcon').innerText = '🛑';
    document.getElementById('voiceQuestionStatus').innerText = t.voiceStatusListening || '🎙️ Listening... speak now';
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('questionInput').value = transcript;
    document.getElementById('voiceQuestionStatus').innerText = `"${transcript}"`;
    answerSeniorQuestion(transcript);
  };

  recognition.onerror = () => {
    isListening = false;
    document.getElementById('micIcon').innerText = '🎤';
    document.getElementById('voiceQuestionStatus').innerText = t.voiceStatusError || 'Could not hear clearly. Tap mic to try again.';
  };

  recognition.onend = () => {
    isListening = false;
    document.getElementById('micIcon').innerText = '🎤';
  };

  recognition.start();
}

async function answerSeniorQuestion(question) {
  const answerBox = document.getElementById('voiceAnswerBox');
  const answerText = document.getElementById('answerText');
  const askBtn = document.getElementById('askBtnText');
  const activeLang = window.activeLanguage || 'English';
  const t = window.TRANSLATIONS ? (window.TRANSLATIONS[activeLang] || window.TRANSLATIONS['English']) : {};

  answerBox.classList.remove('hidden');
  answerText.innerText = '⏳ CareLens...';
  if (askBtn) askBtn.innerText = '...';

  // If local API key or Django API endpoint available
  try {
    const res = await fetch('/api/ask-question/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': window.getCSRFToken ? window.getCSRFToken() : ''
      },
      body: JSON.stringify({
        question: question,
        image_base64: window.currentImageBase64 || null,
        context: window.currentAnalysis ? window.currentAnalysis.summary : null,
        language: activeLang,
        api_key: window.activeApiKey || null
      })
    });

    if (res.ok) {
      const data = await res.json();
      const answer = data.answer || 'Please consult your doctor or family for specific advice.';
      answerText.innerText = answer;
      playAudio(answer);
    } else {
      answerText.innerText = 'Could not get an answer right now. Please try again.';
    }
  } catch (e) {
    answerText.innerText = 'Please connect your Gemini API key (🔑 in top toolbar) to ask real questions.';
  }

  if (askBtn) askBtn.innerText = t.askBtn || 'Ask CareLens This Question';
}
