from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField('self',blank=True,related_name='user_following',symmetrical=False)
    following = models.ManyToManyField('self',blank=True,related_name='user_followers',symmetrical=False)
    pass

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateField(auto_now_add=True)
    created_at_date_time = models.DateTimeField(
        verbose_name=("Creation date"), auto_now_add=True, null=True
    )
    liked_users = models.ManyToManyField(User, blank=True, default=0, related_name='liked_posts')
    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"Post from {self.author.username}: {self.text}"
