
from django.contrib.staticfiles.views import serve
from django.shortcuts import render


def index(request):
    return render(request, 'dist/index.html')
