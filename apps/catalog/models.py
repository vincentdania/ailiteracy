from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from django.conf import settings
from django.db import models
from django.urls import reverse


class Product(models.Model):
    class ProductType(models.TextChoices):
        BOOK = "book", "Book"
        COURSE = "course", "Course"
        BUNDLE = "bundle", "Bundle"

    title = models.CharField(max_length=220)
    slug = models.SlugField(unique=True)
    product_type = models.CharField(max_length=20, choices=ProductType.choices)
    short_description = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    cover_image = models.URLField(blank=True)
    digital_file = models.FileField(upload_to="digital_products/", blank=True, null=True)
    download_url = models.URLField(blank=True)
    course = models.OneToOneField(
        "learning.Course",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="product",
    )
    bundle_items = models.ManyToManyField("self", blank=True, symmetrical=False, related_name="bundled_in")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]

    def __str__(self) -> str:
        return self.title

    def get_absolute_url(self):
        if self.product_type == self.ProductType.BOOK:
            return reverse("catalog:book_landing", kwargs={"slug": self.slug})
        if self.product_type == self.ProductType.COURSE and self.course:
            return reverse("catalog:course_detail", kwargs={"slug": self.course.slug})
        return reverse("catalog:product_detail", kwargs={"slug": self.slug})

    @property
    def partner_purchase_url(self):
        parsed = urlparse(settings.ECOMMERCE_PARTNER_URL)
        query = dict(parse_qsl(parsed.query, keep_blank_values=True))
        query.update(
            {
                "utm_source": "ailiteracy.ng",
                "utm_medium": "referral",
                "utm_campaign": "ecommerce_partner",
                "product": self.slug,
            }
        )
        return urlunparse(parsed._replace(query=urlencode(query)))
