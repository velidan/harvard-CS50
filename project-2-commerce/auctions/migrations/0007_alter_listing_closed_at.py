# Generated by Django 4.2.2 on 2023-07-07 19:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0006_alter_listing_image_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='closed_at',
            field=models.DateField(blank=True),
        ),
    ]
