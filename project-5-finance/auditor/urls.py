from django.urls import path, include, re_path
from django.shortcuts import redirect
from rest_framework.routers import DefaultRouter
from . import views

app_name = "auditor"   

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'users', views.UserViewSet,basename="user")
router.register(r'cost-category', views.CostCategoryViewSet,basename="costcategory")
router.register(r'cost-category/all_unpaginated_categories', views.CostCategoryViewSet,basename="costcategory_unpaginated")
router.register(r'cost-record', views.CostRecordViewSet,basename="costrecord")
router.register(r'cost-record/templates', views.CostRecordViewSet,basename="costrecord_templates")
router.register(r'cost-record/all_unpaginated_templates', views.CostRecordViewSet,basename="costrecord_templates")



urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("sign-in", views.SignInView.as_view(), name="sign_in"),
    path("sign-up", views.SignUpView.as_view(), name="sign_up"),
    path("logout", views.logout_view, name="logout"),

    path('api/', include(router.urls)),
\

    re_path(r'^(?P<path>.+)/$', views.IndexView.as_view(), name="index_with_path"),

]