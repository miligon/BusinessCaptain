from rest_framework import viewsets
from rest_framework.permissions import *

from .models import *
from .serializer import *

class detalleMovimientoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = detalleMovimiento.objects.all()
    serializer_class = detalleMovimientoSerializer

    def get_serializer(self, *args, **kwargs):
        if "data" in kwargs:
            data = kwargs["data"]

            if isinstance(data, list):
                kwargs["many"] = True

        return super(detalleMovimientoViewSet, self).get_serializer(*args, **kwargs)