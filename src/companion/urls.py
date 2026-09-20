"""
URL patterns for the CareLens companion application.
"""

from django.urls import path
from . import views
from . import api_views

app_name = 'companion'

urlpatterns = [
    # Main Views
    path('', views.HomeCompanionView.as_view(), name='home'),
    path('health/', views.HealthCheckView.as_view(), name='health_check'),

    # Authentication Views
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),

    # REST API Endpoints
    path('api/analyze/', api_views.analyze_image_api, name='api_analyze'),
    path('api/ask-question/', api_views.ask_question_api, name='api_ask_question'),
    path('api/presets/<str:preset_type>/', api_views.get_preset_api, name='api_preset'),
    path('api/save-caregiver/', api_views.save_caregiver_api, name='api_save_caregiver'),
    path('api/complete-tour/', api_views.complete_tour_api, name='api_complete_tour'),
]
