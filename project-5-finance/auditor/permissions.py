from rest_framework.permissions import BasePermission

class CustomIsAuthorizedPermission(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        print(user)
        if user.is_authenticated:
            return True