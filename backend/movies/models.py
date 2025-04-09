from django.db import models
from django.utils.text import slugify
from django.conf import settings

# We'll use the User model from settings.AUTH_USER_MODEL


class Role(models.Model):
    role_id = models.IntegerField(primary_key=True)
    role_name = models.CharField(max_length=100, null=False)

    class Meta:
        db_table = 'roles'
        managed = False  # Tell Django this table already exists

    def __str__(self):
        return self.role_name


class SubscriptionPlan(models.Model):
    plan_id = models.IntegerField(primary_key=True)
    plan_name = models.CharField(max_length=255, null=False)
    price = models.FloatField(null=False)
    max_devices = models.IntegerField(null=False)
    hd_available = models.BooleanField(null=False)
    ultra_hd_available = models.BooleanField(null=False)
    duration_days = models.IntegerField(null=False)

    class Meta:
        db_table = 'subscription_plan'
        managed = False  # Tell Django this table already exists

    def __str__(self):
        return self.plan_name


class UserSubscription(models.Model):
    user_subscription_id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, db_column='user_id')
    plan = models.ForeignKey(
        SubscriptionPlan, on_delete=models.CASCADE, db_column='plan_id')
    start_date = models.DateTimeField(null=False)
    end_date = models.DateTimeField(null=False)

    class Meta:
        db_table = 'user_subscription'
        managed = False  # Tell Django this table already exists

    def __str__(self):
        return f"{self.user.username} - {self.plan.plan_name}"


class Billing(models.Model):
    billing_id = models.IntegerField(primary_key=True)
    user_subscription = models.ForeignKey(
        UserSubscription, on_delete=models.CASCADE, db_column='user_subscription_id')
    amount = models.FloatField(null=False)
    payment_method = models.CharField(max_length=100, null=False)
    payment_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=False)
    payment_status = models.CharField(max_length=50, null=False)

    class Meta:
        db_table = 'billing'
        managed = False  # Tell Django this table already exists

    def __str__(self):
        return f"Billing {self.billing_id} - {self.user_subscription.user.username}"


class Movie(models.Model):
    movie_id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255, null=False)
    poster = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    release_year = models.IntegerField(null=True, blank=True)
    genre = models.CharField(max_length=100, null=True, blank=True)
    duration = models.IntegerField(null=True, blank=True)
    is_available = models.BooleanField(null=False)
    imdb_id = models.CharField(
        max_length=20, unique=True, null=True, blank=True)
    # Add slug field for URL purposes (not in original schema)
    # slug = models.SlugField(unique=True, blank=True)

    class Meta:
        db_table = 'movies'
        managed = False  # Tell Django this table already exists

    def save(self, *args, **kwargs):
        # if not self.slug:
        #     self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class WatchHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, db_column='user_id')
    movie = models.ForeignKey(
        Movie, on_delete=models.CASCADE, db_column='movie_id')
    timestamp = models.DateTimeField(auto_now_add=True)
    watch_duration = models.IntegerField(null=False)

    class Meta:
        db_table = 'watch_history'
        managed = False  # Tell Django this table already exists
        unique_together = ('user', 'movie', 'timestamp')
        verbose_name_plural = "Watch History"

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"


class Review(models.Model):
    review_id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, db_column='user_id')
    movie = models.ForeignKey(
        Movie, on_delete=models.CASCADE, related_name='reviews', db_column='movie_id')
    rating = models.IntegerField(null=False)
    review_text = models.CharField(max_length=500, null=True, blank=True)
    review_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reviews'
        managed = False  # Tell Django this table already exists

    def __str__(self):
        return f"{self.user.username}'s review of {self.movie.title}"


class Device(models.Model):
    device_id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                             related_name='devices', db_column='user_id')
    device_type = models.CharField(max_length=100, null=False)
    device_name = models.CharField(max_length=255, null=False)
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'device'
        managed = False  # Tell Django this table already exists

    def __str__(self):
        return f"{self.user.username}'s {self.device_name}"


class Media(models.Model):
    media_id = models.IntegerField(primary_key=True)
    movie = models.ForeignKey(
        Movie, on_delete=models.CASCADE, related_name='media', db_column='movie_id')
    episode = models.IntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'media'
        managed = False  # Tell Django this table already exists
        verbose_name_plural = "Media"

    def __str__(self):
        if self.episode:
            return f"{self.movie.title} - Episode {self.episode}"
        return f"Media for {self.movie.title}"
