from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser


class CustomUserAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        (_('Personal info'), {'fields': ('gender', 'age', 'religion')}),
        (_('Role'), {'fields': ('role_id',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password'),
        }),
    )
    list_display = ('username', 'email', 'role_id')
    list_filter = ('role_id',)
    search_fields = ('username', 'email')
    ordering = ('username',)
    readonly_fields = ('created_at',)


admin.site.register(CustomUser, CustomUserAdmin)
