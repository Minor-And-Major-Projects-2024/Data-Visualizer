

from collections import defaultdict
import json
from django.http import JsonResponse
import random
from django.shortcuts import render
from requests import Response
from rest_framework.decorators import api_view
from datetime import datetime
from pytz import timezone, utc

from Dbackend.models import ArticleDetails
from Dbackend.serializers import ArticleDetailsSerializer
from django.db.models.functions import Coalesce
from django.db.models import Sum, F, Q, Min, Max, Avg, Count


@api_view(['GET'])
def get_csrf_token(request):
    csrf_token = request.COOKIES.get('csrftoken')
    print(csrf_token)
    return JsonResponse({'csrfToken': csrf_token})


@api_view(['GET'])
def home(request):
    articles = ArticleDetails.objects.all()

    message = 'Get APIs working, backend connected'
    return JsonResponse({'message': message}, safe=False)


@api_view(['POST'])
def pie_chart_country(request):
    all_data = ArticleDetails.objects.all()
    region_clicked = request.POST.get("region")

    country_data = defaultdict(int)
    for data in all_data:

        if data.region == region_clicked:
            if not data.country:
                country_name = "unverified"
            else:
                country_name = data.country

            country_data[country_name] += 1
    country_data = dict(country_data)

    return JsonResponse(country_data)


@api_view(['GET'])
def pie_chart_region(request):
    all_data = ArticleDetails.objects.all()

    region_data = defaultdict(int)

    for data in all_data:

        if data.region == "World":
            region_name = "All"
        elif not data.region:
            region_name = "unverified"
        else:
            region_name = data.region

        region_data[region_name] += 1

    region_data = dict(region_data)

    return JsonResponse(region_data)


@api_view(['GET'])
def bar_graph_Source(request):
    all_data = ArticleDetails.objects.all()

    source_data = defaultdict(int)

    for data in all_data:

        if not data.source:
            source_name = "unverified"
        else:
            source_name = data.source

        source_data[source_name] += 1

    source_data = dict(source_data)

    return JsonResponse(source_data)


@api_view(['GET'])
def pie_chart_pestle(request):
    all_data = ArticleDetails.objects.all()

    pestle_data = defaultdict(int)

    for data in all_data:

        if not data.pestle:
            pestle_name = "unrelated"
        else:
            pestle_name = data.pestle

        pestle_data[pestle_name] += 1

    pestle_data = dict(pestle_data)

    return JsonResponse(pestle_data)


@api_view(['POST'])
def pie_chart_topic(request):
    all_data = ArticleDetails.objects.all()
    if request.method == 'POST':
        sector_selected = request.POST.get('sector')

        print(sector_selected)
        all_data = ArticleDetails.objects.filter(sector=sector_selected)

    pestle_data = defaultdict(int)

    for data in all_data:

        if not data.pestle:
            pestle_name = "unrelated"
        else:
            pestle_name = data.pestle

        pestle_data[pestle_name] += 1

    pestle_data = dict(pestle_data)

    return JsonResponse(pestle_data)


@api_view(['GET', 'POST'])
def pie_chart_sector(request):
    all_data = ArticleDetails.objects.all()
    if request.method == 'POST':
        pestle_selected = request.POST.get('pestle')
        print(pestle_selected)

        all_data = ArticleDetails.objects.filter(pestle=pestle_selected)
    else:
        all_data = ArticleDetails.objects.all()

    sector_data = defaultdict(int)

    for data in all_data:

        if not data.sector:
            sector_name = "unrelated"
        else:
            sector_name = data.sector

        sector_data[sector_name] += 1

    sector_data = dict(sector_data)

    return JsonResponse(sector_data)


@api_view(['POST'])
def area_chart_sector_topic(request):
    if request.method == 'POST':
        sector_clicked = request.POST.get('sector')
        topic_clicked = request.POST.get('topic')

        date_likelihood = ArticleDetails.objects.filter(sector=sector_clicked, topic=topic_clicked) \
            .values('published', 'added') \
            .annotate(average_likelihood=Avg('likelihood'))

        date_data = {}
        for entry in date_likelihood:
            date = entry['published'] or entry['added']
            average_likelihood = round(entry['average_likelihood'])
            date_str = date.strftime('%Y-%m-%d')
            date_data[date_str] = average_likelihood

        response_data = {
            'sector': sector_clicked,
            'topic': topic_clicked,
            'data': date_data,
        }
        return JsonResponse(response_data)


