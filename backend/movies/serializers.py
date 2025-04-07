from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Role, SubscriptionPlan, UserSubscription, Billing,
    Movie, WatchHistory, Review, Device, Media
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['role_id', 'role_name']


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = ['plan_id', 'plan_name', 'price', 'max_devices',
                  'hd_available', 'ultra_hd_available', 'duration_days']


class UserSubscriptionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    plan = SubscriptionPlanSerializer(read_only=True)

    class Meta:
        model = UserSubscription
        fields = ['user_subscription_id', 'user',
                  'plan', 'start_date', 'end_date']


class BillingSerializer(serializers.ModelSerializer):
    user_subscription = UserSubscriptionSerializer(read_only=True)

    class Meta:
        model = Billing
        fields = ['billing_id', 'user_subscription', 'amount',
                  'payment_method', 'payment_date', 'due_date', 'payment_status']


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['review_id', 'user', 'movie',
                  'rating', 'review_text', 'review_date']


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['media_id', 'movie', 'episode', 'description']


class MovieSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    media = MediaSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = [
            'movie_id', 'title', 'slug', 'poster', 'description',
            'release_year', 'genre', 'duration', 'is_available',
            'imdb_id', 'reviews', 'media'
        ]


class WatchHistorySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    movie = MovieSerializer(read_only=True)
    movie_id = serializers.PrimaryKeyRelatedField(
        queryset=Movie.objects.all(),
        write_only=True,
        source='movie'
    )

    class Meta:
        model = WatchHistory
        fields = ['id', 'user', 'movie', 'movie_id',
                  'timestamp', 'watch_duration']
        read_only_fields = ['id', 'timestamp']


class DeviceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Device
        fields = ['device_id', 'user', 'device_type',
                  'device_name', 'registered_at']
        read_only_fields = ['device_id', 'registered_at']
