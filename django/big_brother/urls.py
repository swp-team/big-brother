from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)


urlpatterns = [
    path('api/tokens/auth/', TokenObtainPairView.as_view(),
         name='token-auth'),
    path('api/tokens/refresh/', TokenRefreshView.as_view(),
         name='token-refresh'),
    path('api/tokens/verification/', TokenVerifyView.as_view(),
         name='token-verification'),

    path('api/', include('tracking.urls')),
]
