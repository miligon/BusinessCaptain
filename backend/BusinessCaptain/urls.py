"""BusinessCaptain URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.contrib import admin

from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import *
from rest_framework.decorators import api_view
from django.urls import path, include, re_path

from rest_framework.decorators import permission_classes

@api_view(['GET', 'OPTION'])
@permission_classes([IsAuthenticated])
def protected_serve(request, path, document_root=None, show_indexes=False):
    return serve(request, path, document_root, show_indexes)

@api_view(['GET'])
def public_serve(request, path, document_root=None, show_indexes=False):
    return serve(request, path, document_root, show_indexes)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth-services/', include('djoser.urls')),
    path('auth-services/', include('djoser.urls.jwt')),
    path('api/almacen/', include('almacen.urls')),
    path('api/info/', include('configuracion.urls')),
    path('api/ventas/', include('ventas.urls')),
    path('api/clientes/', include('clientes.urls')),
    path('api/finanzas/', include('finanzas.urls')),
    path('api/taller/', include('taller.urls')),
    path('api/reportes/', include('reportes.urls')),
    re_path(r'^%s(?P<path>.*)$' % (settings.MEDIA_URL[1:] + 'tickets/'), protected_serve, {'document_root': settings.MEDIA_ROOT / 'tickets'}),
    re_path(r'^%s(?P<path>.*)$' % settings.MEDIA_URL[1:], public_serve, {'document_root': settings.MEDIA_ROOT}),
    path('', lambda request: HttpResponse(render(request, 'index_react.html'))),
    re_path(r'^(?!media/|static/).*/$', lambda request: redirect('/'))
] 
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS)
#urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
