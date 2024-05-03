from django.urls import path, include

from rest_framework import routers

from .viewsets import *

route = routers.SimpleRouter()

urlpatterns = route.urls + [
    path('ventas/general', ventasGeneral),
    path('ventas/documento', ventasPorDocumento)
]