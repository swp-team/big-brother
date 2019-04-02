from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import Activity
from .serializers import ActivitySerializer


class ActivityViewSet(ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Activity.objects.filter(project__participants=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
