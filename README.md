# 🔍 CareLens AI — The Intelligent Daily Companion for Seniors

> **A camera-first, GenAI-powered web companion empowering grandparents and older adults to navigate everyday items, medications, utility bills, and suspicious notices with confidence, voice guidance, and zero tech anxiety.**

[![WCAG 2.2 AAA](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AAA-brightgreen)](#accessibility)
[![Powered by](https://img.shields.io/badge/AI-Google%20Gemini%201.5%20Flash-blue)](https://ai.google.dev/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20HTML5%2FCSS%2FJS)-orange)](#tech-stack)

---

## 🌟 The Challenge & Vision

As the world rapidly digitizes, senior citizens and grandparents are increasingly left struggling to keep pace:
- **Tiny Print & Declining Vision:** Deciphering 8pt font on cylindrical medicine bottles or dense utility bills causes acute stress.
- **Complex Financial Notices:** Convoluted statements hide the only two things seniors care about: *How much do I owe?* and *When is it due?*
- **Scam Vulnerability:** Seniors are disproportionately targeted by predatory disconnections, fake bank warnings, and wire transfer scams.
- **Cognitive & Motor Friction:** Small buttons, dropdown menus, and swipe gestures are impossible to navigate for seniors with tremors or arthritis.

**CareLens AI** eliminates this barrier. With **one single tap**, seniors point their camera at **any object, appliance dial, medication bottle, utility bill, or letter**. CareLens instantly speaks a **2-sentence, plain-language explanation**, displays large high-contrast **Action Cards**, provides an instant **Scam Trust Shield**, and enables a 1-tap **Caregiver Safety Net** via WhatsApp.

---

## ✨ Key Features

- 📸 **Single-Button Universal Vision:** No confusing categories or menus. Point the camera at *anything* (microwave dials, remote controls, prescription labels, bills, or food items).
- 🗣️ **"Explain Like I'm 75" Voice Engine:** High-quality text-to-speech calibrated specifically for senior ears at a soothing **0.88x speed** with crystal-clear consonants.
- 🛡️ **Scam & Urgency Shield:** Instantly detects psychological manipulation (fake disconnections, wire transfer demands, gift cards) and shows a bold `VERIFIED SAFE` or `DANGER - SCAM` badge.
- 🗂️ **Massive Action Cards (28px+ Typography):** Surfaces only the essential facts (e.g., *Amount: $42.50*, *Due: Oct 12th*, or *Take 1 tablet with dinner*).
- 🎙️ **"Ask CareLens" Voice Follow-Up:** Seniors can tap the microphone to verbally ask follow-up questions (*"When should I take this?"*) and hear an immediate spoken answer.
- 💬 **1-Tap Caregiver Bridge:** Instantly formats a verification message for WhatsApp or SMS to their son or daughter with one tap.
- ♿ **WCAG 2.2 AAA Accessible:** High-contrast color palette, 64px+ touch targets, 1-tap font size magnifier (Normal $\rightarrow$ Large $\rightarrow$ Huge), and Dark High-Contrast mode.
- 💡 **Built-in Demo Presets:** Includes 3 interactive sample documents (Medicine Bottle, Electric Bill, Scam Notice) for instant testing without requiring physical documents.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** Vanilla HTML5, CSS3, JavaScript, Tailwind CSS (via CDN)
- **Design System:** Custom Senior-Centric Tokens (WCAG 2.2 AAA, Google Fonts *Outfit* & *Inter*)
- **Multimodal AI:** Google Gemini 1.5 Flash API (Structured JSON output with few-shot safety prompting)
- **Audio Synthesis:** Web Speech API (`SpeechSynthesis`) with custom tempo and pitch calibration
- **Voice Recognition:** Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`)
- **Camera Viewfinder:** HTML5 `mediaDevices.getUserMedia` with fallback to native device capture

---

## 🚀 Quick Start (Local Setup)

### Option 1: Direct Browser Launch (Simplest)
Simply double-click `index.html` in your file explorer to open it in **Google Chrome** or **Microsoft Edge**.

### Option 2: Local Server (Recommended for Live Webcam Permissions)
Run with Python:
```bash
python -m http.server 3000
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Connecting Google Gemini AI
1. Click the **⚙️ API Key** button in the top-right corner of the application.
2. Paste your **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).
3. Hit **Save Key**. Your key is stored safely in your browser's `localStorage` and never sent to any third-party server.

*(If you do not provide an API key, CareLens seamlessly operates in Demo Mode using realistic sample documents).*

---

## 📄 Documentation

For full product architecture, user personas, functional specifications, and design criteria, refer to the [Business Requirements Document (BRD)](BRD_Scan_And_Explain_Senior_Companion.md).

---

## ⚖️ License & Disclaimers

CareLens AI is designed as a daily accessibility companion. Always follow direct medical advice from your physician or pharmacist for prescriptions.
