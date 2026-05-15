from django.urls import path

from .views import assessment, home, share_score, share_score_image

app_name = "pages"

urlpatterns = [
    path("assessment/", assessment, name="assessment"),
    path("share/<uuid:share_id>/", share_score, name="share"),
    path("share-image/<uuid:share_id>/", share_score_image, name="share_image"),
    path("", home, name="home"),
]
