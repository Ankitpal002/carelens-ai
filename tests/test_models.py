"""
Unit tests for CareLens ORM data models.
"""

from django.test import TestCase
from companion.models import SeniorProfile, CaregiverContact, ScanRecord


class ModelsTestCase(TestCase):
    """
    Test suite for SeniorProfile, CaregiverContact, and ScanRecord models.
    """

    def test_senior_profile_creation(self):
        """Test senior profile defaults and string representation."""
        profile = SeniorProfile.objects.create(name='Margaret', preferred_language='Spanish')
        self.assertEqual(profile.name, 'Margaret')
        self.assertEqual(profile.speech_rate, 0.88)
        self.assertEqual(str(profile), 'Margaret (Spanish)')

    def test_caregiver_contact_creation(self):
        """Test caregiver contact creation and association."""
        profile = SeniorProfile.objects.create(name='Robert')
        contact = CaregiverContact.objects.create(
            senior_profile=profile,
            name='Sarah',
            relationship='Daughter',
            phone_number='+14155552671'
        )
        self.assertEqual(contact.name, 'Sarah')
        self.assertTrue(contact.is_primary)
        self.assertEqual(str(contact), 'Sarah (+14155552671)')

    def test_scan_record_creation(self):
        """Test scan record logging and verdict choices."""
        record = ScanRecord.objects.create(
            classification='MEDICATION',
            summary_text='Take 1 tablet with dinner.',
            safety_verdict='SAFE',
            language_used='English'
        )
        self.assertEqual(record.classification, 'MEDICATION')
        self.assertEqual(record.safety_verdict, 'SAFE')
        self.assertIn('[MEDICATION] SAFE', str(record))
