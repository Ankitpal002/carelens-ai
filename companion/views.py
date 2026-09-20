"""
Django views for CareLens AI companion web interface.
"""

from django.shortcuts import render, redirect
from django.views.generic import TemplateView, View
from django.http import JsonResponse, HttpRequest, HttpResponse
from .models import SeniorProfile, CaregiverContact, ScanRecord
from .services.gemini_service import GeminiVisionService
from .services.speech_service import SpeechCompanionService
from .utils.localization import get_translations_for_language


class HomeCompanionView(TemplateView):
    """
    Main senior dashboard and camera capture view.
    """
    template_name = 'companion/index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        profile = SeniorProfile.objects.first()
        if not profile:
            profile = SeniorProfile.objects.create(name='Senior User', preferred_language='English')

        caregiver = CaregiverContact.objects.filter(is_primary=True).first()
        
        context.update({
            'profile': profile,
            'primary_caregiver': caregiver,
            'speech_config': SpeechCompanionService.get_speech_config(profile.preferred_language),
            'translations': get_translations_for_language(profile.preferred_language),
            'languages': [
                ('English', '🌐 English'),
                ('Hindi', '🇮🇳 हिन्दी'),
                ('Marathi', '🇮🇳 मराठी'),
                ('Tamil', '🇮🇳 தமிழ்'),
                ('Telugu', '🇮🇳 తెలుగు'),
                ('Bengali', '🇮🇳 বাংলা'),
                ('Kannada', '🇮🇳 ಕನ್ನಡ'),
                ('Malayalam', '🇮🇳 മലയാളം'),
                ('Gujarati', '🇮🇳 ગુજરાતી'),
                ('Punjabi', '🇮🇳 ਪੰਜਾਬੀ'),
                ('Urdu', '🇮🇳 اردو'),
                ('Arabic', '🌍 العربية'),
                ('Spanish', '🌍 Español')
            ]
        })
        return context


class HealthCheckView(View):
    """
    Service health check endpoint.
    """
    def get(self, request: HttpRequest) -> HttpResponse:
        return JsonResponse({
            'status': 'healthy',
            'service': 'CareLens AI Senior Companion',
            'version': '2.0.0',
            'framework': 'Django 5.1 / Python 3.14',
            'genai_engine': 'Google Gemini 2.5/3.6 Flash'
        })
