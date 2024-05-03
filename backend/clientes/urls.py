from django.urls import path, include

from rest_framework import routers

from .viewsets import *

route = routers.SimpleRouter()
route.register('clientes', ClienteViewSet)

urlpatterns = route.urls