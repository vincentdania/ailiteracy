from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from apps.accounts import views as account_views
from .admin_dashboard import dashboard_view

admin.site.site_header = "ailiteracy.ng admin"
admin.site.site_title = "ailiteracy.ng admin"
admin.site.index_title = "Administration"

urlpatterns = [
    path("admin/", admin.site.admin_view(dashboard_view)),
    path("admin/", admin.site.urls),
    path("accounts/", include("allauth.urls")),
    path("dashboard/", account_views.dashboard, name="dashboard"),
    path("library/", account_views.library, name="library"),
    path("", include(("apps.pages.urls", "pages"), namespace="pages")),
    path("", include(("apps.accounts.urls", "accounts"), namespace="accounts")),
    path("", include(("apps.catalog.urls", "catalog"), namespace="catalog")),
    path("", include(("apps.content.urls", "content"), namespace="content")),
    path("", include(("apps.core.urls", "core"), namespace="core")),
    path("", include(("apps.learning.urls", "learning"), namespace="learning")),
    path("", include(("apps.marketing.urls", "marketing"), namespace="marketing")),
    path("orders/", include(("apps.orders.urls", "orders"), namespace="orders")),
    path("quiz/", include(("apps.quiz.urls", "quiz"), namespace="quiz")),
    path("bootcamp/", include(("apps.bootcamp.urls", "bootcamp"), namespace="bootcamp")),
    path("certificates/", include(("apps.certificates.urls", "certificates"), namespace="certificates")),
    path("ai-literacy-index/", include(("apps.ai_index.urls", "ai_index"), namespace="ai_index")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
