# Generated by Django 4.2.2 on 2023-12-21 18:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auditor', '0005_costcategory_thumbnail'),
    ]

    operations = [
        migrations.AlterField(
            model_name='costcategory',
            name='thumbnail',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
    ]
