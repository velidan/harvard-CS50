
from django.contrib.auth.models import AbstractUser
from django.db import models



class User(AbstractUser):
    
    pass


class CostCategory(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='images/', blank=True, null=True)

    def __str__(self):
        return f"{self.title}"
    
    
class CostRecord(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    total = models.DecimalField(decimal_places=2, max_digits=8)
    category = models.ForeignKey(CostCategory, on_delete=models.CASCADE, blank=True, null=True, related_name='costs')
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="cost_records")
    timestamp = models.DateTimeField(auto_now_add=True)
    template = models.BooleanField(default=False)


    def __str__(self):
        return f"id: {self.id}. title: {self.title}"
    
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
        }
    

