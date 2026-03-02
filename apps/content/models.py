from django.db import models
from django.urls import reverse


class BlogPost(models.Model):
    title = models.CharField(max_length=220)
    slug = models.SlugField(unique=True)
    excerpt = models.CharField(max_length=255)
    content = models.TextField()
    cover_image = models.URLField(blank=True)
    is_published = models.BooleanField(default=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self) -> str:
        return self.title

    def get_absolute_url(self):
        return reverse("content:blog_detail", kwargs={"slug": self.slug})


class Resource(models.Model):
    class ResourceType(models.TextChoices):
        GUIDE = "guide", "Guide"
        TEMPLATE = "template", "Template"
        VIDEO = "video", "Video"
        TOOL = "tool", "Tool"

    title = models.CharField(max_length=220)
    slug = models.SlugField(unique=True)
    resource_type = models.CharField(max_length=20, choices=ResourceType.choices, default=ResourceType.GUIDE)
    summary = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    external_url = models.URLField(blank=True)
    file = models.FileField(upload_to="resources/", blank=True, null=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["title"]

    def __str__(self) -> str:
        return self.title
