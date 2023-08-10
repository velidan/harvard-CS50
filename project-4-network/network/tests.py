from django.test import TestCase

# Create your tests here.
from django.test import TestCase
from network.models import User


class AnimalTestCase(TestCase):
    def setUp(self):
        User.objects.create(username='admin')
        User.objects.create(username='neo_anderson')

    def test_user_follows_behavior(self):
        """It should make the admin following to neo and the neo user should have the admin as follower"""
        neo = User.objects.get(username="neo_anderson")
        admin = User.objects.get(username="admin")

        # Neo folllowes set should be empty
        self.assertEqual(neo.user_followers.all().count(), 0)
        
        # Admin following set should be empty
        self.assertEqual(admin.user_following.all().count(), 0)

        # add Neo to the Admin following set because Admin wants to follow Neo
        admin.user_following.add(neo)
        admin.save()

        # add Admin to the Neo followers set because Admin became the Neo's follower
        neo.user_followers.add(admin)
        neo.save()

        # check if Neo in te Admin's following set
        self.assertTrue(admin.user_following.contains(neo))

        # check if Admin in the Neo's followers set
        self.assertTrue(neo.user_followers.contains(admin))