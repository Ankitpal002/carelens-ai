"""
Django views for CareLens AI companion web interface and authentication.
"""

import logging
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.generic import TemplateView, View, FormView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse, HttpRequest, HttpResponse

from .models import SeniorProfile, CaregiverContact, ScanRecord
from .forms import UserSignUpForm, UserLoginForm
from .services.gemini_service import GeminiVisionService
from .services.speech_service import SpeechCompanionService
from .utils.localization import get_translations_for_language

logger = logging.getLogger(__name__)


class HomeCompanionView(TemplateView):
    """
    Main senior dashboard and camera capture view.
    """
    template_name = 'companion/index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        profile = None
        show_tour = False

        if user.is_authenticated:
            # Get or create profile for authenticated user
            profile = getattr(user, 'senior_profile', None)
            if not profile:
                profile = SeniorProfile.objects.create(
                    user=user,
                    name=user.first_name or user.username,
                    preferred_language='English',
                    has_completed_tour=False
                )
            # Check if user needs the first-time tour
            if not profile.has_completed_tour or self.request.session.get('just_logged_in_show_tour', False):
                show_tour = True
        else:
            # Guest profile fallback
            profile = SeniorProfile.objects.filter(user__isnull=True).first()
            if not profile:
                profile = SeniorProfile.objects.create(
                    name='Senior Guest',
                    preferred_language='English',
                    has_completed_tour=False
                )
            # Show tour if guest specifically triggered it in session
            if self.request.session.get('just_logged_in_show_tour', False):
                show_tour = True

        caregiver = None
        if profile:
            caregiver = profile.caregivers.filter(is_primary=True).first()
        if not caregiver:
            caregiver = CaregiverContact.objects.filter(is_primary=True).first()

        context.update({
            'profile': profile,
            'primary_caregiver': caregiver,
            'show_tour': show_tour,
            'speech_config': SpeechCompanionService.get_speech_config(profile.preferred_language if profile else 'English'),
            'translations': get_translations_for_language(profile.preferred_language if profile else 'English'),
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


class SignUpView(View):
    """
    Accessible Senior and Caregiver Registration View.
    """
    template_name = 'registration/signup.html'

    def get(self, request: HttpRequest) -> HttpResponse:
        if request.user.is_authenticated:
            return redirect('companion:home')
        form = UserSignUpForm()
        return render(request, self.template_name, {'form': form})

    def post(self, request: HttpRequest) -> HttpResponse:
        if request.user.is_authenticated:
            return redirect('companion:home')

        form = UserSignUpForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            email = form.cleaned_data.get('email', '')
            password = form.cleaned_data['password']
            name = form.cleaned_data['name']
            role = form.cleaned_data['role']
            preferred_language = form.cleaned_data['preferred_language']

            # Create User
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=name
            )

            # Create linked SeniorProfile
            SeniorProfile.objects.create(
                user=user,
                name=name,
                role=role,
                preferred_language=preferred_language,
                has_completed_tour=False
            )

            # Log the user in immediately
            login(request, user)
            request.session['just_logged_in_show_tour'] = True
            messages.success(request, f"Welcome to CareLens AI, {name}! Let's walk you through the key features.")
            return redirect('companion:home')

        return render(request, self.template_name, {'form': form})


class LoginView(View):
    """
    Accessible Senior and Caregiver Login View.
    """
    template_name = 'registration/login.html'

    def get(self, request: HttpRequest) -> HttpResponse:
        if request.user.is_authenticated:
            return redirect('companion:home')
        form = UserLoginForm()
        return render(request, self.template_name, {'form': form})

    def post(self, request: HttpRequest) -> HttpResponse:
        if request.user.is_authenticated:
            return redirect('companion:home')

        form = UserLoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                profile = getattr(user, 'senior_profile', None)
                if not profile:
                    profile = SeniorProfile.objects.create(
                        user=user,
                        name=user.first_name or user.username,
                        preferred_language='English',
                        has_completed_tour=False
                    )

                # If first time or tour not completed, trigger guide
                if not profile.has_completed_tour:
                    request.session['just_logged_in_show_tour'] = True

                messages.success(request, f"Welcome back, {profile.name}!")
                return redirect('companion:home')
            else:
                messages.error(request, "Invalid username or password. Please check and try again.")

        return render(request, self.template_name, {'form': form})


class LogoutView(View):
    """
    Logs out the user and redirects back to home with confirmation.
    """
    def get(self, request: HttpRequest) -> HttpResponse:
        logout(request)
        messages.info(request, "You have been logged out. You can continue as guest or log in again.")
        return redirect('companion:home')

    def post(self, request: HttpRequest) -> HttpResponse:
        return self.get(request)


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

