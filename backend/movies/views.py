from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    Role, SubscriptionPlan, UserSubscription, Billing,
    Movie, WatchHistory, Review, Device, Media
)
from .serializers import (
    RoleSerializer, SubscriptionPlanSerializer, UserSubscriptionSerializer, BillingSerializer,
    MovieSerializer, WatchHistorySerializer, ReviewSerializer, DeviceSerializer, MediaSerializer
)

# Simple Hello World API endpoint


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def hello_world(request):
    return Response({"message": "Hello World from SHM Streaming Backend!"})


class MovieViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['genre', 'release_year', 'is_available']
    search_fields = ['title', 'description']
    ordering_fields = ['release_year', 'title', 'duration']
    lookup_field = 'slug'

    @action(detail=False)
    def featured(self, request):
        featured = Movie.objects.filter(is_available=True)[:10]
        serializer = self.get_serializer(featured, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def recent(self, request):
        recent = Movie.objects.filter(
            is_available=True).order_by('-release_year')[:10]
        serializer = self.get_serializer(recent, many=True)
        return Response(serializer.data)


class WatchHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = WatchHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WatchHistory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['movie', 'rating']

    def get_queryset(self):
        return Review.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DeviceViewSet(viewsets.ModelViewSet):
    serializer_class = DeviceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Device.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Check if user has reached device limit based on subscription
        user = self.request.user
        try:
            subscription = UserSubscription.objects.get(user=user)
            current_devices = Device.objects.filter(user=user).count()

            if current_devices >= subscription.plan.max_devices:
                return Response(
                    {"detail": "Maximum device limit reached for your subscription plan."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except UserSubscription.DoesNotExist:
            pass

        serializer.save(user=user)


class SubscriptionPlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.AllowAny]


class UserSubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = UserSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSubscription.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BillingViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BillingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Billing.objects.filter(user_subscription__user=self.request.user)


class MediaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['movie', 'episode']
