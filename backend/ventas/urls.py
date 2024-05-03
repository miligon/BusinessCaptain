from django.urls import path, include

from rest_framework import routers

from .viewsets import *

route = routers.SimpleRouter()
route.register('carrito', CarritoViewSet)
route.register('venta', VentaViewSet)
route.register('partidas-carrito', PartidasCarritoViewSet)

urlpatterns = route.urls + [
    path('capture', ventaCreate),
]