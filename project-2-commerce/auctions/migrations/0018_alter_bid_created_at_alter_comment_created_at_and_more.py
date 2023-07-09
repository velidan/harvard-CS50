# Generated by Django 4.2.2 on 2023-07-09 15:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0017_remove_listing_is_in_watchlist'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bid',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='comment',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='listing',
            name='closed_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='listing',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]