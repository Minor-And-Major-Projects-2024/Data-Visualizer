# serializers.py

from rest_framework import serializers
from .models import ArticleDetails


class ArticleDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleDetails
        fields = '__all__'
