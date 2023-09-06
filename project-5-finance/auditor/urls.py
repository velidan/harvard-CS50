from django.urls import path

from . import views

app_name = "auditor"   

urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("sign-in", views.SignInView.as_view(), name="sign_in"),
    path("sign-up", views.SignUpView.as_view(), name="sign_up"),
    path("logout", views.logout_view, name="logout"),
]