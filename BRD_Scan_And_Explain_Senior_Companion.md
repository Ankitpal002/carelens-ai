# BUSINESS REQUIREMENTS DOCUMENT (BRD)

**Project Name:** CareLens AI (Scan & Explain for Seniors)  
**Document Version:** 1.0  
**Target Milestone:** Hackathon MVP & Production Prototype  
**Date:** September 2026  
**Status:** Approved for Implementation  

---

## 1. Executive Summary & Vision

### 1.1 Executive Summary
As the world shifts aggressively toward digital-first interactions, senior citizens (aged 60+) and grandparents face a widening "digital exclusion gap." Everyday tasks—such as decoding medical prescriptions, understanding complex utility bills, verifying unexpected financial notices, or identifying phishing messages—cause high anxiety, dependency on busy relatives, and elevated vulnerability to scams.

**CareLens AI** is an intelligent, camera-first multimodal companion specifically engineered for seniors. By allowing users to simply point their phone or webcam camera at **any physical object, appliance dial, grocery label, prescription bottle, electric bill, or suspicious letter**, the system uses Generative AI (Vision + Language + Audio) to instantly:
1. Provide a **2-sentence, jargon-free voice and text explanation** ("What is this and what should I do?").
2. Surface **instant high-contrast Action Cards** (e.g., "Pay $42.50 by Oct 12", "Turn microwave knob to defrost", "Take 1 pill with food at 8 PM").
3. Deliver an instant **Scam & Safety Trust Shield** (Safe to use, Expiration warning, or Fraud alert).
4. Enable a **1-tap "Share with Family / Caregiver" safety net**.

### 1.2 Product Vision
> *"To eliminate technology-induced anxiety for grandparents worldwide by turning any physical object, paper, or screen into clear, gentle, spoken human guidance with a single tap."*

---

## 2. Problem Statement & Demographics Analysis

### 2.1 The Core Problem
- **Sensory & Cognitive Decline:** Decreased visual acuity (presbyopia, macular degeneration, cataracts), mild cognitive load fatigue, and fine motor tremors make navigating mobile menus and reading 8pt font fine print daunting.
- **Information Overload:** Documents like utility statements, hospital bills, and government notices are deliberately verbose, using bureaucratic jargon, disclaimers, and hidden fee structures.
- **Medication Non-Adherence & Safety Risks:** Over 50% of seniors take 4+ daily medications. Reading small labels on cylindrical amber bottles leads to dosage mistakes or missed interactions.
- **Scam Epidemic:** Fraudsters target older demographics via SMS, mail, and urgent fake utility notices. Seniors often cannot distinguish genuine notices from spoofed threats.
- **The Dependency Guilt Cycle:** Seniors hesitate to call their children or caregivers repeatedly for minor daily inquiries, leading to delayed bill payments, untreated ailments, or feelings of isolation.

### 2.2 Target Demographics & User Personas

| Persona Attribute | Persona 1: "Grandma Clara" (The Careful Homemaker) | Persona 2: "Grandpa Arthur" (The Independent Veteran) |
| :--- | :--- | :--- |
| **Age & Profile** | 76 years old, lives alone, mild glaucoma, uses WhatsApp & Phone calls. | 82 years old, hand tremors, uses reading glasses, manages multiple prescriptions. |
| **Key Challenge** | Panics whenever an SMS or letter mentions "account suspension" or "unpaid dues". | Struggles to decipher prescription instructions printed on tiny prescription labels. |
| **Tech Literacy** | Low; gets confused by burger menus, passwords, and multi-step dialogs. | Basic; can click a single green button, prefers listening over reading screen text. |
| **Emotional State**| Doesn't want to be a burden on her daughter; fears being cheated. | Values his independence; fears accidentally taking the wrong dose. |
| **Winning Outcome**| Snaps a photo of an SMS/letter; CareLens says: *"Clara, this is a scam asking for money. Do not click. You owe nothing."* | Snaps a photo of his medicine bottle; CareLens speaks: *"Take one white pill with dinner. Do not take on an empty stomach."* |

---

## 3. Scope of Work

