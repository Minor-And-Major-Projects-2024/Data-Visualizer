from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import ArticleDetails


class ArticleDetailsAdmin(admin.ModelAdmin):
    list_display = ('end_year', 'intensity', 'sector', 'topic', 'insight', 'url', 'region', 'start_year',
                    'impact', 'added', 'published', 'country', 'relevance', 'pestle', 'source', 'title', 'likelihood')


admin.site.register(ArticleDetails, ArticleDetailsAdmin)
