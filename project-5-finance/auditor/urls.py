from django.urls import path, include, re_path
from django.shortcuts import redirect
from rest_framework.routers import DefaultRouter
from . import views
from django.conf import settings
from django.conf.urls.static import static

app_name = "auditor"   

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'users', views.UserViewSet,basename="user")
router.register(r'cost-category', views.CostCategoryViewSet,basename="costcategory")
router.register(r'cost-category/all_unpaginated_categories', views.CostCategoryViewSet,basename="costcategory_unpaginated")
router.register(r'cost-record', views.CostRecordViewSet,basename="costrecord")
router.register(r'cost-record/templates', views.CostRecordViewSet,basename="costrecord_templates")
router.register(r'cost-record/costs_total', views.CostRecordViewSet,basename="costrecord_costs_total")
router.register(r'cost-record/all_unpaginated_templates', views.CostRecordViewSet,basename="costrecord_templates")
router.register(r'cost-record/costs_total_by_category', views.CostRecordViewSet,basename="costrecord_costs_total_by_category")
router.register(r'cost-record/created_years_months', views.CostRecordViewSet,basename="costrecord_created_years_months")



urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("sign-in", views.SignInView.as_view(), name="sign_in"),
    path("sign-up", views.SignUpView.as_view(), name="sign_up"),
    path("logout", views.logout_view, name="logout"),

    path('api/', include(router.urls)),

    re_path(r'^(?P<path>.+)/$', views.IndexView.as_view(), name="index_with_path"),

]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)