### 3.1 In-Scope (Hackathon MVP)
- **Zero-Friction Camera & Upload Interface:** One-tap high-contrast camera trigger, auto-focus guideline, drag-and-drop or gallery file upload.
- **Multimodal Document Classification:** Auto-detects whether the image is:
  1. *Medication / Prescription Bottle*
  2. *Utility / Medical Bill*
  3. *Suspicious SMS / Email / Postal Letter (Scam check)*
  4. *General Notice / Form*
- **"Explain Like I'm 75" GenAI Distillation Engine:** Strict constraint of 2 clear sentences, 6th-grade reading level, and 0% technical/bureaucratic jargon.
- **Key Action Extraction:** Highlights only top 1–3 critical facts (Date, Amount, Dosage, Scam Risk) in 32pt+ typography.
- **Natural Voice Readout (TTS):** Warm, patient, slower-paced (0.85x–0.9x speed) voice synthesis with instant Play/Pause.
- **Scam Trust Badge:** High-visibility color indicator (Green = Safe/Official, Red = Scam Alert, Amber = Verification Needed).
- **One-Tap "Send to Family" Link:** Generates an instant WhatsApp/SMS message summary for the user's primary caregiver.
- **Image Quality Assistant:** Voice feedback if the photo is blurry, too dark, or cut off ("Please hold steady and retake with more light").

### 3.2 Out-of-Scope (Future Post-Hackathon Roadmap)
- Direct automated in-app bank bill payments (requires banking aggregator licensing).
- Automated electronic health record (EHR) sync.
- Wearable/Smart glass live streaming.

---

## 4. Functional Requirements (FR)

### FR-1: Accessible Senior-First Capture Interface
- **FR-1.1:** The primary landing screen must feature a giant, high-contrast action button labeled **"Scan Document / Take Photo"** taking at least 40% of the screen viewport.
- **FR-1.2:** Support direct camera capture (environment camera on mobile) as well as gallery/file upload (for screenshots of text messages or e-bills).
- **FR-1.3:** Provide a fallback toggle for **"Upload Photo from Gallery"** with clear iconography (magnifying glass + picture icon).
- **FR-1.4:** Real-time camera assist: Provide haptic vibration and clear visual framing borders indicating optimal distance.

### FR-2: Multimodal Image Analysis & Auto-Classification
- **FR-2.1:** Send the captured image to a high-accuracy multimodal Vision LLM (e.g., Google Gemini 1.5/2.0 Flash with Vision).
- **FR-2.2:** Automatically categorize the subject into one of four domain workflows:
  1. `MEDICATION`: Pill bottles, prescription slips, medicine boxes.
  2. `BILLING`: Electricity, water, gas, telecom, clinic statements.
  3. `SECURITY_CHECK`: Letters, text messages, lottery notices, urgent bank alerts.
  4. `GENERAL_NOTICE`: Community circulars, postal letters, instructions.
- **FR-2.3:** Blurriness & Legibility Safeguard: If the image cannot be decoded with >85% confidence, do NOT hallucinate. Instead, prompt with a friendly voice: *"This photo is a bit blurry. Let's try taking it again with brighter light."*

### FR-3: "Explain Like I'm 75" Distillation Engine
- **FR-3.1 (2-Sentence Rule):** The primary explanation must be strictly capped at **maximum two concise sentences** highlighting what it is and what action is required.
- **FR-3.2 (Tone & Vocabulary):**
  - Use conversational, respectful, reassuring language.
  - Zero jargon (replace "due date" with "pay before", "contraindicated" with "do not mix with", "phishing" with "fake trick message").
- **FR-3.3 (Large Type Display):** Display the summary in minimum 24px–28px font size with high-contrast text on off-white/dark background.

### FR-4: Visual Action Cards & Key Data Extraction
The system must render structured, card-based visual widgets below the summary:

| Document Type | Extracted Fields Required | Visual Highlight |
| :--- | :--- | :--- |
| **Utility / Medical Bill** | • Exact Total Amount Due<br>• Final Due Date<br>• Payee Name (Who to pay) | Huge Currency Badge ($/₹), Calendar icon with remaining days count. |
| **Medication Bottle** | • Drug Name & Purpose<br>• Exact Dosage (How many pills)<br>• Timing & Food condition (e.g. "After dinner") | Clock/Sun/Moon icon, Pill count visual, Bold warning icon if critical. |
| **Suspicious Message** | • Scam Probability Score (High/Low)<br>• Why it is fake (Red flags)<br>• What NOT to do ("Do not click link") | Full-width **Green Shield** ("Safe") or **Red Warning Siren** ("Scam"). |
| **General Letter** | • Sender Identity<br>• Main Request<br>• Follow-up deadline | Clean bullet points with high readability. |

