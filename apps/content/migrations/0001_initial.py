from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="BlogPost",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=220)),
                ("slug", models.SlugField(unique=True)),
                ("excerpt", models.CharField(max_length=255)),
                ("content", models.TextField()),
                ("cover_image", models.URLField(blank=True)),
                ("is_published", models.BooleanField(default=True)),
                ("published_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["-published_at", "-created_at"]},
        ),
        migrations.CreateModel(
            name="Resource",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=220)),
                ("slug", models.SlugField(unique=True)),
                (
                    "resource_type",
                    models.CharField(
                        choices=[("guide", "Guide"), ("template", "Template"), ("video", "Video"), ("tool", "Tool")],
                        default="guide",
                        max_length=20,
                    ),
                ),
                ("summary", models.CharField(max_length=255)),
                ("description", models.TextField(blank=True)),
                ("external_url", models.URLField(blank=True)),
                ("file", models.FileField(blank=True, null=True, upload_to="resources/")),
                ("is_published", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["title"]},
        ),
    ]
