import csv
from pathlib import Path

from django.core.management.base import BaseCommand

from Users.models import User


class Command(BaseCommand):
    help = 'Export locked and unlocked student course registrations to CSV.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            default='registrations.csv',
            help='CSV output path. Defaults to registrations.csv in the current directory.',
        )

    def handle(self, *args, **options):
        output_path = Path(options['output']).resolve()
        output_path.parent.mkdir(parents=True, exist_ok=True)

        users = User.objects.order_by('email')
        rows_written = 0

        with output_path.open('w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(
                csvfile,
                fieldnames=[
                    'email',
                    'full_name',
                    'contact_number',
                    'courses_locked',
                    'course_id',
                    'all_course_ids',
                ],
            )
            writer.writeheader()

            for user in users:
                courses = user.courses or []
                if not courses:
                    writer.writerow(self.build_row(user, '', courses))
                    rows_written += 1
                    continue

                for course_id in courses:
                    writer.writerow(self.build_row(user, course_id, courses))
                    rows_written += 1

        self.stdout.write(
            self.style.SUCCESS(f'Exported {rows_written} registration rows to {output_path}')
        )

    def build_row(self, user, course_id, courses):
        return {
            'email': user.email,
            'full_name': user.full_name,
            'contact_number': user.contact_number,
            'courses_locked': user.courses_locked,
            'course_id': course_id,
            'all_course_ids': ','.join(courses),
        }