### FR-5: Voice-First Accessible Audio Engine (TTS)
- **FR-5.1:** Automatic or 1-tap playback of the 2-sentence explanation using speech synthesis (Web Speech API or neural TTS).
- **FR-5.2:** Pitch and tempo calibrated specifically for seniors: rate set between `0.85x` and `0.9x`, with crisp consonants and warm timbre.
- **FR-5.3:** Large, sticky floating **"Read to Me" / "Stop Voice"** button with dynamic audio visualizer or speaker wave animation.
- **FR-5.4:** Multi-language & vernacular support (English, Spanish, Hindi, etc.) based on detected device language or 1-tap language switch.

### FR-6: Scam & Urgency Detection ("Is This Safe?")
- **FR-6.1:** Analyze scanned text for predatory psychological triggers: artificial urgency ("within 24 hours"), demands for gift cards/wire transfers, fake lottery wins, bank password requests.
- **FR-6.2:** Explicit verdict card:
  - 🟢 **VERIFIED SAFE:** Recognized utility company or official sender.
  - 🔴 **DANGER - SCAM DETECTED:** Clear directive: *"This is a scam. Nobody is shutting down your power. You do not need to pay."*
  - 🟡 **PROCEED WITH CAUTION:** Unknown sender or unverifiable claims.

### FR-7: "Ask a Follow-Up" Senior Voice Interaction
- **FR-7.1:** Offer simple 1-tap voice prompt suggestions:
  - 🎙️ *"Is this safe to pay?"*
  - 🎙️ *"When should I take this pill?"*
  - 🎙️ *"Can you explain this in simpler words?"*
- **FR-7.2:** Senior can tap the mic button, speak any question, and receive an instant 1-sentence spoken answer.

### FR-8: Caregiver Bridge (Safety Net Dispatch)
- **FR-8.1:** Single button labeled **"Share with Family"** or **"Send to Son/Daughter"**.
- **FR-8.2:** Automatically formats a clean WhatsApp / SMS draft containing:
  - *Image thumbnail*
  - *CareLens 2-sentence summary*
  - *One-tap approval question: "Mom scanned this bill. Does this look correct to you?"*

---

## 5. Non-Functional Requirements (NFR)

### 5.1 Senior Accessibility (WCAG 2.2 AAA Standards)
- **Touch Target Sizing:** Every interactive element must be at least **56px × 56px** (exceeding normal 44px) to accommodate motor tremors and unsteady touch.
- **Typography:** Minimum body font size of **20px**, headings **28px–36px**. High-legibility font families (Outfit, Inter, or Atkinson Hyperlegible).
- **Color Contrast:** Strict contrast ratio of at least **7:1** for normal text and **4.5:1** for large elements.
- **Cognitive Ergonomics:** Maximum **one primary decision per screen**. No nested dropdowns, no modal stacking, no hidden swipe gestures.
- **Haptic & Visual Confirmation:** Every tap emits an immediate visual pulse and haptic feedback.

### 5.2 Performance & Speed
- **Processing Latency:** Time from photo capture to first spoken audio word must be **< 2.5 seconds** (utilizing fast streaming LLMs like Gemini Flash).
- **Offline Resilience:** If offline, display a clear, calming notice: *"You are offline. Please reconnect to the internet so CareLens can read this."*

### 5.3 Privacy, Security & Ethics (Trust First)
- **Zero Data Harvesting:** User photos of sensitive utility bills or prescriptions must be processed in ephemeral memory and discarded immediately after session.
- **PII Redaction:** Sensitive credentials (such as Social Security Numbers, Full Credit Card numbers, or Bank Account numbers) must be masked in the visual output.
- **Medical Disclaimer:** Prominently display a gentle persistent notice: *"CareLens provides helpful guidance. Always follow your doctor or pharmacist's direct advice."*

---

## 6. System Architecture & Technical Specifications

### 6.1 System Architecture Diagram

