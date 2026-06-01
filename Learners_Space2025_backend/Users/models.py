from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("An email address is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True, default='')

    # Legacy IITB fields — kept optional for backward compatibility
    roll_no = models.CharField(max_length=150, blank=True, null=True)
    year_of_study = models.CharField(max_length=10, blank=True, default='')
    contact_number = models.CharField(max_length=15, blank=True, default='')
    degree_type = models.CharField(max_length=50, blank=True, default='')
    programme = models.CharField(max_length=50, blank=True, default='')
    department = models.CharField(max_length=150, blank=True, default='')
    ldap_id = models.CharField(max_length=100, blank=True, default='')

    # Course registrations stored as a list of course ID strings
    courses = models.JSONField(blank=True, null=True, default=list)
    courses_locked = models.BooleanField(default=False)

    # Required for Django auth system
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
