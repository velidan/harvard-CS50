import django_filters.rest_framework

from .models import CostCategory


class CostCategoryFilter(django_filters.FilterSet):
    title__icontains = django_filters.CharFilter(field_name='title', lookup_expr='icontains')

    class Meta:
        model = CostCategory
        fields = ['title__icontains']