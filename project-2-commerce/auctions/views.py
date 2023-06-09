from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django import forms
from django.utils import timezone

from .models import *

import logging
logger = logging.getLogger('django')

class CreateListingForm(forms.Form):
    title = forms.CharField(label="Title", widget=forms.TextInput(attrs={'class':'field create-title'}))
    description = forms.CharField(label="Description", widget=forms.Textarea(attrs={"rows":"5"}))
    starting_bid = forms.DecimalField(label="Starting Bid",)
    image_url = forms.URLField(label="Image URL", required=False)
    category = forms.ModelChoiceField(queryset=Category.objects.all(), label="Category",  required=False)

class ProceedListingForm(forms.Form):
    in_watchlist = forms.BooleanField(required=False)
    bid = forms.DecimalField(label="Your Bid", required=False)
    comment = forms.CharField(label="Write a Comment", widget=forms.Textarea(attrs={"rows":"5"}), required=False)

def index(request):
    listings = Listing.objects.filter(is_active=True)
    user = request.user

    watched_listings_count = user.watched_listings.count() if user.is_authenticated else None  

    return render(request, "auctions/index.html", {
        "listings": listings,
        "nav": "index",
        "watched_listings_count": watched_listings_count
    })


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
                "message": "Invalid username and/or password.",
                "nav": "login"
            })
    else:
        return render(request, "auctions/login.html", {"nav": "login"})


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        if not username:
            return render(request, "auctions/register.html", {
                "message": "Please, enter Username.",
                "nav": "register"
            })

        if not email:
            return render(request, "auctions/register.html", {
                "message": "Please, enter Email.",
                "nav": "register"
            })

        # Ensure password matches confirmation
        password = request.POST["password"]

        if not password:
            return render(request, "auctions/register.html", {
                "message": "Please, enter password.",
                "nav": "register"
            })

        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match.",
                "nav": "register"
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken.",
                "nav": "register"
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html", {
            "nav": "register"
        })
    

def create_listing(request):
    user = request.user

    watched_listings_count = user.watched_listings.count() if user.is_authenticated else None  

    if request.method == "POST":
        form = CreateListingForm(request.POST)
        if form.is_valid():

            title = form.cleaned_data["title"]
            description = form.cleaned_data["description"]
            starting_bid = form.cleaned_data["starting_bid"]
            image_url = form.cleaned_data["image_url"]
            category = form.cleaned_data["category"]

            new_listing = Listing(title=title, description=description, start_bid=starting_bid, owner=request.user, image_url=image_url)
            new_listing.save()


            new_listing.category.add(category)

            return HttpResponseRedirect(reverse("index"))
        else:
            return HttpResponseRedirect(reverse("index"))

    else:
        return render(request, "auctions/create_listing.html", {
            "create_listing_form": CreateListingForm(),
            "nav": "create_listing",
            "watched_listings_count": watched_listings_count
        })
    
def listing(request, id):
    listing = Listing.objects.get(pk=id)
    user = request.user

 

    is_listing_in_user_watchlist = user in listing.watched_users.all()
 
    if request.method == 'POST':
        # a trick to handle multiple forms on the same page
        if request.POST.get("form_type") == 'proceed-listing-form':
            #Handle Elements from first Form
            form = ProceedListingForm(request.POST)
            if form.is_valid():


                # listing.is_in_watchlist = form.cleaned_data["in_watchlist"]
                # listing.save()
                in_watchlist_field = form.cleaned_data["in_watchlist"]

        
                if is_listing_in_user_watchlist:
                    # user wants to remove it from the watchlist
                    if not in_watchlist_field:
                        listing.watched_users.remove(user)
                        # a quick update the marker for the further handling 
                        is_listing_in_user_watchlist = False
     
                    
                elif in_watchlist_field: 
                    listing.watched_users.add(user)
                    # a quick update the marker for the further handling 
                    is_listing_in_user_watchlist = True
    


                bid_price = form.cleaned_data["bid"]
                comment_text = form.cleaned_data["comment"]
         
        
                if bid_price:
                    # Handle min bid error
                   if listing.current_price >= bid_price:
                        
                        watched_listings_count = user.watched_listings.count() if user.is_authenticated else None 

                        return render(request, "auctions/listing.html", {
                            "listing": listing,
                            "proceed_listing_form": ProceedListingForm(initial={ 'in_watchlist': is_listing_in_user_watchlist, "bid": bid_price, 'comment': comment_text}),
                            "bid_error": f"Bid must be bigger than the current price: {listing.current_price}",
                            "nav": "listing",
                            "watched_listings_count": watched_listings_count
                        })
                   else: 
                       bid = Bid(target_listing=listing, price=bid_price, owner=request.user)
                       bid.save()

                       # should update the current_price in listing
                       listing.current_price = bid.price
                       listing.save()

                if comment_text:
                    comment = Comment(listing=listing, author=request.user, text=comment_text)
                    comment.save()

        elif request.POST.get("form_type") == 'close-listing-form':
            
            last_bid = listing.bids.last()
            listing.win_bid = last_bid
            listing.is_active = False
            listing.closed_at = timezone.now()
            listing.save()

    proceed_listing_form = ProceedListingForm(initial={ 'in_watchlist': is_listing_in_user_watchlist})

    bids_count = listing.bids.count()
    is_latest_bid_yours = False
    
    if bids_count > 0:
        is_latest_bid_yours = True if listing.bids.last().owner.id == user.id else False
    watched_listings_count = user.watched_listings.count() if user.is_authenticated else None 
    
    return render(request, "auctions/listing.html", {
        "listing": listing,
        "proceed_listing_form": proceed_listing_form,
        "nav": "listing",
        "bids_count": bids_count,
        "is_latest_bid_yours": is_latest_bid_yours,
        "watched_listings_count": watched_listings_count
    })

def categories(request):
    user = request.user

    watched_listings_count = user.watched_listings.count() if user.is_authenticated else None

    categories = Category.objects.all()
    return render(request, "auctions/categories.html", {
        "categories": categories,
        "nav": "categories",
        "watched_listings_count": watched_listings_count
    })

def category(request, id):
    user = request.user

    watched_listings_count = user.watched_listings.count() if user.is_authenticated else None

    category = Category.objects.get(pk=id)
    category_listings = Listing.objects.filter(category=id)
    return render(request, "auctions/category.html", {
        "category": category,
        "listings": category_listings,
        "nav": "category",
        "watched_listings_count": watched_listings_count
    })

def watchlist(request):
    user = request.user

    watched_listings_count = user.watched_listings.count() if user.is_authenticated else None

    watched_listings = request.user.watched_listings.all()
    return render(request, "auctions/watchlist.html", {
        "watched_listings": watched_listings,
        "nav": "watchlist",
        "watched_listings_count": watched_listings_count
    })