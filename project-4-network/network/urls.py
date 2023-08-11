
from django.urls import path

from . import views

from django.contrib.auth.decorators import login_required, permission_required

urlpatterns = [
    path("", views.PostsListView.as_view(), name="index"),
    path("new-post", views.new_post, name="new_post"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("profile/<id>/", views.profile, name="profile"),
    path("following", login_required(views.FollowingListView.as_view()), name="following"),
    path("update-post", views.update_post, name="update_post")
]
