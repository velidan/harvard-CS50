from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass



class Listing(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_bid = models.IntegerField()
    image_url = models.URLField(blank=True)
    current_price = models.IntegerField()
    is_in_watchlist = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    win_bid = models.ForeignKey('Bid', on_delete=models.CASCADE, blank=True, null=True)
    created_at = models.DateField(auto_now_add=True)
    closed_at = models.DateField(blank=True, null=True)
    category = models.ManyToManyField('Category', blank=True, related_name='listings')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.current_price = kwargs.get('start_bid')
        # add your own logic

    def __str__(self):
        return f"{self.title}"


class Bid(models.Model):
    target_listing = models.ForeignKey(Listing, blank=True, on_delete=models.CASCADE, related_name="bids")
    created_at = models.DateField()
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
    created_at = models.DateField()

    def __str__(self):
        return f"{self.author.username}: {self.text}: {self.listing}"

# id = models.IntegerField(primary_key=True)

# class Person(models.Model):
#     id = models.IntegerField(primary_key=True)
#     name = models.CharField(max_length=20)

#     def __str__(self):
#         return self.id+self.name


# class Companies(models.Model):
#     title = models.CharField(max_length=20)
#     description=models.CharField(max_length=10)
#     person= models.ForeignKey(Person,related_name='persons',on_delete=models.CASCADE)