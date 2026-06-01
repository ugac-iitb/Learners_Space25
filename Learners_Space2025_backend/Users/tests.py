from django.core import mail
from django.core.cache import cache
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
    def setUp(self):
        cache.clear()

    def signup_payload(self, email='student@iitb.ac.in'):
        return {
            'full_name': 'Test Student',
            'email': email,
            'contact_number': '9876543210',
            'programme': 'B.Tech',
            'department': 'Computer Science and Engineering',
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

    def test_signup_throttles_repeated_otp_requests(self):
        payload = self.signup_payload()

        first_response = self.client.post('/user/signup/', payload, format='json')
        second_response = self.client.post('/user/signup/', payload, format='json')

        self.assertEqual(first_response.status_code, status.HTTP_200_OK)
        self.assertEqual(second_response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
        self.assertEqual(len(mail.outbox), 1)

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

    def test_signup_requires_valid_programme_and_department(self):
        # Invalid programme
        payload = self.signup_payload()
        payload['programme'] = 'InvalidProg'
        response = self.client.post('/user/signup/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('programme', response.data)

        # Mismatching department
        payload = self.signup_payload()
        payload['programme'] = 'B.S.'
        payload['department'] = 'Computer Science and Engineering'
        response = self.client.post('/user/signup/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('department', response.data)

    def test_verify_signup_otp_brute_force_mitigation(self):
        self.client.post('/user/signup/', self.signup_payload(), format='json')

        # 4 failed OTP attempts
        for _ in range(4):
            response = self.client.post(
                '/user/verify-signup/',
                {'email': 'student@iitb.ac.in', 'otp': '000000'},
                format='json',
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # 5th attempt should trigger blocking and return blocked error
        response = self.client.post(
            '/user/verify-signup/',
            {'email': 'student@iitb.ac.in', 'otp': '000000'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Too many failed OTP attempts', response.data['otp'][0])

        # 6th attempt should return expired/cancelled error
        response = self.client.post(
            '/user/verify-signup/',
            {'email': 'student@iitb.ac.in', 'otp': '000000'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('expired or was not requested', response.data['error'])


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.console.EmailBackend',
    DJANGO_ALLOW_CONSOLE_EMAIL=False,
)
class SignupEmailConfigurationTests(APITestCase):
    def setUp(self):
        cache.clear()

    def test_signup_fails_clearly_when_email_delivery_is_not_configured(self):
        response = self.client.post(
            '/user/signup/',
            {
                'full_name': 'No SMTP',
                'email': 'nosmtp@iitb.ac.in',
                'contact_number': '9876543210',
                'programme': 'B.Tech',
                'department': 'Computer Science and Engineering',
                'password': 'strongpass123',
                'confirm_password': 'strongpass123',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertIn('Configure SMTP settings', response.data['error'])
        self.assertEqual(User.objects.count(), 0)


class CourseLockTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='locked@iitb.ac.in',
            full_name='Locked Student',
            contact_number='9876543210',
            programme='B.Tech',
            department='Computer Science and Engineering',
            password='strongpass123',
        )
        self.client.force_authenticate(user=self.user)

    def test_user_can_deregister_before_lock(self):
        self.user.courses = ['68', '69']
        self.user.save()

        response = self.client.delete('/user/courses/', {'courses': ['68']}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['courses'], ['69'])

    def test_lock_blocks_registration_changes(self):
        lock_response = self.client.post('/user/courses/lock/', {}, format='json')
        add_response = self.client.post('/user/courses/', {'courses': ['68']}, format='json')
        remove_response = self.client.delete('/user/courses/', {'courses': ['68']}, format='json')

        self.assertEqual(lock_response.status_code, status.HTTP_200_OK)
        self.assertTrue(lock_response.data['courses_locked'])
        self.assertEqual(add_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(remove_response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_courses_validation(self):
        # Registering non-existent course ID should be rejected
        add_response = self.client.post('/user/courses/', {'courses': ['NON-EXISTENT-ID']}, format='json')
        self.assertEqual(add_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('is not a valid course', add_response.data['error'])

        # Registering invalid characters should be rejected
        add_response = self.client.post('/user/courses/', {'courses': ['course; DROP TABLE Users;']}, format='json')
        self.assertEqual(add_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('contains invalid characters', add_response.data['error'])

        # Valid course ID (e.g. '68') should succeed
        add_response = self.client.post('/user/courses/', {'courses': ['68']}, format='json')
        self.assertEqual(add_response.status_code, status.HTTP_200_OK)
        self.assertEqual(add_response.data['courses'], ['68'])
