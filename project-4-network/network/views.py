from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from django.http import JsonResponse
import json

from django import forms
from django.db.models import Count
from django.contrib.auth.decorators import login_required
from .models import *
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

import logging
logger = logging.getLogger('django')

from django.views.generic import ListView


# test class view
class PostsListView(ListView):
    paginate_by = 10
    model = Post
    template_name='network/index.html'
    context_object_name = "posts"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context["nav"] = 'index'
        return context

    def get_queryset(self, *args, **kwargs):
        posts_with_likes_count= super().get_queryset(*args, **kwargs).order_by('-created_at_date_time').annotate(Count('liked_users'))
        logger.info(posts_with_likes_count)

        user = self.request.user
        for post in posts_with_likes_count:
            post.can_edit = post.author.id == user.id
            post.liked = post.liked_users.contains(user)

        return posts_with_likes_count

class FollowForm(forms.Form):
    follow = forms.BooleanField(required=False)

class EditPostForm(forms.Form):
    content = forms.CharField()
    

class CreatePost(forms.Form):
    content = forms.CharField(label="Post content", widget=forms.Textarea(attrs={"rows":"5"}))

@csrf_exempt
@login_required
def update_post(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    content = data.get("content")

    author_id = int(data.get("authorId"))
    post_id = data.get("postId")

    if content is None or author_id is None or post_id is None:
        return JsonResponse({"error": "content, author_id, post_id must be passed"}, status=400)

    if request.user.id != author_id:
        return JsonResponse({"error": "You are allowed to update only your post"}, status=400)
    
    post = Post.objects.get(id=post_id)
    post.text = content
    post.save()

    logger.info('--------')
    logger.info(f'content: {content} authorId: {author_id}')
    logger.info(post)


    return JsonResponse({"message": "Post had been updated.", "content": content}, status=200)

@csrf_exempt
@login_required
def like_post(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    # like = data.get("like")
    like = False

    post_id = data.get("postId")

    if post_id is None:
        return JsonResponse({"error": "post_id must be passed"}, status=400)
    
    post = Post.objects.get(id=post_id)
    user = request.user

    if post.liked_users.contains(user):
        post.liked_users.remove(user)
    else:
        post.liked_users.add(user)
        like = True
    
    post.save()
    post_likes_count = post.liked_users.count()
    
    # post.text = content
    # post.save()

    logger.info('--------')
    logger.info(type(data.get("like")))
    # logger.info(post)


    # opposite toggle like value
    return JsonResponse({"like": like, "post_likes_count": post_likes_count}, status=200)

# def index(request):
#     # q = Post.objects.annotate(Count('liked_users'))
#     posts = Post.objects.order_by('-created_at_date_time').annotate(Count('liked_users'))
    
#     user = request.user

#     return render(request, "network/index.html", {
#         "posts": posts,
#         "nav": "index",
#     })


class FollowingListView(ListView):
    paginate_by = 10
    model = Post
    template_name='network/following.html'
    context_object_name = "following_posts"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in a QuerySet of all the books
        context["nav"] = 'following'
        return context

    def get_queryset(self, *args, **kwargs):
        following_posts= super().get_queryset(*args, **kwargs).filter(author__in=self.request.user.user_following.all()).annotate(Count('liked_users')).order_by('-created_at_date_time')

        return following_posts

# def following(request):
#     user = request.user

#     # if not user.is_authenticated:
#     #     return HttpResponseRedirect(reverse("index"))

#     posts = Post.objects.annotate(Count('liked_users'))
#     following_posts = Post.objects.filter(author__in=user.user_following.all()).order_by('-created_at_date_time')

#     following = user.user_following.all()




#     return render(request, "network/following.html", {
#             "following_posts": following_posts,
#             "nav": "following",
#         })


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
            next_url = request.POST.get('next')
            # handling protection view with next redirection - following
            if next_url:
                # cut the '/' from the get param from URL
                return HttpResponseRedirect(reverse(next_url[1:]))
            else:
                return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html", {
            "nav": "login"
        })


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
        return render(request, "network/register.html", {
            "nav": "register"
        })
