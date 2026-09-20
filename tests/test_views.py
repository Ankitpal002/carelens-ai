"""
Integration tests for Django views and REST API endpoints.
"""

import json
from django.test import TestCase, Client
from django.urls import reverse


class CompanionViewsTestCase(TestCase):
    """
    Test suite for web views and REST endpoints.
    """

    def setUp(self):
        self.client = Client()

    def test_home_view_status_code(self):
        """Test home dashboard view renders successfully with 200 OK."""
        response = self.client.get(reverse('companion:home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'CareLens')
        self.assertContains(response, 'Senior Companion Mode')

    def test_health_check_endpoint(self):
        """Test health check JSON endpoint."""
        response = self.client.get(reverse('companion:health_check'))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['status'], 'healthy')
        self.assertEqual(data['service'], 'CareLens AI Senior Companion')

    def test_preset_api_endpoint(self):
        """Test simulation preset API returns valid preset JSON."""
        response = self.client.get(reverse('companion:api_preset', kwargs={'preset_type': 'medication'}))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['data']['classification'], 'MEDICATION')

    def test_analyze_api_missing_payload(self):
        """Test analyze endpoint returns 400 Bad Request when image is omitted."""
        response = self.client.post(
            reverse('companion:api_analyze'),
            data=json.dumps({}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