@api_view(['GET'])
def fetch_sectors(request):

    sectors = ArticleDetails.objects.values('sector').distinct()
    listed_sectors = []
    for sector in sectors:
        if sector['sector']:
            sector['sector'] = sector['sector']
            listed_sectors.append(sector['sector'])
        else:
            sector['sector'] = 'Unrelated'
            listed_sectors.append(sector['sector'])
    sectors = listed_sectors
    return JsonResponse(sectors, safe=False)


@api_view(['POST'])
def fetch_topics(request):

    if request.method == 'POST':
        selected_sector = request.POST.get('sector')
        topics = ArticleDetails.objects.filter(
            sector=selected_sector).values('topic').distinct()
        listed_topics = []
        for topic in topics:
            if topic['topic']:
                topic['topic'] = topic['topic']
                listed_topics.append(topic['topic'])
            else:
                topic['topic'] = 'Unrelated'
                listed_topics.append(topic['topic'])
        topics = listed_topics
    return JsonResponse(topics, safe=False)


@api_view(['POST'])
def dot_graph_pestle_sector_inetnsity(request):
    pestle_selected = request.POST.get('pestle')

    articles = ArticleDetails.objects.filter(pestle=pestle_selected)

    grouped_data = articles.values('published__date', 'added__date', 'sector').annotate(
        intensity_sum=Avg(Coalesce('intensity', 0))
    )

    dot_graph_data = {}
    for entry in grouped_data:
        date = entry['published__date'] or entry['added__date']
        date_str = date.strftime('%Y-%m-%d')
        if not entry['sector']:
            sector = "unrelated"
        else:
            sector = entry['sector']
        intensity_sum = round(entry['intensity_sum'])

        if date_str not in dot_graph_data:
            dot_graph_data[date_str] = []

        dot_graph_data[date_str].append(
            {'sector': sector, 'intensity_sum': intensity_sum})

    return JsonResponse(dot_graph_data)


@api_view(['POST'])
def dot_graph_sector_topic_relevance(request):
    sector_selected = request.POST.get('sector')

    articles = ArticleDetails.objects.filter(sector=sector_selected)

    grouped_data = articles.values('published__date', 'added__date', 'topic').annotate(
        relevance_sum=Sum(Coalesce('relevance', 0))
    )

    dot_graph_data = {}
    for entry in grouped_data:
        date = entry['published__date'] or entry['added__date']
        date_str = date.strftime('%Y-%m-%d')
        topic = entry['topic']
        relevance_sum = entry['relevance_sum']

        if date_str not in dot_graph_data:
            dot_graph_data[date_str] = []

        dot_graph_data[date_str].append(
            {'topic': topic, 'relevance_sum': relevance_sum})

    return JsonResponse(dot_graph_data)


@api_view(['GET'])
def bar_graph_sector_topic_likelihood(request):
    all_data = ArticleDetails.objects.all()

    grouped_data = ArticleDetails.objects.values('sector', 'topic').annotate(
        avg_likelihood=Avg('likelihood')
    )

    bar_graph_data = {}
    for entry in grouped_data:
        sector = entry['sector'] or 'Unrelated'
        topic = entry['topic'] or 'not_mentioned'
        avg_likelihood = entry['avg_likelihood']

        if sector not in bar_graph_data:
            bar_graph_data[sector] = []

        avg_likelihood = round(avg_likelihood)
        bar_graph_data[sector].append(
            {'topic': topic, 'avg_likelihood': avg_likelihood})

    return JsonResponse(bar_graph_data)


@api_view(['POST'])
def table_topic_insights_details(request):
    sector_clicked = request.POST.get('sector')
    topic_clicked = request.POST.get('topic')

    articles = ArticleDetails.objects.filter(
        sector=sector_clicked, topic=topic_clicked)

    table_data = []
    for article in articles:
        table_data.append({
            'insight': article.insight,
            'url': article.url,
            'title': article.title,
            'source': article.source,
            'start_year': article.start_year,
            'end_year': article.end_year,
        })

    response_data = {
        'sector': sector_clicked,
        'topic': topic_clicked,
        'table_data': table_data,
    }

    return JsonResponse(response_data)


@api_view(['GET'])
def dot_graph_for_insights_published_date(request):

    grouped_data = ArticleDetails.objects.values(
        'added', 'published', 'insight', 'title')

    dot_graph_data = defaultdict(list)
    for entry in grouped_data:
        date = entry['published'] or entry['added']
        insight = entry['insight']
        title = entry['title']

        if len(insight) > 30:
            insight = insight[:30] + '...'

        dot_graph_data[date.strftime('%Y-%m-%d')].append({
            'insight': insight,
            'title': title,
        })

    return JsonResponse(dict(dot_graph_data))
