import json
from django.core.management.base import BaseCommand
from datetime import datetime
from pytz import timezone
from Dbackend.models import ArticleDetails


class Command(BaseCommand):
    help = 'Insert JSON data into the database'

    def handle(self, *args, **kwargs):
        try:
            with open('./static_data/management/commands/JSON/jsondata.json', 'r', encoding='utf-8') as json_file:
                data = json.load(json_file)

                for item in data:

                    existing_article = ArticleDetails.objects.filter(
                        title=item['title']).first()

                    if not existing_article:

                        added = None
                        published = None

                        if item.get('added'):
                            added = datetime.strptime(
                                item['added'], '%B, %d %Y %H:%M:%S')
                            added = added.replace(tzinfo=timezone('GMT'))

                        if item.get('published'):
                            published = datetime.strptime(
                                item['published'], '%B, %d %Y %H:%M:%S')
                            published = published.replace(
                                tzinfo=timezone('GMT'))

                        ArticleDetails.objects.create(
                            end_year=item['end_year'],
                            intensity=item['intensity'],
                            sector=item['sector'],
                            topic=item['topic'],
                            insight=item['insight'],
                            url=item['url'],
                            region=item['region'],
                            start_year=item['start_year'],
                            impact=item['impact'],
                            added=added,
                            published=published,
                            country=item['country'],
                            relevance=item['relevance'],
                            pestle=item['pestle'],
                            source=item['source'],
                            title=item['title'],
                            likelihood=item['likelihood']
                        )

                        self.stdout.write(self.style.SUCCESS(
                            f'Article "{item["title"]}" inserted.'))

                    else:
                        self.stdout.write(self.style.WARNING(
                            f'Article "{item["title"]}" already exists.'))

                self.stdout.write(self.style.SUCCESS(
                    'Data loaded successfully'))

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR('JSON file not found'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'An error occurred: {e}'))
