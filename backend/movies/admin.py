from django.contrib import admin
from .models import (
    Role, SubscriptionPlan, UserSubscription, Billing,
    Movie, WatchHistory, Review, Device, Media
)

admin.site.register(Role)
admin.site.register(SubscriptionPlan)
admin.site.register(UserSubscription)
admin.site.register(Billing)
admin.site.register(Movie)
admin.site.register(WatchHistory)
admin.site.register(Review)
admin.site.register(Device)
admin.site.register(Media)
