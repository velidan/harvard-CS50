from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import  render, redirect
from django.urls import reverse

from .forms import SignUpForm, SignInForm
from django.contrib.auth import login, logout
from django.contrib import messages

from django.views import View

from django.contrib.auth import get_user_model
User = get_user_model()

import logging
logger = logging.getLogger('django')

from rest_framework.decorators import api_view
from rest_framework.response import Response
from auditor.serializers import UserSerializer, CostCategorySerializer, CostRecordSerializer
from rest_framework import viewsets
from .models import CostCategory, CostRecord


'''
messages.debug(request, '%s SQL statements were executed.' % count)
messages.info(request, 'Three credits remain in your account.')
messages.success(request, 'Profile details updated.')
messages.warning(request, 'Your account expires in three days.')
messages.error(request, 'Document deleted.')
'''


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'cost-category': reverse('const-category-list', request=request, format=format),
        'cost-record': reverse('cost-record-list', request=request, format=format),
    })


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `retrieve` actions.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # lookup_field = 'username'  # Set the lookup field to 'username'


class CostCategoryViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """
    queryset = CostCategory.objects.all()
    serializer_class = CostCategorySerializer


class CostRecordViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """
    queryset = CostRecord.objects.all()
    serializer_class = CostRecordSerializer



class IndexView(View):
	def get(self, request):
		return render(request, "auditor/index.html")

# def index(request):
# 	return HttpResponse("Hello, world. Auditor")



def logout_view(request):
	logout(request)
	return redirect("auditor:index")

# def sign_in_view(request):
# 	form = SignInForm()
# 	if request.method == "POST":
# 		logger.info('POST LOGIN')
# 		form = form = SignInForm(request, data=request.POST)

# 		if form.is_valid():
# 			username = form.cleaned_data.get('username')
# 			password = form.cleaned_data.get('password')
# 			user = authenticate(username=username, password=password)

# 			if user is not None:
# 				login(request, user)
# 				messages.info(request, f"You are now logged in as {username}.")
# 				return redirect("auditor:index")
# 			else:
# 				messages.error(request,"Invalid username or password.")
# 		else:
# 			messages.error(request,"Invalid username or password.")
		
# 	return render (request, "auditor/sign_in.html", {
# 		"sign_in_form": form
# 	})

class SignInView(View):
	def post(self, request):
		form = form = SignInForm(request, data=request.POST)

		if form.is_valid():
			username = form.cleaned_data.get('username')
			password = form.cleaned_data.get('password')
			user = authenticate(username=username, password=password)

			if user is not None:
				login(request, user)
				messages.info(request, f"You are now logged in as {username}.")
				return redirect("auditor:index")
			else:
				messages.error(request,"Invalid username or password.")
		else:
			messages.error(request,"Invalid username or password.")


	def get(self, request):
		form = SignInForm()
		return render(request, "auditor/sign_in.html", {
		"sign_in_form": form
	})

# def sign_up_view(request):
# 	form = SignUpForm()
# 	if request.method == "POST":

# 		form = SignUpForm(request.POST)
# 		print(f"fffffffffff {form.is_valid()}")
# 		print(form.errors)
# 		if form.is_valid():
# 			user = form.save()
# 			print('SUCCESS')
# 			login(request, user)
# 			messages.success(request, "Registration successful." )
# 			return redirect("auditor:index")
# 		messages.error(request, form.errors)
	
# 	return render(request, "auditor/sign_up.html", {
# 		"sign_up_form":form
# 		})

class SignUpView(View):
	def post(self, request):
		form = SignUpForm(request.POST)
		print(form.errors)
		if form.is_valid():
			user = form.save()
			login(request, user)
			messages.success(request, "Registration successful." )
			return redirect("auditor:index")
		messages.error(request, form.errors)


	def get(self, request):
		form = SignUpForm()
		return render(request, "auditor/sign_up.html", {
		"sign_up_form":form
		})