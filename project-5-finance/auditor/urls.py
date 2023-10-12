from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = "auditor"   

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'users', views.UserViewSet,basename="user")
router.register(r'cost-category', views.UserViewSet,basename="costcategory")
router.register(r'cost-record', views.UserViewSet,basename="costrecord")

urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("sign-in", views.SignInView.as_view(), name="sign_in"),
    path("sign-up", views.SignUpView.as_view(), name="sign_up"),
    path("logout", views.logout_view, name="logout"),

    path('api/', include(router.urls)),
]