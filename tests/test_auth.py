"""
Integration tests for CareLens AI User Authentication (Sign Up & Login).
"""

from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from companion.models import SeniorProfile


class AuthSignUpTestCase(TestCase):
    """
    Test suite for user registration and profile creation.
    """

    def setUp(self):
        self.client = Client()
        self.signup_url = reverse('companion:signup')

    def test_signup_page_renders(self):
        """Test sign-up page returns 200 OK with the form."""
        response = self.client.get(self.signup_url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Create Your Account')

    def test_signup_creates_user_and_profile(self):
        """Test that submitting sign-up form creates User and SeniorProfile."""
        response = self.client.post(self.signup_url, {
            'name': 'Margaret Smith',
            'username': 'margaret_test',
            'email': 'margaret@example.com',
            'password': 'SecurePass123!',
            'password_confirm': 'SecurePass123!',
            'role': 'senior',
            'preferred_language': 'English',
        })
        self.assertIn(response.status_code, [200, 302])
        user = User.objects.filter(username='margaret_test').first()
        self.assertIsNotNone(user, "User should be created after sign-up")
        profile = SeniorProfile.objects.filter(user=user).first()
        self.assertIsNotNone(profile, "SeniorProfile should be linked to the user")
        self.assertEqual(profile.name, 'Margaret Smith')
        self.assertFalse(profile.has_completed_tour)

    def test_signup_password_mismatch_rejected(self):
        """Test that mismatched passwords return form error."""
        response = self.client.post(self.signup_url, {
            'name': 'Robert Jones',
            'username': 'robert_test',
            'password': 'Password1!',
            'password_confirm': 'DifferentPassword!',
            'role': 'caregiver',
            'preferred_language': 'Hindi',
        })
        self.assertEqual(response.status_code, 200)
        user = User.objects.filter(username='robert_test').first()
        self.assertIsNone(user, "User should NOT be created on password mismatch")

    def test_duplicate_username_rejected(self):
        """Test that duplicate username during sign-up returns form error."""
        User.objects.create_user(username='taken_user', password='pass123')
        response = self.client.post(self.signup_url, {
            'name': 'Sarah New',
            'username': 'taken_user',
            'password': 'AnotherPass!1',
            'password_confirm': 'AnotherPass!1',
            'role': 'senior',
            'preferred_language': 'English',
        })
        self.assertEqual(response.status_code, 200)
        # Only the original user should remain
        self.assertEqual(User.objects.filter(username='taken_user').count(), 1)

    def test_signup_redirects_authenticated_user(self):
        """Authenticated user accessing sign-up should be redirected to home."""
        user = User.objects.create_user(username='already_logged', password='pass123')
        self.client.force_login(user)
        response = self.client.get(self.signup_url)
        self.assertRedirects(response, reverse('companion:home'))


class AuthLoginTestCase(TestCase):
    """
    Test suite for user login and session management.
    """

    def setUp(self):
        self.client = Client()
        self.login_url = reverse('companion:login')
        self.user = User.objects.create_user(
            username='testsenior',
            password='TestPass123!',
            first_name='Anita'
        )
        self.profile = SeniorProfile.objects.create(
            user=self.user,
            name='Anita',
            preferred_language='Marathi',
            has_completed_tour=False
        )

    def test_login_page_renders(self):
        """Test login page returns 200 OK."""
        response = self.client.get(self.login_url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Welcome Back')

    def test_successful_login_redirects_to_home(self):
        """Test successful authentication redirects to companion home."""
        response = self.client.post(self.login_url, {
            'username': 'testsenior',
            'password': 'TestPass123!',
        })
        self.assertRedirects(response, reverse('companion:home'))

    def test_invalid_credentials_rejected(self):
        """Test login with wrong password stays on login page with error."""
        response = self.client.post(self.login_url, {
            'username': 'testsenior',
            'password': 'WrongPassword!',
        })
        self.assertEqual(response.status_code, 200)
        # User should not be logged in
        user_id = self.client.session.get('_auth_user_id')
        self.assertIsNone(user_id)

    def test_logout_clears_session(self):
        """Test that logout clears the authenticated session."""
        self.client.force_login(self.user)
        logout_url = reverse('companion:logout')
        response = self.client.get(logout_url)
        self.assertRedirects(response, reverse('companion:home'))
        # User should not be in session after logout
        user_id = self.client.session.get('_auth_user_id')
        self.assertIsNone(user_id)

    def test_login_redirects_authenticated_user(self):
        """Authenticated user accessing login should be redirected to home."""
        self.client.force_login(self.user)
        response = self.client.get(self.login_url)
        self.assertRedirects(response, reverse('companion:home'))
