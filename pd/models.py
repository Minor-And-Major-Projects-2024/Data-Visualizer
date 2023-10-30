import random
from django.db import models


def generate_default_pk_name_location():
    return f"{random.randint(123456789, 987654321)}"


class FileData(models.Model):
    name = models.CharField(max_length=255)
    content = models.TextField()
    location = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    pk_name_location = models.CharField(
        max_length=510,
        primary_key=True,
        default=generate_default_pk_name_location
    )

    def save(self, *args, **kwargs):
        self.pk_name_location = f"{self.name}_{self.location}"
        super(FileData, self).save(*args, **kwargs)