```mermaid
flowchart TD
    subgraph Client ["Client Layer (PWA / Mobile Web)"]
        UI["Senior-First Web Interface (Large Controls, 7:1 Contrast)"]
        Cam["HTML5 Camera API / File Uploader"]
        Audio["Web Audio / Web Speech API (TTS Player & Speech Input)"]
    end

    subgraph Backend ["Application & Orchestration Layer"]
        API["Fast API / Node.js Serverless Gateway"]
        Guard["Privacy Scrubber & PII Masker"]
        PromptEngine["Senior Persona Prompt Orchestrator"]
    end

    subgraph AI_Engine ["Generative AI Layer"]
        GeminiVision["Gemini 1.5/2.0 Flash Multimodal Vision"]
        TTS["Neural Text-to-Speech Engine (Warm & Slowed 0.88x)"]
    end

    UI -->|1. Tap Capture| Cam
    Cam -->|2. Image Payload| API
    API --> Guard
    Guard --> PromptEngine
    PromptEngine -->|3. Multimodal Analysis| GeminiVision
    GeminiVision -->|4. JSON Response (Summary, Actions, Scam Rating)| API
    API -->|5. Text Payload| Audio
    API -->|6. Action Cards UI| UI
    Audio -->|7. Auto-Voice Playback| UI
```

### 6.2 Tech Stack Selection

| Layer | Recommended Technology | Justification |
| :--- | :--- | :--- |
| **Frontend** | Modern Vanilla HTML5 / CSS3 / JavaScript (or React / Next.js) | Blazing fast load time, instant compatibility across all mobile & desktop browsers, zero bloated bundle overhead. |
| **Styling** | Custom Senior-Centric Design System (CSS Custom Properties) | Precise control over font scaling (rem), AAA contrast ratios, and warm, calming color palettes. |
| **Vision & Reasoning LLM** | Google Gemini 1.5 / 2.0 Flash (Multimodal API) | Sub-second visual reasoning, native understanding of handwriting/prescription text, cost-efficient, low latency. |
| **Voice Synthesis (TTS)** | Web Speech API (`SpeechSynthesis`) + Fallback Neural TTS | Instant local speech generation with zero audio latency; voice pitch and rate configurable for senior ears. |
| **Voice Recognition (STT)** | Web Speech API (`SpeechRecognition`) | Hands-free senior questions without requiring keyboard typing. |
| **Deployment** | Vercel / Netlify / Cloudflare Pages | Edge delivery, HTTPS enabled by default (mandatory for camera access), 99.9% uptime. |

### 6.3 Prompt Engineering Strategy (The Core Secret)
The system prompt enforces strict persona parameters on the Multimodal LLM:

```text
You are CareLens, a compassionate, exceptionally clear digital assistant for senior citizens and grandparents.
Analyze the provided image carefully and produce a structured JSON output with the following rules:

1. CLASSIFICATION: Categorize into "MEDICATION", "BILLING", "SECURITY_CHECK", or "GENERAL_NOTICE".
2. TWO_SENTENCE_SUMMARY:
   - Must be EXACTLY 1 to 2 short sentences.
   - 6th-grade reading level.
   - Absolutely NO medical jargon, financial terminology, or complex acronyms.
   - Friendly and reassuring in tone.
3. ACTION_ITEMS:
   - Extract the 1-3 most critical pieces of information (e.g. Due Date, Amount, Dosage, Timing).
4. SAFETY_VERDICT:
   - For messages/letters: Evaluate if it is a SCAM or LEGITIMATE.
   - Explain in one simple sentence why.
5. FAMILY_NOTE:
   - A short one-line text that can be forwarded to a family member for verification.
```

---

## 7. User Experience & Interaction Design Guidelines

### 7.1 "The 3-Button Principle"
To prevent cognitive overload, no screen should have more than 3 primary actions:
1. **Top Bar:** Back button + Current Status indicator + Language/Audio toggle.
2. **Main Canvas:** Clear view of the photo thumbnail + High-contrast 2-sentence summary + Action cards.
3. **Bottom Sticky Bar:** Giant **"Read Aloud / Pause"** button + **"Ask a Question (Mic)"** button + **"Send to Family"** button.

### 7.2 Color Psychology for Seniors
- **Primary Action (Call-to-Action):** Deep Royal Blue (`#1A56DB`) or Forest Jade (`#0D7653`) on pure white (`#FFFFFF`) — evokes trust, stability, and high clarity.
- **Safety / Legitimacy:** Calm Emerald Green (`#059669`) with checkmark badge.
- **Scam Alert / Urgency:** Amber/Crimson Warning (`#DC2626`) with bold exclamation icon.
- **Backgrounds:** Gentle Off-White / Warm Cream (`#F8F9FA` or `#FAF8F5`) to prevent eye glare and blue-light fatigue.

