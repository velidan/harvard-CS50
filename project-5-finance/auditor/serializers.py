from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework import serializers
from auditor.models import User, CostCategory, CostRecord

User = get_user_model()



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        # lookup_field = "username"

class ThumbnailUrlField(serializers.ImageField):
    def to_representation(self, value):
        if value:
            request = self.context.get('request', None)
            if request:
                return request.build_absolute_uri(value.url)
            else:
                return value.url
        return None

class CostCategorySerializer(serializers.ModelSerializer):
    thumbnail = ThumbnailUrlField(required=False)

    class Meta:
        model = CostCategory
        fields = "__all__"

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.user = validated_data.get('user')
        instance.description = validated_data.get('description', instance.description)

        # Update 'thumbnail' separately if provided
        thumbnail = validated_data.get('thumbnail', None)
        if thumbnail:
            instance.thumbnail = thumbnail
        instance.save()
        return instance

class CostRecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = CostRecord
        fields = "__all__"

    def update(self, instance, validated_data):

        instance.title = validated_data.get('title', instance.title)
        instance.user = validated_data.get('user')
        instance.category = validated_data.get('category')
        instance.description = validated_data.get('description', instance.description)
        instance.total = validated_data.get('total', instance.total)
        instance.template = validated_data.get('template', instance.total)
        instance.save()


        return instance

