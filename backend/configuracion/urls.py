from django.urls import path, include

from rest_framework import routers

from .viewsets import *

route = routers.SimpleRouter()
route.register('sucursal', SucursalViewSet)
route.register('consecutivos', ConsecutivosSucursalesViewSet)
route.register('empleados', EmpleadosViewSet)
route.register('cajas', CajaViewSet)
route.register('config-caja', ConfiguracionCajaViewSet)

urlpatterns = route.urls