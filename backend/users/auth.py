from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from users.models import CustomUser


class EmailOrUsernameModelBackend(BaseBackend):
    """
    Authentication backend that allows login with either username or email
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None or password is None:
            return None

        # Try to find a user matching the username
        try:
            if '@' in username:
                # If username contains @, try to authenticate with email
                user = CustomUser.objects.get(email=username)
            else:
                # Otherwise, try with username
                user = CustomUser.objects.get(username=username)

            if user.check_password(password):
                return user
        except CustomUser.DoesNotExist:
            # Run the default password hasher once to reduce timing
            # attacks targeting a particular user
            return None

    def get_user(self, user_id):
        try:
            return CustomUser.objects.get(user_id=user_id)
        except CustomUser.DoesNotExist:
            return None
