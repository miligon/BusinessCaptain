from django.contrib import admin
from .models import *

# Register your models here.
class detalleMovimientoAdmin(admin.ModelAdmin):
    list_display = ('fechaDeMovimiento', 'descripcion', 'monto', 'formaDePago', 'tipoDeMovimiento', 'venta', 'caja')
    search_fields = ('descripcion',)
    ordering = ( 'fechaDeMovimiento', 'descripcion', 'monto', 'formaDePago','caja')
    list_filter = ( 'fechaDeMovimiento', 'formaDePago','caja',)
    autocomplete_fields = ('venta','caja',)

    fieldsets = (
        ('Datos del movimiento', {
            'fields': ('fechaDeMovimiento', 'descripcion', 'monto',)
        }),
        ('Venta', {
            'fields': ('venta','caja')
        }),
        ('Detalle pago', {
            'fields': ('modalidadDePago', 'formaDePago', 'banco', 'referencia', 'montoEfectivo', 'montoCambioEfectivo')
        }),
    )

    #inlines = [PublicacionImpresaInline, CodigosInline]
    @admin.display(description="Movimiento")
    def tipoDeMovimiento(self, object):
        verbose_name='Tipo de movimiento'
        if object.monto >= 0:
            return 'Ingreso' 
        else:
            return 'Egreso'

admin.site.register(detalleMovimiento, detalleMovimientoAdmin)