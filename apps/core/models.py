from django.db import models


class Testimonial(models.Model):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120, blank=True)
    quote = models.TextField()
    is_featured = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.name


class Project(models.Model):
    title = models.CharField(max_length=180)
    slug = models.SlugField(unique=True)
    summary = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    impact = models.CharField(max_length=255, blank=True)
    stack = models.CharField(max_length=255, blank=True)
    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self) -> str:
        return self.title


class Mentor(models.Model):
    name = models.CharField(max_length=160)
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=180)
    bio = models.TextField()
    quote = models.TextField(blank=True)
    expertise = models.TextField(
        help_text="List expertise items on separate lines.",
        blank=True,
    )
    avatar_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self) -> str:
        return self.name

    @property
    def expertise_items(self) -> list[str]:
        return [line.strip() for line in self.expertise.splitlines() if line.strip()]


class ReferralProgram(models.Model):
    title = models.CharField(max_length=180)
    slug = models.SlugField(unique=True)
    commission = models.CharField(max_length=30, help_text="Example: 20%")
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "title"]

    def __str__(self) -> str:
        return self.title


class PremiumResource(models.Model):
    title = models.CharField(max_length=180)
    slug = models.SlugField(unique=True)
    category = models.CharField(max_length=120)
    summary = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "title"]

    def __str__(self) -> str:
        return self.title
