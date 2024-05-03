from django.urls import path, include

from rest_framework import routers

from .viewsets import *

route = routers.SimpleRouter()
route.register('departamento', DepartamentoViewSet)
route.register('familia', FamiliaViewSet)
route.register('marca', MarcaViewSet)
route.register('producto', ProductoViewSet)
route.register('pub-impresa', PublicacionImpresaViewSet)
route.register('codigos', CodigosViewSet)

urlpatterns = route.urls + [
    path('producto/search', ProductoSearch),
    #path('codigos/gen-etiqueta', GeneraEtiqueta),
]