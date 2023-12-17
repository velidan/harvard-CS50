from django.contrib.auth import get_user_model
from rest_framework import pagination
from rest_framework.response import Response
from django.conf import settings

class Pagination(pagination.PageNumberPagination):

    def get_paginated_response(self, data):
        return Response({
            'links': {
               'next': self.get_next_link(),
               'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'results': data
        })