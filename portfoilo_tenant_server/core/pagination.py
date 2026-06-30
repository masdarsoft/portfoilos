"""
core/pagination.py
------------------
Standard pagination class used across all list endpoints.
"""
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardResultsPagination(PageNumberPagination):
    """
    Default paginator:
    - page_size: 50 records
    - Overridable via ?page_size= query param (max 200)
    - Response envelope includes count, next, previous, results
    """

    page_size = 50
    page_size_query_param = "page_size"
    max_page_size = 200

    def get_paginated_response(self, data):
        return Response(
            {
                "count": self.page.paginator.count,
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "results": data,
            }
        )
