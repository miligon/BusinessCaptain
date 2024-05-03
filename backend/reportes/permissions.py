from rest_framework.exceptions import ValidationError
from rest_framework.permissions import *

class ReportAccess(IsAuthenticated):
    def has_permission(self, request, view):
        """
        Check if Authenticated user has access to reports
        """
        if request.user.groups.filter(name='Reportes').exists():
            return True
        else:
            raise ValidationError('The user does not has permission to get reports.')