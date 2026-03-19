from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from .admin_dashboard import dashboard_view

admin.site.site_header = "ailiteracy.ng admin"
admin.site.site_title = "ailiteracy.ng admin"
admin.site.index_title = "Administration"

urlpatterns = [
    path("admin/", admin.site.admin_view(dashboard_view)),
    path("admin/", admin.site.urls),
    path("", include(("apps.pages.urls", "pages"), namespace="pages")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