### 7.3 Typography Standards
- Base font scale: `root { font-size: 18px; }`
- Headings: `28px - 36px`, font weight 700.
- Summary text: `22px - 26px`, line-height `1.6`, font weight 500.
- Touch buttons: Minimum height `64px`, font size `20px`, bold.

---

## 8. User Journey & Scenario Walkthrough

### Scenario: Grandma Clara Receives a Threatening Electricity Disconnection Notice
1. **The Fear:** Clara receives a paper notice stating: *"Final Disconnection Notice: Immediate Wire Transfer Required within 24 Hours or Power Terminated."* Her heart races.
2. **The Action:** She opens CareLens on her phone. She sees a big green button: **"Take a Photo"**. She clicks it and points at the paper.
3. **The Instant Analysis (2 seconds later):**
   - **Voice Output:** *"Clara, please don't worry. This is a fake scam letter trying to scare you. Your real electric company never asks for money by wire transfer."*
   - **Screen Display:** Giant Red Shield: 🔴 **SCAM DETECTED: DO NOT PAY**.
   - **Action Card:** "Reason: Wire transfer demand. Fake sender address."
4. **The Peace of Mind:** Clara taps the button **"Send to Daughter Mary"**. A pre-filled WhatsApp message opens with the photo and summary. Mary replies in 2 minutes: *"Mom, thank goodness you scanned that. It's totally fake. I already paid your real bill last week!"*

---

## 9. Key Metrics & Success Criteria

### 9.1 Hackathon Evaluation Matrix Alignment

| Evaluation Pillar | How CareLens AI Wins the Category |
| :--- | :--- |
| **Innovation & GenAI Depth** | Moves beyond passive text chatbots to proactive multimodal vision + emotional speech synthesis + safety classification. |
| **Inclusivity & Empathy** | Specifically engineered for physical/cognitive constraints of seniors (motor tremor tolerance, WCAG AAA, 2-sentence clarity). |
| **Real-World Impact** | Directly prevents elder financial scam losses and fatal medication dosing errors. |
| **Completeness & Usability** | Working end-to-end prototype: Upload/Capture -> AI Reasoning -> Spoken Audio + Action Cards + Caregiver sharing. |

### 9.2 Measurable Performance Indicators (KPIs)
- **Cognitive Readability Score:** Flesch-Kincaid Grade Level <= 6.0 across all generated summaries.
- **Time-to-Clarity:** < 5 seconds total from photo snap to comprehension by the senior.
- **Scam Detection Accuracy:** > 95% detection rate on known elder scam patterns.
- **Senior SUS (System Usability Scale):** Target score > 85/100 in user testing sessions.

---

## 10. Hackathon Implementation & Delivery Plan

### Phase 1: Foundation & UI Design System (Hour 0 - Hour 4)
- Set up high-contrast responsive layout with large touch targets.
- Implement HTML5 Camera capture with live viewfinder and gallery fallback.
- Configure Web Speech API audio synthesis with senior-calibrated pitch and speed.

### Phase 2: Multimodal GenAI Integration (Hour 4 - Hour 10)
- Integrate Gemini Multimodal Vision API.
- Refine system prompt with structured JSON output schema (Classification, 2-Sentence Summary, Action Cards, Scam Rating).
- Implement robust error handling (blurry image detection, low-light recovery).

### Phase 3: Action Cards & Caregiver Sharing (Hour 10 - Hour 16)
- Build dynamic Action Card renderers for Medication, Utility Bills, and Scams.
- Implement 1-tap "Share with Family" WhatsApp / SMS intent link.
- Build interactive voice follow-up microphone widget.

### Phase 4: Polish, Testing & Demo Presentation (Hour 16 - Hour 24)
- Test with real-world sample documents (prescription bottles, electricity bills, phishing SMS screenshots).
- Verify WCAG AAA color contrast and font scaling.
- Prepare live demo script showcasing Grandma Clara & Grandpa Arthur user stories.

---

*Document approved by Product Engineering & Ready for Hackathon Execution.*
