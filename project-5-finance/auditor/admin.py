from django.contrib import admin
from .models import CostCategory, CostRecord, User
# Register your models here.

admin.site.register(User)
admin.site.register(CostCategory)
admin.site.register(CostRecord)
