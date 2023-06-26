from django.urls import path

from . import views
# app_name = "encyclopedia"
urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<title>/", views.page, name="page"),
    path("search", views.search, name="search"),
    path("search-result/<query>/", views.search_result, name="search_result"),
    path("create", views.create_new_entity, name="create"),
    path("delete/<title>/", views.delete, name="delete"),
    path("edit/<title>/", views.edit, name="edit"),
    path("random", views.random_page, name="random_page"),
]

