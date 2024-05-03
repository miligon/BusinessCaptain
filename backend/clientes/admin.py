from django.contrib import admin
from .models import *

class ClientesAdmin(admin.ModelAdmin):
    list_display = ('id_client', 'razonSocial', 'observaciones', 'RFC', 'cp', 'email', 'telefono_movil')
    #search_fields = ('sku', 'departamento', 'familia', 'marca', 'modelo',)
    search_fields = ('id_client', 'razonSocial',  'observaciones', 'RFC', 'email', 'telefono_movil',) 
    ordering = ( 'id_client', 'razonSocial','observaciones', 'email')


admin.site.register(Cliente, ClientesAdmin)