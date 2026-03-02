from django.urls import path

from . import views

app_name = "catalog"

urlpatterns = [
    path("book/<slug:slug>/", views.book_landing, name="book_landing"),
    path("courses/", views.course_list, name="course_list"),
    path("courses/<slug:slug>/", views.course_detail, name="course_detail"),
    path("products/<slug:slug>/", views.product_detail, name="product_detail"),
]
