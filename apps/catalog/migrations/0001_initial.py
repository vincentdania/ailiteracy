from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("learning", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=220)),
                ("slug", models.SlugField(unique=True)),
                (
                    "product_type",
                    models.CharField(
                        choices=[("book", "Book"), ("course", "Course"), ("bundle", "Bundle")],
                        max_length=20,
                    ),
                ),
                ("short_description", models.CharField(blank=True, max_length=255)),
                ("description", models.TextField(blank=True)),
                ("price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("is_active", models.BooleanField(default=True)),
                ("is_featured", models.BooleanField(default=False)),
                ("cover_image", models.URLField(blank=True)),
                ("digital_file", models.FileField(blank=True, null=True, upload_to="digital_products/")),
                ("download_url", models.URLField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "course",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="product",
                        to="learning.course",
                    ),
                ),
                ("bundle_items", models.ManyToManyField(blank=True, related_name="bundled_in", to="catalog.product")),
            ],
            options={"ordering": ["title"]},
        ),
    ]
