from django.contrib import admin
from .models import CostCategory, CostRecord, User

admin.site.register(User)
admin.site.register(CostCategory)
admin.site.register(CostRecord)
