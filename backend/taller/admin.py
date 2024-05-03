from django.contrib import admin

# Register your models here.
from .models import *

# Register your models here.
class ordenDeTrabajoAdmin(admin.ModelAdmin):
    list_display = ('last_status','fecha_ultimo_evento','nombre_cliente','telefono','anticipo','total')
    search_fields = ('nombre_cliente','telefono',)
    ordering = ( 'fecha_ultimo_evento','last_status','nombre_cliente','anticipo','total')
    list_filter = ( 'fecha_ultimo_evento','last_status','caja','empleado', )
    autocomplete_fields = ('carrito',)

    fieldsets = (
        ('Datos del cliente', {
            'fields': ('nombre_cliente','telefono',)
        }),
        ('Pago', {
            'fields': ('anticipo', 'total' )
        }),
        ('Estado de la orden de trabajo', {
            'fields': ('fecha_ultimo_evento','last_status','observaciones')
        }),
        ('Info adicional', {
            'fields': ('documentType', 'folio', 'carrito', 'caja', 'empleado')
        }),
    )

class eventosOTAdmin(admin.ModelAdmin):
    list_display = ('id_OT','fecha','tipo_de_evento','observaciones',)
    search_fields = ('id_OT','tipo_de_evento',)
    ordering = ( 'fecha',)
    list_filter = ( 'fecha', 'tipo_de_evento' )

admin.site.register(OrdenDeTrabajo, ordenDeTrabajoAdmin)
admin.site.register(eventosOT, eventosOTAdmin)

