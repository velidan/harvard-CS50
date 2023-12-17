import django_filters.rest_framework

from .models import CostCategory


class CostCategoryFilter(django_filters.FilterSet):
    description = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = CostCategory
        fields = ['description']