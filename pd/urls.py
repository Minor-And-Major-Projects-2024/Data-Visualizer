
from django.urls import path
from . import views

urlpatterns = [
    path('storage/', views.store_pd, name='storage'),
    path('retrieve/', views.retrieve_pd, name='retrieve'),
    path('retrieveFile/', views.retrieveFile, name='retrieveFile'),
    path('search/', views.search, name='search'),
]
