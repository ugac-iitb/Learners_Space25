from django.urls import path
from .views import SignupView, VerifySignupView, LoginView, UserCoursesView, LockCoursesView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='user-signup'),
    path('verify-signup/', VerifySignupView.as_view(), name='user-verify-signup'),
    path('login/', LoginView.as_view(), name='user-login'),
    path('courses/', UserCoursesView.as_view()), 
    path('courses/lock/', LockCoursesView.as_view(), name='user-lock-courses'),
]
