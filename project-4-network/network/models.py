from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField('self',blank=True,related_name='user_followers',symmetrical=False)
    following = models.ManyToManyField('self',blank=True,related_name='user_following',symmetrical=False)
    pass

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateField(auto_now_add=True)
    created_at_date_time = models.DateTimeField(
        verbose_name=("Creation date"), auto_now_add=True, null=True
    )
    liked_users = models.ManyToManyField(User, blank=True, default=0, related_name='liked_posts')

    def __str__(self):
        return f"Post from {self.author.username}: {self.text}"



'''
    
class Listing(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_bid = models.IntegerField()
    image_url = models.URLField(blank=True)
    current_price = models.IntegerField(blank=True, null=True)
    watched_users = models.ManyToManyField(User, blank=True, related_name='watched_listings')
    is_active = models.BooleanField(default=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    win_bid = models.ForeignKey('Bid', on_delete=models.CASCADE, blank=True, null=True)
    created_at = models.DateField(auto_now_add=True)
    closed_at = models.DateField(blank=True, null=True)
    category = models.ManyToManyField('Category', blank=True, related_name='listings')

    @classmethod
    def post_create(cls, sender, instance, created, *args, **kwargs):
        if not created:
            return
        instance.current_price = instance.start_bid
        print(instance.current_price)
        instance.save()
    
    def __str__(self):
        return f"{self.title}"
    
post_save.connect(Listing.post_create, sender=Listing)

class Bid(models.Model):
    target_listing = models.ForeignKey(Listing, blank=True, on_delete=models.CASCADE, related_name="bids")
    created_at = models.DateField(auto_now_add=True)
    price = models.IntegerField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bids")

    def __str__(self):
        return f"{self.owner.username}: {self.price}: {self.target_listing}"


class Category(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return f"{self.title}"


class Comment(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User,  on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.username}: {self.text}: {self.listing}"
'''