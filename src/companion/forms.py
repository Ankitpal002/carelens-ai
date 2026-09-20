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


class UserSignUpForm(forms.Form):
    """
    Senior and Caregiver Registration Form with accessibility-first inputs.
    """
    ROLE_CHOICES = [
        ('senior', '👴 Senior User (Looking for visual & audio assistance)'),
        ('caregiver', '🤝 Family Caregiver (Supporting a senior parent or relative)'),
    ]

    LANGUAGE_CHOICES = [
        ('English', '🌐 English'),
        ('Hindi', '🇮🇳 हिन्दी (Hindi)'),
        ('Marathi', '🇮🇳 मराठी (Marathi)'),
        ('Tamil', '🇮🇳 தமிழ் (Tamil)'),
        ('Telugu', '🇮🇳 తెలుగు (Telugu)'),
        ('Bengali', '🇮🇳 বাংলা (Bengali)'),
        ('Kannada', '🇮🇳 ಕನ್ನಡ (Kannada)'),
        ('Malayalam', '🇮🇳 മലയാളം (Malayalam)'),
        ('Gujarati', '🇮🇳 ગુજરાતી (Gujarati)'),
        ('Punjabi', '🇮🇳 ਪੰਜਾਬੀ (Punjabi)'),
        ('Urdu', '🇮🇳 اردو (Urdu)'),
        ('Arabic', '🌍 العربية (Arabic)'),
        ('Spanish', '🌍 Español (Spanish)'),
    ]

    name = forms.CharField(
        max_length=100,
        required=True,
        label="Full Name",
        widget=forms.TextInput(attrs={
            'placeholder': 'e.g. Margaret Smith or Ankit Pal',
            'class': 'w-full p-4 text-lg border-2 border-linen-300 rounded-xl focus:border-sapphire focus:outline-none bg-linen-50',
            'autocomplete': 'name',
        })
    )

    username = forms.CharField(
        max_length=150,
        required=True,
        label="Username",
        widget=forms.TextInput(attrs={
            'placeholder': 'Choose a simple username',
            'class': 'w-full p-4 text-lg border-2 border-linen-300 rounded-xl focus:border-sapphire focus:outline-none bg-linen-50',
            'autocomplete': 'username',
        })
    )

    email = forms.EmailField(
        required=False,
        label="Email Address (Optional)",
        widget=forms.EmailInput(attrs={
            'placeholder': 'e.g. margaret@example.com',
            'class': 'w-full p-4 text-lg border-2 border-linen-300 rounded-xl focus:border-sapphire focus:outline-none bg-linen-50',
            'autocomplete': 'email',
        })
    )

    role = forms.ChoiceField(
        choices=ROLE_CHOICES,
        initial='senior',
        required=True,
        label="I am joining as",
        widget=forms.RadioSelect(attrs={
            'class': 'mr-3 h-5 w-5 text-sapphire focus:ring-sapphire cursor-pointer'
        })
    )

    preferred_language = forms.ChoiceField(
        choices=LANGUAGE_CHOICES,
        initial='English',
        required=True,
        label="Preferred Language",
        widget=forms.Select(attrs={
            'class': 'w-full p-4 text-lg border-2 border-linen-300 rounded-xl focus:border-sapphire focus:outline-none bg-linen-50 cursor-pointer',
        })
    )

    password = forms.CharField(
        required=True,
        label="Password",
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Create a secure password',
            'class': 'w-full p-4 text-lg border-2 border-linen-300 rounded-xl focus:border-sapphire focus:outline-none bg-linen-50',
            'autocomplete': 'new-password',
        })
    )

    password_confirm = forms.CharField(
        required=True,
        label="Confirm Password",
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Repeat your password',
            'class': 'w-full p-4 text-lg border-2 border-linen-300 rounded-xl focus:border-sapphire focus:outline-none bg-linen-50',
            'autocomplete': 'new-password',
        })
    )

    def clean_username(self):
        username = self.cleaned_data.get('username', '').strip()
        from django.contrib.auth.models import User
        if User.objects.filter(username__iexact=username).exists():
            raise forms.ValidationError("This username is already taken. Please choose another one.")
        return username

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')

        if password and password_confirm and password != password_confirm:
            self.add_error('password_confirm', "Passwords do not match. Please verify and re-enter.")
        return cleaned_data


class UserLoginForm(forms.Form):
    """
    Senior and Caregiver Login Form.
    """
    username = forms.CharField(
        max_length=150,
        required=True,
        label="Username",
        widget=forms.TextInput(attrs={
            'placeholder': 'Enter your username',
            'class': 'w-full p-4 text-lg border-2 border-linen-300 rounded-xl focus:border-sapphire focus:outline-none bg-linen-50',
            'autocomplete': 'username',
            'autofocus': 'autofocus',
        })
    )

    password = forms.CharField(
        required=True,
        label="Password",
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Enter your password',
            'class': 'w-full p-4 text-lg border-2 border-linen-300 rounded-xl focus:border-sapphire focus:outline-none bg-linen-50',
            'autocomplete': 'current-password',
        })
    )
