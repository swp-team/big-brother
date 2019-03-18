from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)


urlpatterns = [
    path('api/tokens/auth/', TokenObtainPairView.as_view(),
         name='tokens-auth'),
    path('api/tokens/refresh/', TokenRefreshView.as_view(),
         name='tokens-refresh'),
    path('api/tokens/verification/', TokenVerifyView.as_view(),
         name='tokens-verification'),
]
