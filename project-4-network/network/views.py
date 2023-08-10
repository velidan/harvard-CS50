from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from django import forms
from django.db.models import Count

from .models import *

from django.db.models import Q

import logging
logger = logging.getLogger('django')

class FollowForm(forms.Form):
    follow = forms.BooleanField(required=False)


class CreatePost(forms.Form):
    content = forms.CharField(label="Post content", widget=forms.Textarea(attrs={"rows":"5"}))


def index(request):
    # q = Post.objects.annotate(Count('liked_users'))
    posts = Post.objects.order_by('-created_at_date_time').annotate(Count('liked_users'))
    
    user = request.user

    return render(request, "network/index.html", {
        "posts": posts,
        "nav": "index",
    })

def following(request):
    user = request.user

    if not user.is_authenticated:
        return HttpResponseRedirect(reverse("index"))

    posts = Post.objects.annotate(Count('liked_users'))
    following_posts = Post.objects.filter(author__in=user.user_following.all()).order_by('-created_at_date_time')

    following = user.user_following.all()




    return render(request, "network/following.html", {
            "following_posts": following_posts,
            "nav": "following",
        })


def profile(request, id):
    user = request.user
    profiled_user = User.objects.annotate(Count('user_followers'), Count('user_following')).get(pk=id)
    # posts = profiled_user.annotate(Count('user_followers'))

    user_posts = Post.objects.filter(author=profiled_user).order_by('-created_at_date_time')
    
  


    if request.method == 'POST':
        follow_query = request.POST.get("follow_input", None)
        if follow_query == 'follow':
            logger.warning('should follow')
            # user.user_following.add(profiled_user)
            # user.save()
            profiled_user.user_followers.add(user)
            profiled_user.save()

            user.user_following.add(profiled_user)
            user.save()

        elif follow_query == 'unfollow':
            logger.warning('should follow')
            # user.user_following.remove(profiled_user)
            # user.save()
            profiled_user.user_followers.remove(user)
            profiled_user.save()

            user.user_following.remove(profiled_user)
            user.save()

        is_following = profiled_user.user_followers.contains(user)
        return render(request, "network/profile.html", {
        
            "profiled_user": profiled_user,
            "user_posts": user_posts,
            "is_following": is_following,

        })
    
    is_following = profiled_user.user_followers.contains(user)
    logger.warning("-------")
    logger.warning(is_following)
    logger.warning("user_followers")
    logger.warning(profiled_user.user_followers.all())
    logger.warning("user_following")
    logger.warning(profiled_user.user_following.all())
    return render(request, "network/profile.html", {
        
        "profiled_user": profiled_user,
        "user_posts": user_posts,
        "is_following": is_following,

    })

def new_post(request):
    user = request.user
    if request.method == "POST":
        form = CreatePost(request.POST)
        if form.is_valid():

            content = form.cleaned_data["content"]
          
            new_post = Post(author=user, text=content)
            new_post.save()

            logger.warning('-------')
            logger.warning(content)

            # new_listing.category.add(category)

            return HttpResponseRedirect(reverse("index"))
        else:
            return HttpResponseRedirect(reverse("index"))

    else:
        return render(request, "network/new_post.html", {
            "create_post_form": CreatePost(),
            "nav": "create_post",
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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
