"""
Google Gemini Multimodal Generative AI Vision & Reasoning Service.
Calibrated specifically for senior citizen cognitive and visual assistance.
"""

import os
import json
import logging
import base64
from typing import Dict, Any, Optional
from django.conf import settings

logger = logging.getLogger(__name__)


class GeminiVisionService:
    """
    Multimodal Vision & Reasoning Service utilizing Google Gemini Generative AI SDK.
    """

    DEFAULT_MODEL = getattr(settings, 'GEMINI_MODEL', 'gemini-2.5-flash')

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or getattr(settings, 'GEMINI_API_KEY', '') or os.getenv('GEMINI_API_KEY', '')
        self._client = None
        self._init_sdk()

    def _init_sdk(self):
        """
        Initialize Google GenAI SDK client.
        """
        if not self.api_key:
            logger.warning("GeminiVisionService initialized without API key. Operating in Demo/Fallback mode.")
            return

        try:
            # Modern Google GenAI SDK (google.genai)
            import google.genai as genai
            self._client = genai.Client(api_key=self.api_key)
            logger.info("Google GenAI client successfully initialized.")
        except ImportError:
            try:
                # Legacy Google GenerativeAI SDK fallback
                import google.generativeai as legacy_genai
                legacy_genai.configure(api_key=self.api_key)
                self._client = legacy_genai.GenerativeModel(self.DEFAULT_MODEL)
                logger.info("Google GenerativeAI legacy SDK initialized.")
            except ImportError:
                logger.error("Neither google-genai nor google-generativeai is installed.")

    def analyze_image(self, image_base64: str, mime_type: str = 'image/jpeg', language: str = 'English') -> Dict[str, Any]:
        """
        Perform multimodal visual analysis on a captured image.
        Returns structured JSON output according to Senior Companion contract.
        """
        if not self.api_key or not self._client:
            logger.info("Using simulated AI response for demo/test mode.")
            return self.get_simulation_preset('medication', language)

        system_instruction = f"""You are CareLens AI, an exceptionally empathetic visual companion for senior citizens (aged 70+).
You can recognize ANY item, medicine bottle, utility bill, appliance dial, food expiration, or suspicious letter.
CRITICAL REQUIREMENT: Respond ENTIRELY in {language}. Every single word of your response must be in {language}.

Return a STRICT JSON object with NO Markdown formatting and NO code fences:
{{
  "classification": "MEDICATION" | "BILLING" | "SECURITY_CHECK" | "APPLIANCE" | "FOOD" | "NOTICE" | "GENERAL",
  "summary": "1-2 short, compassionate sentences in {language} explaining what this is and what to do (6th grade reading level).",
  "safetyVerdict": "SAFE" | "SCAM" | "CAUTION",
  "safetyExplanation": "One clear sentence in {language} explaining the safety assessment.",
  "actionItems": {{
    "primaryField": "Key action label in {language}",
    "primaryValue": "Key extracted value (e.g., dosage, amount due)",
    "secondaryField": "Secondary label in {language}",
    "secondaryValue": "Secondary value (e.g., time to take, due date)"
  }},
  "caregiverMessage": "A warm, helpful 1-line WhatsApp message in {language} for family caregivers."
}}"""

        try:
            # Check SDK type and execute
            import google.genai as genai
            if isinstance(self._client, genai.Client):
                response = self._client.models.generate_content(
                    model=self.DEFAULT_MODEL,
                    contents=[
                        system_instruction,
                        genai.types.Part.from_bytes(
                            data=base64.b64decode(image_base64),
                            mime_type=mime_type,
                        ),
                    ],
                    config=genai.types.GenerateContentConfig(
                        temperature=0.2,
                        response_mime_type="application/json",
                    )
                )
                raw_text = response.text
            else:
                # Legacy SDK execution
                response = self._client.generate_content(
                    [
                        system_instruction,
                        {"mime_type": mime_type, "data": image_base64}
                    ],
                    generation_config={"temperature": 0.2}
                )
                raw_text = response.text

            return self._parse_json_response(raw_text)

        except Exception as exc:
            logger.error(f"Gemini Vision API execution error: {exc}", exc_info=True)
            raise RuntimeError(f"AI Vision Analysis failed: {str(exc)}") from exc

    def answer_senior_question(self, question: str, image_base64: Optional[str] = None, context: Optional[str] = None, language: str = 'English') -> str:
        """
        Context-aware follow-up conversational reasoning for senior queries.
        """
        if not self.api_key or not self._client:
            return f"CareLens Answer ({language}): Please take this medication exactly with your evening dinner as prescribed."

        prompt = f"""Context: {context or 'User has scanned an everyday document or item.'}
The senior user is asking: "{question}"
Please answer in {language} in 2-3 simple, compassionate sentences suitable for a 75-year-old person. Be direct, clear, and reassuring."""

        try:
            import google.genai as genai
            if isinstance(self._client, genai.Client):
                contents = [prompt]
                if image_base64:
                    contents.append(genai.types.Part.from_bytes(data=base64.b64decode(image_base64), mime_type='image/jpeg'))
                res = self._client.models.generate_content(model=self.DEFAULT_MODEL, contents=contents)
                return res.text.strip()
            else:
                res = self._client.generate_content(prompt)
                return res.text.strip()
        except Exception as exc:
            logger.error(f"Gemini Q&A error: {exc}")
            return f"I could not retrieve an answer at this moment. Please consult your family caregiver or doctor."

    def _parse_json_response(self, raw_text: str) -> Dict[str, Any]:
        """
        Defensive parser for Gemini JSON outputs with markdown stripping.
        """
        cleaned = raw_text.replace("```json", "").replace("```", "").strip()
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as err:
            logger.error(f"Failed to parse JSON response: {cleaned}")
            raise ValueError(f"Invalid JSON received from Gemini: {err}") from err

    @staticmethod
    def get_simulation_preset(preset_type: str = 'medication', language: str = 'English') -> Dict[str, Any]:
        """
        Built-in interactive simulation presets for zero-friction testing.
        """
        presets = {
            'medication': {
                "classification": "MEDICATION",
                "summary": "This is your Metformin medication for blood sugar. Take one tablet with your evening dinner.",
                "safetyVerdict": "SAFE",
                "safetyExplanation": "Authentic prescription label from Walgreens Pharmacy.",
                "actionItems": {
                    "primaryField": "Prescription Dosage",
                    "primaryValue": "1 Tablet (500mg)",
                    "secondaryField": "Best Time to Take",
                    "secondaryValue": "With Evening Dinner"
                },
                "caregiverMessage": "Hi, Dad scanned his Metformin bottle: Take 1 tablet with dinner. Everything looks safe!"
            },
            'billing': {
                "classification": "BILLING",
                "summary": "This is your City Power electricity bill for October. The total amount due is $42.50 by October 12th.",
                "safetyVerdict": "SAFE",
                "safetyExplanation": "Official utility statement from City Power & Light.",
                "actionItems": {
                    "primaryField": "Total Amount Due",
                    "primaryValue": "$42.50",
                    "secondaryField": "Due Date",
                    "secondaryValue": "October 12th"
                },
                "caregiverMessage": "Hi, Mom scanned her electric bill: $42.50 due Oct 12th. Just letting you know!"
            },
            'scam': {
                "classification": "SECURITY_CHECK",
                "summary": "Warning: this letter is a fake scam trying to frighten you into sending money. Do not call this number and do not wire money.",
                "safetyVerdict": "SCAM",
                "safetyExplanation": "Scam Alert: Threatens immediate utility shutoff and demands untraceable wire transfer.",
                "actionItems": {
                    "primaryField": "Safety Warning",
                    "primaryValue": "DO NOT PAY",
                    "secondaryField": "Danger Reason",
                    "secondaryValue": "Fake Wire Transfer Demand"
                },
                "caregiverMessage": "URGENT: Mom scanned a suspicious letter demanding wire transfer. CareLens flagged it as a SCAM. Please check in with her."
            }
        }
        return presets.get(preset_type, presets['medication'])
