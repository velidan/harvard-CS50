from django.contrib.auth import authenticate, login, logout

from django.shortcuts import  render, redirect
from django.urls import reverse

from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from django.utils import timezone
from .forms import SignUpForm, SignInForm
from django.contrib.auth import login, logout
from django.contrib import messages
from django.db.models import F, Sum, DecimalField, Case, When, Value

from django.views import View
from django.db.models import Count, Q
from django.db.models.functions import TruncMonth, ExtractYear
from django.contrib.auth import get_user_model

from rest_framework.decorators import api_view

from rest_framework.response import Response
from rest_framework import status
from auditor.serializers import UserSerializer, CostCategorySerializer, CostRecordSerializer
from rest_framework import viewsets
from .models import CostCategory, CostRecord

from .permissions import CustomIsAuthorizedPermission
from .pagination import Pagination

User = get_user_model()

import logging
logger = logging.getLogger('django')


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'cost-category': reverse('const-category-list', request=request, format=format),
        'cost-record': reverse('cost-record-list', request=request, format=format),
    })


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
 

class CostCategoryViewSet(viewsets.ModelViewSet):
    queryset = CostCategory.objects.all()
    serializer_class = CostCategorySerializer
    parser_classes = [MultiPartParser]

    permission_classes = (CustomIsAuthorizedPermission, )
   
	

    def get_queryset(self):
        queryset = CostCategory.objects.all()
        ordering = self.request.query_params.get('ordering', '-id')  

        allowed_fields = [field.name for field in CostCategory._meta.get_fields()]
        ordering = ordering if ordering.lstrip('-') in allowed_fields else '-id'

        return queryset.order_by(ordering)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

	
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        mutable_data = request.data.copy()
        mutable_data['user'] = self.request.user.id
        
        serializer = self.get_serializer(instance, data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)
        
    @action(detail=False, methods=['GET'])
    def all_unpaginated_categories(self, request):
        categories = CostCategory.objects.all()


   
        serializer = self.get_serializer(categories, many=True)
        headers = self.get_success_headers(serializer.data)
 
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers) 



class CostRecordViewSet(viewsets.ModelViewSet):
    serializer_class = CostRecordSerializer

    permission_classes = (CustomIsAuthorizedPermission, )
	
    filterset_fields = ('category', )

    def get_queryset(self):
        user = self.request.user
        queryset = CostRecord.objects.filter(user=user)

        category_id = self.request.query_params.get('category')
        uncategorized = self.request.query_params.get('uncategorized')
        if uncategorized == 'true':
            queryset = queryset.filter(category__isnull=True)

        if category_id:
            queryset = queryset.filter(Q(category__id=category_id) | Q(template=True))

        month = self.request.query_params.get('month')
        if month:
            month_date = timezone.datetime.strptime(month, "%Y-%m")
            queryset = queryset.filter(timestamp__month=month_date.month, timestamp__year=month_date.year)

        queryset = queryset.annotate(
            total_value=Case(
                When(total__isnull=True, then=Value(0)),
                default=F('total'),
                output_field=DecimalField()
            )
        )

        return queryset.order_by('-timestamp')

    def create(self, request, *args, **kwargs):
      request.data['user'] = self.request.user.id
     
      serializer = self.get_serializer(data=request.data)
      serializer.is_valid(raise_exception=True)
      self.perform_create(serializer)
      headers = self.get_success_headers(serializer.data)
      return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
	
    def update(self, request, *args, **kwargs):

      request.data['user'] = self.request.user.id
      instance = self.get_object()
     
      serializer = self.serializer_class(instance=instance,
                                           data=request.data,
                                           )
      serializer.is_valid(raise_exception=True)
      self.perform_update(serializer)
      headers = self.get_success_headers(serializer.data)
      return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)
	
    @action(detail=False, methods=['GET'])
    def templates(self, request):
        templates = CostRecord.objects.filter(template=True, user=request.user)

        print(templates)
        paginator = Pagination()
        result_page = paginator.paginate_queryset(templates, request)

        serializer = self.get_serializer(result_page, many=True)
        
        return paginator.get_paginated_response(serializer.data)
	
    @action(detail=False, methods=['GET'])
    def all_unpaginated_templates(self, request):
			
        templates = CostRecord.objects.filter(template=True, user=request.user)


        serializer = self.get_serializer(templates, many=True)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)
	
    @action(detail=False, methods=['GET'])
    def costs_total(self, request):
        category_id = request.query_params.get('category')


        queryset = CostRecord.objects.filter(user=request.user)
        if category_id:
            queryset = queryset.filter(category__id=category_id)
        
        total_sum = queryset.aggregate(total_sum=Sum('total'))['total_sum'] or 0
        return Response({'total_sum': total_sum}) 


    @action(detail=False, methods=['GET'])
    def costs_total_by_category(self, request):
        """
        Retrieve total costs grouped by category.
        """
        queryset = CostRecord.objects.filter(user=request.user)

        queryset = queryset.values('category__id', 'category__title').annotate(
            total_sum=Sum(
                Case(
                    When(total__isnull=True, then=Value(0)),
                    default=F('total'),
                    output_field=DecimalField()
                )
            )
        )

        result = {'total_by_categories': {item['category__title']: {'id': item['category__id'], 'total_sum': item['total_sum'], 'title': item['category__title']} for item in queryset}}

        return Response(result)
    
    @action(detail=False, methods=['GET'])
    def created_years_months(self, request):
        """
        Retrieve a dictionary where the keys are years
        and the values are lists of months when costs were created.
        """
        user = self.request.user

        counts_by_month = (
            CostRecord.objects.filter(user=user)
            .annotate(year=ExtractYear('timestamp'), month=TruncMonth('timestamp'))
            .values('year', 'month')
            .annotate(count=Count('id'))
        )

        year_month_dict = {}
        for entry in counts_by_month:
            year = entry['year']
            month = entry['month'].month

            if year not in year_month_dict:
                year_month_dict[year] = []

            year_month_dict[year].append(month)

        return Response(year_month_dict)

class IndexView(View):

	def get(self, request, path=''):
            username = request.user.username
            return render(request, 'auditor/index.html', {'username': username})



def logout_view(request):
	logout(request)
	return redirect("auditor:index")


class SignInView(View):
    def post(self, request):
        form = SignInForm(request, data=request.POST)

        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)

            if user is not None:
                login(request, user)
                messages.info(request, f"You are now logged in as {username}.")
                return redirect("auditor:index") 
            else:
                messages.error(request, "Invalid username or password.")
        else:
          
            return render(request, "auditor/sign_in.html", {"sign_in_form": form})

    def get(self, request):
        form = SignInForm()
        return render(request, "auditor/sign_in.html", {
		"sign_in_form": form
	})


class SignUpView(View):
    def post(self, request):
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Registration successful.")
            return redirect("auditor:index")  
        else:
            messages.error(request, form.errors)
            return render(request, "auditor/sign_up.html", {"sign_up_form": form})

    def get(self, request):
        form = SignUpForm()
        return render(request, "auditor/sign_up.html", {"sign_up_form": form})