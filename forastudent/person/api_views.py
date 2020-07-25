from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, RetrieveUpdateDestroyAPIView
from .serializers import *
from .models import *
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from django.core.cache import cache


class GeneralPagination(LimitOffsetPagination):
    default_limit = 5
    max_limit = 10


class PersonList(ListAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = ('type', 'location')
    search_fields = ('name',)
    pagination_class = GeneralPagination


class MeetingList(ListAPIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filter_fields = ('id', 'number', 'participants', 'time')
    search_fields = ('name',)
    pagination_class = GeneralPagination


class MeetingCreate(CreateAPIView):
    serializer_class = MeetingSerializer

    def create(self, request, *args, **kwargs):
        time = request.data.get('time')
        # now = timezone.now()
        # if time < now:
        #     raise ValidationError({'time': 'Must be in the future'})
        #
        return super().create(request, *args, **kwargs)


class MeetingRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = Meeting.objects.all()
    lookup_field = 'id'
    serializer_class = MeetingSerializer

    def delete(self, request, *args, **kwargs):
        mid = request.data.get('id')
        response = super().delete(request, *args, **kwargs)
        if response.status_code == 204:
            cache.delete(f'meeting_data_{mid}')
        return response

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 200:
            meeting = response.data
            cache.set(f"meeting_data_{meeting['id']}", {
                'name': meeting['name'],
                'time': meeting['time'],
                'number': meeting['number'],
                'participants': meeting['participants'],
            })
        return response
