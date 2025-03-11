from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    hello_world, MovieViewSet, WatchHistoryViewSet, ReviewViewSet,
    DeviceViewSet, SubscriptionPlanViewSet, UserSubscriptionViewSet,
    BillingViewSet, MediaViewSet
)

router = DefaultRouter()
router.register(r'movies', MovieViewSet)
router.register(r'watch-history', WatchHistoryViewSet,
                basename='watch-history')
router.register(r'reviews', ReviewViewSet, basename='reviews')
router.register(r'devices', DeviceViewSet, basename='devices')
router.register(r'subscription-plans', SubscriptionPlanViewSet)
router.register(r'subscriptions', UserSubscriptionViewSet,
                basename='subscriptions')
router.register(r'billing', BillingViewSet, basename='billing')
router.register(r'media', MediaViewSet)

urlpatterns = [
    path('hello/', hello_world, name='hello_world'),
    path('', include(router.urls)),
]
