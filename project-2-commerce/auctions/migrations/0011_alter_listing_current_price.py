# Generated by Django 4.2.2 on 2023-07-08 16:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0010_alter_listing_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='current_price',
            field=models.IntegerField(blank=True),
        ),
    ]