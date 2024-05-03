from rest_framework import pagination
from rest_framework.response import Response

class CustomPagination(pagination.PageNumberPagination):
    def get_paginated_response(self, data):
        return Response({
            'current': self.page.number,
            'count': self.page.paginator.count,
            'pages': self.page.paginator.num_pages, 
            'results': data
        })