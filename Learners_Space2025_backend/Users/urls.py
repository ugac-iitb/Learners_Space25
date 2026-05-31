from django.urls import path
from .views import SignupView, LoginView,UserCoursesView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='user-signup'),
    path('login/', LoginView.as_view(), name='user-login'),
    path('courses/', UserCoursesView.as_view()), 
]
