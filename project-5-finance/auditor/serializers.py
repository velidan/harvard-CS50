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

class CostCategorySerializer(serializers.ModelSerializer):
    # owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = CostCategory
        fields = "__all__"

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.user = validated_data.get('user')
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        return instance

class CostRecordSerializer(serializers.ModelSerializer):
    # owner = serializers.ReadOnlyField(source='owner.username')

    categories = CostCategorySerializer(many=True, read_only=True)

    class Meta:
        model = CostRecord
        fields = "__all__"

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.user = validated_data.get('user')
        instance.description = validated_data.get('description', instance.description)
        instance.total = validated_data.get('total', instance.total)
        instance.template = validated_data.get('template', instance.total)
        instance.save()
        return instance

