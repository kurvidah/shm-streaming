from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


class Role(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=100, null=False)

    def __str__(self):
        return self.role_name


class SubscriptionPlan(models.Model):
    plan_id = models.AutoField(primary_key=True)
    plan_name = models.CharField(max_length=255, null=False)
    price = models.FloatField(null=False)
    max_devices = models.IntegerField(null=False)
    hd_available = models.BooleanField(null=False)
    ultra_hd_available = models.BooleanField(null=False)
    duration_days = models.IntegerField(null=False)

    def __str__(self):
        return self.plan_name


class UserSubscription(models.Model):
    user_subscription_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    start_date = models.DateTimeField(null=False)
    end_date = models.DateTimeField(null=False)

    def __str__(self):
        return f"{self.user.username} - {self.plan.plan_name}"


class Billing(models.Model):
    billing_id = models.AutoField(primary_key=True)
    user_subscription = models.ForeignKey(
        UserSubscription, on_delete=models.CASCADE)
    amount = models.FloatField(null=False)
    payment_method = models.CharField(max_length=100, null=False)
    payment_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=False)
    payment_status = models.CharField(max_length=50, null=False)

    def __str__(self):
        return f"Billing {self.billing_id} - {self.user_subscription.user.username}"


class Movie(models.Model):
    movie_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, null=False)
    poster = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    release_year = models.IntegerField(null=True, blank=True)
    genre = models.CharField(max_length=100, null=True, blank=True)
    duration = models.IntegerField(null=True, blank=True)
    is_available = models.BooleanField(null=False)
    imdb_id = models.CharField(
        max_length=20, unique=True, null=True, blank=True)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class WatchHistory(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='watch_history')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    watch_duration = models.IntegerField(null=False)

    class Meta:
        unique_together = ('user', 'movie', 'timestamp')
        verbose_name_plural = "Watch History"

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"


class Review(models.Model):
    review_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(
        Movie, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(null=False)
    review_text = models.CharField(max_length=500, null=True, blank=True)
    review_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s review of {self.movie.title}"


class Device(models.Model):
    device_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='devices')
    device_type = models.CharField(max_length=100, null=False)
    device_name = models.CharField(max_length=255, null=False)
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s {self.device_name}"


class Media(models.Model):
    media_id = models.AutoField(primary_key=True)
    movie = models.ForeignKey(
        Movie, on_delete=models.CASCADE, related_name='media')
    episode = models.IntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "Media"

    def __str__(self):
        if self.episode:
            return f"{self.movie.title} - Episode {self.episode}"
        return f"Media for {self.movie.title}"
