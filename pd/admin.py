
# Register your models here.
from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import FileData


class StorageDetails(admin.ModelAdmin):
    list_display = ('pk_name_location', 'name', 'location', 'timestamp')


admin.site.register(FileData, StorageDetails)
