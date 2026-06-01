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
    throttle_scope = 'signup_throttle'
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
    throttle_scope = 'signup_throttle'
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
                {'error': 'Signup OTP has expired or was not requested. Please register again.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        fail_key = f'otp_fail_count:{email.lower()}'
        fail_count = cache.get(fail_key, 0)
        if fail_count >= 5:
            cache.delete(cache_key)
            cache.delete(fail_key)
            return Response(
                {'otp': ['Too many failed OTP attempts. Your signup request has been cancelled. Please register again.']},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not secrets.compare_digest(pending_signup['otp'], serializer.validated_data['otp']):
            new_fail_count = fail_count + 1
            cache.set(fail_key, new_fail_count, timeout=600)  # expires in 10 minutes
            if new_fail_count >= 5:
                cache.delete(cache_key)
                cache.delete(fail_key)
                return Response(
                    {'otp': ['Too many failed OTP attempts. Your signup request has been cancelled. Please register again.']},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(
                {'otp': [f'Invalid OTP. Please try again. ({5 - new_fail_count} attempts remaining)']},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Clear failed attempts cache on success
        cache.delete(fail_key)

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
    throttle_scope = 'login_throttle'
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


import json
import os
import re

def get_all_valid_course_ids():
    valid_ids = set()
    # Attempt to read Courses.json
    try:
        path1 = os.path.join(settings.BASE_DIR, '..', 'Learners_Space25_frontend', 'src', 'data', 'Courses.json')
        if os.path.exists(path1):
            with open(path1, 'r', encoding='utf-8') as f:
                courses = json.load(f)
                for c in courses:
                    if c.get("Course ID"):
                        valid_ids.add(str(c["Course ID"]))
    except Exception as e:
        logger.error(f"Error loading Courses.json: {e}")

    # Attempt to read Courses2026.json
    try:
        path2 = os.path.join(settings.BASE_DIR, '..', 'Learners_Space25_frontend', 'src', 'data', 'Courses2026.json')
        if os.path.exists(path2):
            with open(path2, 'r', encoding='utf-8') as f:
                courses = json.load(f)
                for c in courses:
                    body = c.get("body", "").strip().lower().replace(" ", "")
                    body = re.sub(r'[^\w\s]', '', body)
                    
                    course_name = c.get("course", "").strip()
                    aliases = {
                        "big data handeling": "Big Data Handling",
                        "introduction to computational chemistry": "Introduction to Computational Chemistry",
                        "techno commercial aspects of chemical industries": "Techno Commercial Aspects of Chemical Industries",
                        "agentic ai integrated website": "Agentic AI Integrated Website",
                    }
                    norm_name = aliases.get(course_name.lower(), course_name).strip().lower().replace(" ", "")
                    norm_name = re.sub(r'[^\w\s]', '', norm_name)
                    
                    cid = f"{body}__{norm_name}"
                    valid_ids.add(cid)
                    
                    # Also fallback plain key
                    valid_ids.add(f"{body}__{course_name.strip().lower().replace(' ', '')}")
    except Exception as e:
        logger.error(f"Error loading Courses2026.json: {e}")

    return valid_ids


def validate_course_ids(courses_list):
    if not isinstance(courses_list, list):
        return False, "Courses should be a list of strings."
    
    if len(courses_list) > 50:
        return False, "Cannot register for more than 50 courses."
        
    valid_ids = get_all_valid_course_ids()
    safe_pattern = re.compile(r'^[a-zA-Z0-9_&%\-\s:]+$')
    
    for c in courses_list:
        if not isinstance(c, str):
            return False, f"Course ID {c} is not a string."
        if len(c) < 1 or len(c) > 150:
            return False, "Course ID length must be between 1 and 150 characters."
        if not safe_pattern.match(c):
            return False, f"Course ID {c} contains invalid characters."
        if valid_ids and c not in valid_ids:
            return False, f"Course ID '{c}' is not a valid course."
            
    return True, ""


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
        is_valid, err_msg = validate_course_ids(new_courses)
        if not is_valid:
            return Response({'error': err_msg}, status=status.HTTP_400_BAD_REQUEST)

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
        is_valid, err_msg = validate_course_ids(updated_courses)
        if not is_valid:
            return Response({'error': err_msg}, status=status.HTTP_400_BAD_REQUEST)

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

        safe_pattern = re.compile(r'^[a-zA-Z0-9_&%\-\s:]+$')
        for c in to_remove:
            if not isinstance(c, str):
                return Response({'error': f"Course ID {c} is not a string."}, status=status.HTTP_400_BAD_REQUEST)
            if len(c) < 1 or len(c) > 150 or not safe_pattern.match(c):
                return Response({'error': f"Course ID {c} contains invalid characters."}, status=status.HTTP_400_BAD_REQUEST)

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
