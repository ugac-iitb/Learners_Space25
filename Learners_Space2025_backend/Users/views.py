import logging
import secrets

from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User
from .serializers import SignupSerializer, UserProfileSerializer, VerifySignupSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

logger = logging.getLogger(__name__)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def get_signup_cache_key(email):
    return f'pending_signup:{email.lower()}'


def get_signup_resend_cache_key(email):
    return f'pending_signup_resend:{email.lower()}'


def generate_otp():
    return f'{secrets.randbelow(1000000):06d}'


def can_send_signup_email():
    if settings.EMAIL_BACKEND == 'django.core.mail.backends.locmem.EmailBackend':
        return True

    if settings.EMAIL_BACKEND == 'django.core.mail.backends.console.EmailBackend':
        return settings.DJANGO_ALLOW_CONSOLE_EMAIL

    return all([settings.EMAIL_HOST, settings.DEFAULT_FROM_EMAIL])


def send_signup_otp(email, otp):
    if not can_send_signup_email():
        return False

    sent_count = send_mail(
        subject='Learners Space email verification OTP',
        message=(
            f'Your Learners Space signup OTP is {otp}. '
            'It expires in 10 minutes.'
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )
    return sent_count == 1


class SignupView(APIView):
    """
    POST /user/signup/
    Payload: { email, full_name, password, confirm_password }
    Sends an email OTP and stores the pending signup briefly.
    """
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        pending_signup = serializer.validated_data.copy()
        email = pending_signup['email']
        resend_cache_key = get_signup_resend_cache_key(email)

        if cache.get(resend_cache_key):
            return Response(
                {'error': 'An OTP was already sent recently. Please wait a minute before requesting another.'},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        otp = generate_otp()

        try:
            otp_sent = send_signup_otp(email, otp)
        except Exception:
            logger.exception('Failed to send signup OTP email to %s', email)
            otp_sent = False

        if not otp_sent:
            return Response(
                {
                    'error': (
                        'OTP email could not be sent. Configure SMTP settings '
                        '(EMAIL_HOST, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, DEFAULT_FROM_EMAIL) and try again.'
                    )
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        cache.set(
            get_signup_cache_key(email),
            {**pending_signup, 'otp': otp},
            timeout=settings.SIGNUP_OTP_TIMEOUT_SECONDS,
        )
        cache.set(resend_cache_key, True, timeout=settings.SIGNUP_OTP_RESEND_SECONDS)

        return Response(
            {'message': 'Verification OTP sent to your IITB email address.'},
            status=status.HTTP_200_OK,
        )


class VerifySignupView(APIView):
    """
    POST /user/verify-signup/
    Payload: { email, otp }
    Returns: { tokens: { access, refresh }, user: { email, full_name, courses } }
    """
    def post(self, request):
        serializer = VerifySignupSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        cache_key = get_signup_cache_key(email)
        pending_signup = cache.get(cache_key)

        if not pending_signup:
            return Response(
                {'error': 'Signup OTP has expired. Please request a new one.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not secrets.compare_digest(pending_signup['otp'], serializer.validated_data['otp']):
            return Response(
                {'otp': ['Invalid OTP. Please try again.']},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email__iexact=email).exists():
            cache.delete(cache_key)
            return Response(
                {'email': ['A user with this email already exists.']},
                status=status.HTTP_400_BAD_REQUEST,
            )

        pending_signup.pop('otp', None)
        pending_signup.pop('confirm_password', None)
        user = User.objects.create_user(**pending_signup)
        cache.delete(cache_key)

        tokens = get_tokens_for_user(user)
        user_data = UserProfileSerializer(user).data

        return Response(
            {'tokens': tokens, 'user': user_data},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """
    POST /user/login/
    Payload: { email, password }
    Returns: { tokens: { access, refresh }, user: { email, full_name, courses } }
    """
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'error': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=email, password=password)

        if user is None:
            return Response(
                {'error': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        tokens = get_tokens_for_user(user)
        user_data = UserProfileSerializer(user).data

        return Response(
            {'tokens': tokens, 'user': user_data},
            status=status.HTTP_200_OK,
        )


class UserCoursesView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {'courses': user.courses, 'courses_locked': user.courses_locked},
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        user = request.user
        if user.courses_locked:
            return Response(
                {'error': 'Your course selection is locked and cannot be changed.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        new_courses = request.data.get('courses', [])
        if not isinstance(new_courses, list):
            return Response({'error': 'Courses should be a list of strings'}, status=status.HTTP_400_BAD_REQUEST)

        user.courses = list(set(user.courses or []) | set(new_courses))
        user.save()
        return Response(
            {'message': 'Courses added', 'courses': user.courses, 'courses_locked': user.courses_locked},
            status=status.HTTP_200_OK,
        )

    def put(self, request):
        user = request.user
        if user.courses_locked:
            return Response(
                {'error': 'Your course selection is locked and cannot be changed.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        updated_courses = request.data.get('courses', [])
        if not isinstance(updated_courses, list):
            return Response({'error': 'Courses should be a list of strings'}, status=status.HTTP_400_BAD_REQUEST)

        user.courses = updated_courses
        user.save()
        return Response(
            {'message': 'Courses replaced', 'courses': user.courses, 'courses_locked': user.courses_locked},
            status=status.HTTP_200_OK,
        )

    def delete(self, request):
        user = request.user
        if user.courses_locked:
            return Response(
                {'error': 'Your course selection is locked and cannot be changed.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        to_remove = request.data.get('courses', [])
        if not isinstance(to_remove, list):
            return Response({'error': 'Courses should be a list of strings'}, status=status.HTTP_400_BAD_REQUEST)

        user.courses = [c for c in (user.courses or []) if c not in to_remove]
        user.save()
        return Response(
            {'message': 'Courses removed', 'courses': user.courses, 'courses_locked': user.courses_locked},
            status=status.HTTP_200_OK,
        )


class LockCoursesView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if user.courses_locked:
            return Response(
                {'message': 'Course selection is already locked.', 'courses': user.courses, 'courses_locked': True},
                status=status.HTTP_200_OK,
            )

        user.courses_locked = True
        user.save(update_fields=['courses_locked'])
        return Response(
            {'message': 'Course selection locked.', 'courses': user.courses, 'courses_locked': True},
            status=status.HTTP_200_OK,
        )
