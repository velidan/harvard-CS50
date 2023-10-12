from django.contrib.auth import get_user_model


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

class CostRecordSerializer(serializers.ModelSerializer):
    # owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = CostRecord
        fields = "__all__"
