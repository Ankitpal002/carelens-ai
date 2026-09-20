"""
Senior Speech Synthesis & Hearing Accessibility Service.
"""

from typing import Dict, Any


class SpeechCompanionService:
    """
    Service for speech synthesis calibration (BCP-47 language codes, tempo, and pitch).
    """

    LANGUAGE_BCP47_MAP = {
        'English': 'en-US',
        'Hindi': 'hi-IN',
        'Marathi': 'mr-IN',
        'Tamil': 'ta-IN',
        'Telugu': 'te-IN',
        'Bengali': 'bn-IN',
        'Kannada': 'kn-IN',
        'Malayalam': 'ml-IN',
        'Gujarati': 'gu-IN',
        'Punjabi': 'pa-IN',
        'Urdu': 'ur-IN',
        'Arabic': 'ar-SA',
        'Spanish': 'es-ES'
    }

    @classmethod
    def get_speech_config(cls, language: str = 'English', pace: float = 0.88) -> Dict[str, Any]:
        """
        Returns client-side audio engine calibration configuration.
        """
        bcp47_code = cls.LANGUAGE_BCP47_MAP.get(language, 'en-US')
        return {
            'language': language,
            'bcp47': bcp47_code,
            'rate': pace,
            'pitch': 1.0,
            'volume': 1.0,
            'senior_optimized': True,
        }
