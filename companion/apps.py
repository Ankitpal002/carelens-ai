"""
App configuration for CareLens companion module.
"""

from django.apps import AppConfig


class CompanionConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'companion'
    verbose_name = 'CareLens Senior Companion'
