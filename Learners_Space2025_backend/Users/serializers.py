from rest_framework import serializers
from .models import User

IITB_EMAIL_DOMAIN = '@iitb.ac.in'


class UserSerializer(serializers.ModelSerializer):
    """Full serializer for admin / internal use."""
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        return User.objects.create(**validated_data)


class SignupSerializer(serializers.Serializer):
    """Validates the signup payload sent by the frontend Login.js."""
    email = serializers.EmailField()
    full_name = serializers.CharField(max_length=255)
    contact_number = serializers.RegexField(
        regex=r'^[0-9]{10}$',
        error_messages={'invalid': 'Contact number must be 10 digits.'},
    )
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        value = value.lower()
        if not value.endswith(IITB_EMAIL_DOMAIN):
            raise serializers.ValidationError("Only IITB email addresses ending with iitb.ac.in can register.")
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        return User.objects.create_user(**validated_data)


class VerifySignupSerializer(serializers.Serializer):
    """Validates the OTP submitted after signup details are staged."""
    email = serializers.EmailField()
    otp = serializers.CharField(min_length=6, max_length=6)

    def validate_email(self, value):
        return value.lower()


class UserProfileSerializer(serializers.ModelSerializer):
    """Safe subset returned to the frontend after login/signup."""
    class Meta:
        model = User
        fields = ['email', 'full_name', 'contact_number', 'courses', 'courses_locked']
