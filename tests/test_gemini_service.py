"""
Unit tests for GeminiVisionService and Multimodal Generative AI reasoning.
"""

import unittest
from companion.services.gemini_service import GeminiVisionService
from companion.services.speech_service import SpeechCompanionService


class GeminiServiceTestCase(unittest.TestCase):
    """
    Test suite for Gemini AI integration, fallback presets, and parser defense.
    """

    def setUp(self):
        self.service = GeminiVisionService(api_key=None)

    def test_service_initialization(self):
        """Test service initializes safely even without an API key."""
        self.assertIsNotNone(self.service)

    def test_simulation_presets_medication(self):
        """Test medication simulation preset contract."""
        data = self.service.get_simulation_preset('medication', 'English')
        self.assertEqual(data['classification'], 'MEDICATION')
        self.assertEqual(data['safetyVerdict'], 'SAFE')
        self.assertIn('Metformin', data['summary'])
        self.assertIn('primaryField', data['actionItems'])

    def test_simulation_presets_billing(self):
        """Test utility bill simulation preset contract."""
        data = self.service.get_simulation_preset('billing', 'English')
        self.assertEqual(data['classification'], 'BILLING')
        self.assertEqual(data['safetyVerdict'], 'SAFE')
        self.assertIn('$42.50', data['summary'])

    def test_simulation_presets_scam(self):
        """Test scam detection simulation preset contract."""
        data = self.service.get_simulation_preset('scam', 'English')
        self.assertEqual(data['classification'], 'SECURITY_CHECK')
        self.assertEqual(data['safetyVerdict'], 'SCAM')
        self.assertIn('scam', data['summary'].lower())

    def test_json_parser_strips_markdown_fences(self):
        """Test parser strips markdown code fences safely."""
        raw_output = '```json\n{"classification": "FOOD", "summary": "Fresh milk.", "safetyVerdict": "SAFE"}\n```'
        parsed = self.service._parse_json_response(raw_output)
        self.assertEqual(parsed['classification'], 'FOOD')
        self.assertEqual(parsed['safetyVerdict'], 'SAFE')

    def test_speech_companion_service_config(self):
        """Test speech pace and BCP-47 language calibration."""
        config = SpeechCompanionService.get_speech_config('Hindi', 0.88)
        self.assertEqual(config['bcp47'], 'hi-IN')
        self.assertEqual(config['rate'], 0.88)
        self.assertTrue(config['senior_optimized'])
