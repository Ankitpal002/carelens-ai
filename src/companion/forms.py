"""
Forms for CareLens AI companion module.
"""

from django import forms
from .models import SeniorProfile, CaregiverContact


class ApiKeyForm(forms.Form):
    """
    Form for validating Google Gemini API Key.
    """
    api_key = forms.CharField(
        max_length=200,
        required=True,
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Paste your Gemini API key (AIzaSy...)',
            'class': 'w-full p-4 text-lg border-2 rounded-xl focus:outline-none'
        })
    )

    def clean_api_key(self):
        key = self.cleaned_data.get('api_key', '').strip()
        if not key.startswith('AIza'):
            raise forms.ValidationError("Invalid API key format. Google Gemini keys usually begin with 'AIza'.")
        return key


class CaregiverContactForm(forms.ModelForm):
    """
    Form for saving caregiver phone number for 1-tap WhatsApp sharing.
    """
    class Meta:
        model = CaregiverContact
        fields = ['name', 'relationship', 'phone_number']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'w-full p-3 border-2 rounded-xl text-base'}),
            'relationship': forms.TextInput(attrs={'class': 'w-full p-3 border-2 rounded-xl text-base'}),
            'phone_number': forms.TextInput(attrs={
                'placeholder': 'e.g. +14155552671 or +919876543210',
                'class': 'w-full p-4 border-2 rounded-xl text-lg font-mono'
            }),
        }

    def clean_phone_number(self):
        phone = self.cleaned_data.get('phone_number', '').strip().replace(' ', '').replace('-', '')
        if not phone.replace('+', '').isdigit():
            raise forms.ValidationError("Phone number must contain only numbers and an optional leading '+'.")
        return phone


class SeniorQuestionForm(forms.Form):
    """
    Form for follow-up questions from senior users.
    """
    question = forms.CharField(
        max_length=500,
        required=True,
        widget=forms.TextInput(attrs={
            'placeholder': 'Type your question here...',
            'class': 'w-full p-4 text-xl border-2 rounded-xl'
        })
    )
    language = forms.CharField(max_length=50, required=False, initial='English')
    image_base64 = forms.CharField(widget=forms.HiddenInput(), required=False)
