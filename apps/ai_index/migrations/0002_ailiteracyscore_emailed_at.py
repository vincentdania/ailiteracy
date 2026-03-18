from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("ai_index", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="ailiteracyscore",
            name="emailed_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
