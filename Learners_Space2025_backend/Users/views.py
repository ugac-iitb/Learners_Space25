from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import User
from .serializers import SignupSerializer, UserProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class SignupView(APIView):
    """
    POST /user/signup/
    Payload: { email, full_name, password, confirm_password }
    Returns: { tokens: { access, refresh }, user: { email, full_name, courses } }
    """
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
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
        return Response({'courses': user.courses}, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        new_courses = request.data.get('courses', [])
        if not isinstance(new_courses, list):
            return Response({'error': 'Courses should be a list of strings'}, status=status.HTTP_400_BAD_REQUEST)

        user.courses = list(set(user.courses or []) | set(new_courses))
        user.save()
        return Response({'message': 'Courses added', 'courses': user.courses}, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user
        updated_courses = request.data.get('courses', [])
        if not isinstance(updated_courses, list):
            return Response({'error': 'Courses should be a list of strings'}, status=status.HTTP_400_BAD_REQUEST)

        user.courses = updated_courses
        user.save()
        return Response({'message': 'Courses replaced', 'courses': user.courses}, status=status.HTTP_200_OK)

    def delete(self, request):
        user = request.user
        to_remove = request.data.get('courses', [])
        if not isinstance(to_remove, list):
            return Response({'error': 'Courses should be a list of strings'}, status=status.HTTP_400_BAD_REQUEST)

        user.courses = [c for c in (user.courses or []) if c not in to_remove]
        user.save()
        return Response({'message': 'Courses removed', 'courses': user.courses}, status=status.HTTP_200_OK)