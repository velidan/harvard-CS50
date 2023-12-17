from rest_framework.permissions import BasePermission

class CustomIsAuthorizedPermission(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        print(user)
        if user.is_authenticated:
            print('AUTHORIZED<<<<<')
            return True
            # if user.age < 18:
            #     self.message = 'Not viewable to minors'
            #     return False
            # elif user.age > 60:
            #     self.message = 'This does not fit you'
            #     return False
            # else:
            #     return True
        else:
            print('NOT AUTHENN >?>?>?>?')