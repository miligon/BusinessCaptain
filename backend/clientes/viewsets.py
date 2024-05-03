from rest_framework import viewsets
from rest_framework.permissions import *

from .models import *
from .serializer import *

class ClienteViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer