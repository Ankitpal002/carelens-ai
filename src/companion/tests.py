from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from companion.models import SeniorProfile

class AuthAndWalkthroughTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.signup_url = reverse('companion:signup')
        self.login_url = reverse('companion:login')
        self.logout_url = reverse('companion:logout')
        self.home_url = reverse('companion:home')
        self.complete_tour_url = reverse('companion:api_complete_tour')

    def test_signup_get(self):
        """Signup page renders successfully with status 200."""
        response = self.client.get(self.signup_url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Create Your Account")
        self.assertContains(response, "I am joining as")
        self.assertContains(response, "Preferred Language")

    def test_signup_post_success(self):
        """User can sign up, gets logged in automatically, and has tour initialized."""
        payload = {
            'username': 'senior_test',
            'email': 'senior@example.com',
            'name': 'Grandma Test',
            'role': 'senior',
            'preferred_language': 'Hindi',
            'password': 'StrongPassword123!',
            'password_confirm': 'StrongPassword123!'
        }
        response = self.client.post(self.signup_url, data=payload, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, self.home_url)

        # Check user created
        user = User.objects.filter(username='senior_test').first()
        self.assertIsNotNone(user)
        self.assertEqual(user.first_name, 'Grandma Test')

        # Check profile created
        profile = SeniorProfile.objects.filter(user=user).first()
        self.assertIsNotNone(profile)
        self.assertEqual(profile.preferred_language, 'Hindi')
        self.assertFalse(profile.has_completed_tour)

        # First visit after signup should trigger the tour
        self.assertTrue(response.context['show_tour'])

    def test_signup_password_mismatch(self):
        """Password mismatch prevents account creation and displays an error."""
        payload = {
            'username': 'mismatch_user',
            'name': 'Mismatch User',
            'role': 'senior',
            'preferred_language': 'English',
            'password': 'Password123!',
            'password_confirm': 'DifferentPassword456!'
        }
        response = self.client.post(self.signup_url, data=payload)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(User.objects.filter(username='mismatch_user').exists())

    def test_login_get(self):
        """Login page renders successfully with status 200."""
        response = self.client.get(self.login_url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Welcome Back")
        self.assertContains(response, "Sign in to your CareLens companion")

    def test_login_post_success_and_tour(self):
        """User can log in with valid credentials; first-time login triggers tour."""
        user = User.objects.create_user(
            username='existing_senior',
            password='TestPassword123!',
            first_name='Existing Senior'
        )
        profile = SeniorProfile.objects.create(
            user=user,
            name='Existing Senior',
            has_completed_tour=False
        )

        response = self.client.post(self.login_url, {
            'username': 'existing_senior',
            'password': 'TestPassword123!'
        }, follow=True)

        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, self.home_url)
        self.assertTrue(response.context['show_tour'])

    def test_complete_tour_api(self):
        """Tour completion API marks has_completed_tour as True."""
        user = User.objects.create_user(
            username='tour_user',
            password='TestPassword123!',
            first_name='Tour User'
        )
        profile = SeniorProfile.objects.create(
            user=user,
            name='Tour User',
            has_completed_tour=False
        )
        self.client.force_login(user)

        response = self.client.post(self.complete_tour_url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])

        profile.refresh_from_db()
        self.assertTrue(profile.has_completed_tour)

    def test_subsequent_login_skips_automatic_tour(self):
        """User who already completed the tour does not see the automatic tour popup."""
        user = User.objects.create_user(
            username='experienced_user',
            password='TestPassword123!',
            first_name='Experienced User'
        )
        profile = SeniorProfile.objects.create(
            user=user,
            name='Experienced User',
            has_completed_tour=True
        )

        response = self.client.post(self.login_url, {
            'username': 'experienced_user',
            'password': 'TestPassword123!'
        }, follow=True)

        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, self.home_url)
        self.assertFalse(response.context['show_tour'])

    def test_logout(self):
        """User can log out and is redirected to home dashboard."""
        user = User.objects.create_user(username='logout_user', password='Password123!')
        self.client.force_login(user)

        response = self.client.get(self.logout_url, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertRedirects(response, self.home_url)

    def test_guest_navigation_does_not_trigger_tour(self):
        """Normal navigation as guest does not trigger the tour."""
        response = self.client.get(self.home_url)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.context['show_tour'])
        self.assertContains(response, 'window.showOnboardingTour = false;')

    def test_subsequent_navigation_after_signup_skips_tour(self):
        """After signing up, subsequent navigation to home does not reopen tour."""
        payload = {
            'username': 'navigation_user',
            'name': 'Nav User',
            'role': 'senior',
            'preferred_language': 'English',
            'password': 'Password123!',
            'password_confirm': 'Password123!'
        }
        # 1. Signup redirects to home with show_tour=True
        first_resp = self.client.post(self.signup_url, data=payload, follow=True)
        self.assertTrue(first_resp.context['show_tour'])

        # 2. Subsequent navigation to home must have show_tour=False
        second_resp = self.client.get(self.home_url)
        self.assertFalse(second_resp.context['show_tour'])
        self.assertContains(second_resp, 'window.showOnboardingTour = false;')

    def test_login_and_signup_pages_have_tour_false(self):
        """Login and Signup pages must have window.showOnboardingTour = false."""
        login_resp = self.client.get(self.login_url)
        self.assertContains(login_resp, 'window.showOnboardingTour = false;')

        signup_resp = self.client.get(self.signup_url)
        self.assertContains(signup_resp, 'window.showOnboardingTour = false;')

