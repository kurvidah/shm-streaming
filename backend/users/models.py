from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone


class CustomUserManager(models.Manager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email) if hasattr(
            self, 'normalize_email') else email
        user = self.model(username=username, email=email, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('role_id', 1)  # Admin role
        return self.create_user(username, email, password, **extra_fields)

    def normalize_email(self, email):
        """
        Normalize the email address by lowercasing the domain part of it.
        """
        email = email or ''
        try:
            email_name, domain_part = email.strip().rsplit('@', 1)
        except ValueError:
            return email
        else:
            return email_name + '@' + domain_part.lower()


class CustomUser(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    role_id = models.IntegerField(default=3)  # Default to regular user role
    gender = models.CharField(max_length=50, null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    religion = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = 'users'
        managed = False  # Tell Django this table already exists

    def __str__(self):
        return self.username

    # Required properties for Django auth - CRITICAL FIX
    @property
    def is_anonymous(self):
        """
        Always return False. This is a way of comparing User objects to
        anonymous users.
        """
        return False

    @property
    def is_authenticated(self):
        """
        Always return True. This is a way to tell if the user has been
        authenticated in templates.
        """
        return True

    def get_username(self):
        return self.username

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    # Admin permissions based on role_id
    @property
    def is_staff(self):
        return self.role_id in [1, 2]  # Admin or Moderator

    @property
    def is_superuser(self):
        return self.role_id == 1  # Admin only

    @property
    def is_active(self):
        return True

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

    # For compatibility with Django admin
    def get_all_permissions(self, obj=None):
        return set()

    def get_group_permissions(self, obj=None):
        return set()
