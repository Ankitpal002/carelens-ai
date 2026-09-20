"""
Unit and integration tests for the first-time onboarding guide / tour system.
"""

import json
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from companion.models import SeniorProfile


class OnboardingTourStateTestCase(TestCase):
    """
    Tests for has_completed_tour tracking and tour trigger logic.
    """

    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='tour_test_user',
            password='TourPass123!',
            first_name='Gloria'
        )
        self.profile = SeniorProfile.objects.create(
            user=self.user,
            name='Gloria',
            preferred_language='English',
            has_completed_tour=False
        )

    def test_new_user_has_completed_tour_false_by_default(self):
        """Newly created SeniorProfile should have has_completed_tour=False."""
        new_user = User.objects.create_user(username='brandnew', password='Pass1!')
        profile = SeniorProfile.objects.create(user=new_user, name='New User')
        self.assertFalse(profile.has_completed_tour)

    def test_profile_tour_flag_can_be_set_true(self):
        """Verify has_completed_tour can be saved as True."""
        self.profile.has_completed_tour = True
        self.profile.save(update_fields=['has_completed_tour'])
        refreshed = SeniorProfile.objects.get(pk=self.profile.pk)
        self.assertTrue(refreshed.has_completed_tour)

    def test_home_view_injects_show_tour_true_for_new_user(self):
        """Authenticated new user seeing the home page should receive show_tour=True context."""
        self.client.force_login(self.user)
        response = self.client.get(reverse('companion:home'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.context.get('show_tour', False))

    def test_home_view_show_tour_false_after_completion(self):
        """After completing the tour, show_tour should be False on next login."""
        self.profile.has_completed_tour = True
        self.profile.save()
        self.client.force_login(self.user)
        # Clear any session tour flags
        session = self.client.session
        session['just_logged_in_show_tour'] = False
        session.save()
        response = self.client.get(reverse('companion:home'))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.context.get('show_tour', True))


class OnboardingCompletionAPITestCase(TestCase):
    """
    Tests for the /api/complete-tour/ endpoint.
    """

    def setUp(self):
        self.client = Client()
        self.complete_tour_url = reverse('companion:api_complete_tour')
        self.user = User.objects.create_user(
            username='completor',
            password='Complete1!'
        )
        self.profile = SeniorProfile.objects.create(
            user=self.user,
            name='Completor',
            has_completed_tour=False
        )

    def test_complete_tour_api_authenticated_user(self):
        """Test that authenticated user's profile has_completed_tour is set True."""
        self.client.force_login(self.user)
        response = self.client.post(
            self.complete_tour_url,
            data=json.dumps({'completed': True}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        # Verify database was updated
        self.profile.refresh_from_db()
        self.assertTrue(self.profile.has_completed_tour)

    def test_complete_tour_api_guest_user(self):
        """Test that guest (anonymous) user calling complete-tour returns success."""
        response = self.client.post(
            self.complete_tour_url,
            data=json.dumps({'completed': True}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])

    def test_complete_tour_api_only_accepts_post(self):
        """Test that the tour completion endpoint rejects GET requests."""
        self.client.force_login(self.user)
        response = self.client.get(self.complete_tour_url)
        self.assertEqual(response.status_code, 405)
