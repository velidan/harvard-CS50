from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms

from .models import *

import logging
logger = logging.getLogger('django')

def get_categories():
    categories = Category.objects.all()
    logger.info(categories)

GEEKS_CHOICES =(
    ("1", "One"),
    ("2", "Two"),
    ("3", "Three"),
    ("4", "Four"),
    ("5", "Five"),
)

class CreateListingForm(forms.Form):
    title = forms.CharField(label="Title", widget=forms.TextInput(attrs={'class':'field create-title'}))
    description = forms.CharField(label="Description", widget=forms.Textarea(attrs={"rows":"5"}))
    starting_bid = forms.DecimalField(label="Starting Bid",)
    image_url = forms.URLField(label="Image URL", required=False)
    category = forms.ModelChoiceField(queryset=Category.objects.all(), label="Category",  required=False)

def index(request):
    return render(request, "auctions/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")
    

def create_listing(request):
    if request.method == "POST":
        form = CreateListingForm(request.POST)
        if form.is_valid():

            current_user_id = request.user.id
            user = User.objects.get(pk=current_user_id)

            logger.info('-----------')
            logger.info(f'ID -> {current_user_id}, user-> {user}')

            title = form.cleaned_data["title"]
            description = form.cleaned_data["description"]
            starting_bid = form.cleaned_data["starting_bid"]
            image_url = form.cleaned_data["image_url"]
            category = form.cleaned_data["category"]

            new_listing = Listing(title=title, description=description, start_bid=starting_bid, owner=request.user, current_price=starting_bid, image_url=image_url)
            new_listing.save()


            new_listing.category.add(category)

        
    


            return HttpResponseRedirect(reverse("index"))
        else:
            return HttpResponseRedirect(reverse("index"))
        # title = request.POST["title"]
        # description = request.POST["description"]

        # # Ensure password matches confirmation
        # starting_bid = request.POST["starting_bid"]
        # image_url = request.POST["image_url"]
        # category = request.POST["category"]
        # new_listing = Listing(title=title, description=description, starting_bid=starting_bid, image_url=image_url, category=category)
        # new_listing.save();
        # logger.info('---------------------------')
        # logger.info(f'{title}: {description}: {starting_bid}: {image_url}: {category}')
        # get_categories()
        # logger.info('---------------------------')
    else:
        return render(request, "auctions/create_listing.html", {
            "create_listing_form": CreateListingForm()
        })