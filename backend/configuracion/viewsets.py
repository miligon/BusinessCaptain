from rest_framework import viewsets
from rest_framework.permissions import *

from .models import *
from .serializer import *

class SucursalViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Sucursal.objects.all()
    serializer_class = SucursalSerializer

    def get_queryset(self):
        if self.request.user:
            self.queryset = Sucursal.objects.filter(pk=self.request.user.caja.sucursal.pk)
            return self.queryset
        else:
            self.queryset = Sucursal.objects.none()
            return self.queryset

class CajaViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Caja.objects.all()
    serializer_class = CajaSerializer

    def get_queryset(self):
        if self.request.user:
            self.queryset = Caja.objects.filter(pk=self.request.user.caja.id)
            return self.queryset
        else:
            self.queryset = Caja.objects.none()
            return self.queryset

class ConfiguracionCajaViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    serializer_class = ConfiguracionCajaSerializer
    queryset = ConfiguracionCaja.objects.all()

    def get_queryset(self):
        if hasattr(self.request.user, 'caja'):
            self.queryset = ConfiguracionCaja.objects.filter(caja=self.request.user.caja)
            return self.queryset
        else:
            self.queryset = ConfiguracionCaja.objects.none()
            return self.queryset

class ConsecutivosSucursalesViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = ConsecutivosSucursales.objects.all()
    serializer_class = ConsecutivosSucursalesSerializer

class EmpleadosViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Empleados.objects.all()
    serializer_class = EmpleadosSerializer