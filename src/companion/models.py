"""
Data models for CareLens AI senior companion.
"""

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class SeniorProfile(models.Model):
    """
    Senior user accessibility profile and visual/hearing preferences.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='senior_profile', null=True, blank=True)
    name = models.CharField(max_length=100, default='Senior User', help_text="Preferred name or greeting")
    role = models.CharField(
        max_length=20,
        choices=[('senior', 'Senior User'), ('caregiver', 'Family Caregiver')],
        default='senior',
        help_text="User role (Senior or Family Caregiver)"
    )
    preferred_language = models.CharField(max_length=50, default='English', help_text="Primary UI and speech language")
    font_scale = models.CharField(
        max_length=20,
        choices=[('Normal', 'Normal'), ('Large', 'Large'), ('Huge', 'Huge')],
        default='Normal',
        help_text="Magnified typography scale"
    )
    theme_preference = models.CharField(
        max_length=20,
        choices=[('light', 'Warm Linen (Light)'), ('dark', 'Midnight Slate (Comfort Dark)')],
        default='light',
        help_text="Visual comfort theme"
    )
    speech_rate = models.FloatField(default=0.88, help_text="Calibrated speech rate for senior hearing (0.7 - 1.0)")
    has_completed_tour = models.BooleanField(
        default=False,
        help_text="Whether senior user has finished the onboarding walkthrough"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Senior Profile"
        verbose_name_plural = "Senior Profiles"

    def __str__(self):
        return f"{self.name} ({self.preferred_language})"


class CaregiverContact(models.Model):
    """
    Caregiver contact details for 1-tap WhatsApp second opinion bridge.
    """
    senior_profile = models.ForeignKey(SeniorProfile, on_delete=models.CASCADE, related_name='caregivers', null=True, blank=True)
    name = models.CharField(max_length=100, default='Family Caregiver')
    relationship = models.CharField(max_length=50, default='Daughter/Son', help_text="e.g. Son, Daughter, Nurse")
    phone_number = models.CharField(max_length=30, help_text="E.164 formatted number with country code")
    is_primary = models.BooleanField(default=True, help_text="Primary contact for 1-tap sharing")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Caregiver Contact"
        verbose_name_plural = "Caregiver Contacts"

    def __str__(self):
        return f"{self.name} ({self.phone_number})"


class ScanRecord(models.Model):
    """
    Historical log of analyzed documents, medications, and scam alerts.
    """
    CLASSIFICATION_CHOICES = [
        ('MEDICATION', 'Medication Prescription'),
        ('BILLING', 'Utility / Financial Bill'),
        ('SECURITY_CHECK', 'Security / Scam Verification'),
        ('APPLIANCE', 'Appliance Dial / Control'),
        ('FOOD', 'Food Expiration / Nutrition'),
        ('NOTICE', 'General Paper Notice'),
        ('GENERAL', 'General Object'),
    ]

    VERDICT_CHOICES = [
        ('SAFE', 'Verified Safe'),
        ('CAUTION', 'Proceed with Caution'),
        ('SCAM', 'Danger - Scam Detected'),
    ]

    senior_profile = models.ForeignKey(SeniorProfile, on_delete=models.SET_NULL, null=True, blank=True)
    classification = models.CharField(max_length=40, choices=CLASSIFICATION_CHOICES, default='GENERAL')
    summary_text = models.TextField(help_text="2-sentence senior-tailored plain language explanation")
    safety_verdict = models.CharField(max_length=20, choices=VERDICT_CHOICES, default='SAFE')
    safety_explanation = models.TextField(blank=True, default='')
    primary_action_label = models.CharField(max_length=100, blank=True, default='')
    primary_action_value = models.CharField(max_length=100, blank=True, default='')
    secondary_action_label = models.CharField(max_length=100, blank=True, default='')
    secondary_action_value = models.CharField(max_length=100, blank=True, default='')
    caregiver_message = models.TextField(blank=True, default='')
    language_used = models.CharField(max_length=50, default='English')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "Scan Record"
        verbose_name_plural = "Scan Records"
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.classification}] {self.safety_verdict} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class SupportTicket(models.Model):
    """
    Helpdesk support ticket submitted by senior users or caregivers.
    Email dispatch to support address is handled entirely server-side.
    """
    CATEGORY_CHOICES = [
        ('camera', '📸 Camera / Scanning Issue'),
        ('voice', '🔊 Voice or Audio Problem'),
        ('language', '🌐 Language / Translation Issue'),
        ('account', '👤 Account or Login Problem'),
        ('whatsapp', '💬 WhatsApp Sharing Issue'),
        ('ai_result', '🤖 AI Result Not Correct'),
        ('accessibility', '♿ Accessibility or Display Issue'),
        ('other', '❓ Other / General Question'),
    ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='support_tickets')
    name = models.CharField(max_length=100, help_text="Full name of the person raising the ticket")
    email = models.EmailField(help_text="Reply-to email for support response")
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='other')
    subject = models.CharField(max_length=200)
    message = models.TextField(help_text="Detailed description of the issue")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    ticket_id = models.CharField(max_length=16, unique=True, blank=True, help_text="Auto-generated short ticket reference")
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Support Ticket"
        verbose_name_plural = "Support Tickets"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.ticket_id:
            import random
            import string
            self.ticket_id = 'CL-' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.ticket_id}] {self.subject} ({self.status})"

