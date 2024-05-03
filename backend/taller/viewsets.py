from rest_framework import viewsets
from rest_framework.permissions import *

from .models import *
from .serializer import *

class OrdenDeTrabajoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = OrdenDeTrabajo.objects.all()
    serializer_class = OrdenDeTrabajoSerializer

class eventosOTViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = eventosOT.objects.all()
    serializer_class = eventosOTSerializer
    