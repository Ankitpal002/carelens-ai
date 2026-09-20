"""
REST API Views for CareLens AI companion.
Provides JSON endpoints for Gemini Vision image analysis, voice Q&A, and settings.
"""

import json
import logging
from django.http import JsonResponse, HttpRequest, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from .services.gemini_service import GeminiVisionService
from .models import ScanRecord, CaregiverContact

logger = logging.getLogger(__name__)


@require_POST
def analyze_image_api(request: HttpRequest) -> JsonResponse:
    """
    POST /api/analyze/
    Receives base64 image data and returns structured multimodal analysis.
    """
    try:
        body = json.loads(request.body.decode('utf-8'))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return HttpResponseBadRequest("Invalid JSON body.")

    image_base64 = body.get('image_base64', '')
    api_key = body.get('api_key', None)
    language = body.get('language', 'English')
    mime_type = body.get('mime_type', 'image/jpeg')

    if not image_base64:
        return HttpResponseBadRequest("Missing required 'image_base64' parameter.")

    try:
        service = GeminiVisionService(api_key=api_key)
        result = service.analyze_image(image_base64=image_base64, mime_type=mime_type, language=language)

        # Record scan history in database
        try:
            ScanRecord.objects.create(
                classification=result.get('classification', 'GENERAL'),
                summary_text=result.get('summary', ''),
                safety_verdict=result.get('safetyVerdict', 'SAFE'),
                safety_explanation=result.get('safetyExplanation', ''),
                primary_action_label=result.get('actionItems', {}).get('primaryField', ''),
                primary_action_value=result.get('actionItems', {}).get('primaryValue', ''),
                secondary_action_label=result.get('actionItems', {}).get('secondaryField', ''),
                secondary_action_value=result.get('actionItems', {}).get('secondaryValue', ''),
                caregiver_message=result.get('caregiverMessage', ''),
                language_used=language
            )
        except Exception as db_err:
            logger.warning(f"Failed to persist scan record to database: {db_err}")

        return JsonResponse({'success': True, 'data': result})

    except Exception as exc:
        logger.error(f"Image analysis error: {exc}", exc_info=True)
        return JsonResponse({'success': False, 'error': str(exc)}, status=500)


@require_POST
def ask_question_api(request: HttpRequest) -> JsonResponse:
    """
    POST /api/ask-question/
    Processes senior follow-up question with context and returns voice/text answer.
    """
    try:
        body = json.loads(request.body.decode('utf-8'))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return HttpResponseBadRequest("Invalid JSON payload.")

    question = body.get('question', '').strip()
    image_base64 = body.get('image_base64', None)
    context = body.get('context', None)
    language = body.get('language', 'English')
    api_key = body.get('api_key', None)

    if not question:
        return HttpResponseBadRequest("Question parameter is required.")

    service = GeminiVisionService(api_key=api_key)
    answer = service.answer_senior_question(
        question=question,
        image_base64=image_base64,
        context=context,
        language=language
    )

    return JsonResponse({'success': True, 'answer': answer})


@require_GET
def get_preset_api(request: HttpRequest, preset_type: str) -> JsonResponse:
    """
    GET /api/presets/<preset_type>/
    Returns preloaded simulation preset data (medication, billing, scam).
    """
    language = request.GET.get('language', 'English')
    data = GeminiVisionService.get_simulation_preset(preset_type, language)
    return JsonResponse({'success': True, 'data': data})


@require_POST
def save_caregiver_api(request: HttpRequest) -> JsonResponse:
    """
    POST /api/save-caregiver/
    Saves primary caregiver phone number.
    """
    try:
        body = json.loads(request.body.decode('utf-8'))
        phone = body.get('phone_number', '').strip().replace(' ', '')
        if not phone:
            return HttpResponseBadRequest("Phone number is required.")

        contact, _ = CaregiverContact.objects.get_or_create(is_primary=True)
        contact.phone_number = phone
        contact.save()
        return JsonResponse({'success': True, 'phone_number': phone})
    except Exception as exc:
        return JsonResponse({'success': False, 'error': str(exc)}, status=500)


@require_POST
def complete_tour_api(request: HttpRequest) -> JsonResponse:
    """
    POST /api/complete-tour/
    Marks the onboarding guide/tour as completed for the senior user.
    """
    try:
        # Clear session first-time tour flag
        request.session['just_logged_in_show_tour'] = False
        request.session['tour_completed'] = True

        if request.user.is_authenticated:
            profile = getattr(request.user, 'senior_profile', None)
            if profile:
                profile.has_completed_tour = True
                profile.save(update_fields=['has_completed_tour'])

        return JsonResponse({'success': True, 'message': 'Onboarding guide completed successfully.'})
    except Exception as exc:
        logger.error(f"Error completing onboarding tour: {exc}")
        return JsonResponse({'success': False, 'error': str(exc)}, status=500)

