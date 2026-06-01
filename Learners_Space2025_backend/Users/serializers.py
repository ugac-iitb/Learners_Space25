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


PROGRAMME_OPTIONS = ['B.Tech', 'B.S.', 'Dual Degree']
DEPARTMENT_OPTIONS = {
    'B.Tech': [
        'Computer Science and Engineering',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Industrial Engineering and Operations Research',
        'Aerospace Engineering',
        'Chemical Engineering',
        'Civil Engineering',
        'Engineering Physics',
        'Environmental Science and Engineering',
        'Metallurgical Engineering and Materials Science',
        'Energy Science and Engineering',
    ],
    'B.S.': ['Chemistry', 'Mathematics', 'Applied Geophysics'],
    'Dual Degree': ['Electrical Engineering'],
}


class SignupSerializer(serializers.Serializer):
    """Validates the signup payload sent by the frontend Login.js."""
    email = serializers.EmailField()
    full_name = serializers.CharField(max_length=255)
    contact_number = serializers.RegexField(
        regex=r'^[0-9]{10}$',
        error_messages={'invalid': 'Contact number must be 10 digits.'},
    )
    programme = serializers.ChoiceField(choices=PROGRAMME_OPTIONS)
    department = serializers.CharField(max_length=150)
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
        
        prog = data.get('programme')
        dept = data.get('department')
        valid_depts = DEPARTMENT_OPTIONS.get(prog, [])
        if not valid_depts:
            raise serializers.ValidationError({
                "programme": f"Select a valid programme. Options are {PROGRAMME_OPTIONS}."
            })
        if dept not in valid_depts:
            raise serializers.ValidationError({
                "department": f"Select a valid department for {prog}. Options are {valid_depts}."
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
        fields = ['email', 'full_name', 'contact_number', 'programme', 'department', 'courses', 'courses_locked']
