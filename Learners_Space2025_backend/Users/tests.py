from django.core import mail
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from .models import User


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    CACHES={
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'signup-tests',
        }
    },
)
class SignupOtpTests(APITestCase):
    def signup_payload(self, email='student@iitb.ac.in'):
        return {
            'full_name': 'Test Student',
            'email': email,
            'contact_number': '9876543210',
            'password': 'strongpass123',
            'confirm_password': 'strongpass123',
        }

    def test_signup_rejects_non_iitb_email(self):
        response = self.client.post('/user/signup/', self.signup_payload('student@example.com'), format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
        self.assertEqual(User.objects.count(), 0)

    def test_signup_sends_otp_without_creating_user(self):
        response = self.client.post('/user/signup/', self.signup_payload(), format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('student@iitb.ac.in', mail.outbox[0].to)
        self.assertEqual(User.objects.count(), 0)

    def test_verify_signup_creates_user_and_returns_tokens(self):
        self.client.post('/user/signup/', self.signup_payload(), format='json')
        otp = mail.outbox[0].body.split('OTP is ')[1].split('.')[0]

        response = self.client.post(
            '/user/verify-signup/',
            {'email': 'student@iitb.ac.in', 'otp': otp},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertTrue(User.objects.filter(email='student@iitb.ac.in').exists())

    def test_verify_signup_rejects_wrong_otp(self):
        self.client.post('/user/signup/', self.signup_payload(), format='json')

        response = self.client.post(
            '/user/verify-signup/',
            {'email': 'student@iitb.ac.in', 'otp': '000000'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('otp', response.data)
        self.assertEqual(User.objects.count(), 0)

    def test_signup_requires_contact_number(self):
        payload = self.signup_payload()
        payload.pop('contact_number')

        response = self.client.post('/user/signup/', payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('contact_number', response.data)


class CourseLockTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='locked@iitb.ac.in',
            full_name='Locked Student',
            contact_number='9876543210',
            password='strongpass123',
        )
        self.client.force_authenticate(user=self.user)

    def test_user_can_deregister_before_lock(self):
        self.user.courses = ['COURSE-1', 'COURSE-2']
        self.user.save()

        response = self.client.delete('/user/courses/', {'courses': ['COURSE-1']}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['courses'], ['COURSE-2'])

    def test_lock_blocks_registration_changes(self):
        lock_response = self.client.post('/user/courses/lock/', {}, format='json')
        add_response = self.client.post('/user/courses/', {'courses': ['COURSE-1']}, format='json')
        remove_response = self.client.delete('/user/courses/', {'courses': ['COURSE-1']}, format='json')

        self.assertEqual(lock_response.status_code, status.HTTP_200_OK)
        self.assertTrue(lock_response.data['courses_locked'])
        self.assertEqual(add_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(remove_response.status_code, status.HTTP_403_FORBIDDEN)
