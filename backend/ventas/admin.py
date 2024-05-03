from django.contrib import admin

# Register your models here.
from .models import *

class partidasCarritoAdmin(admin.ModelAdmin):
    list_display = ('carrito', 'departamento', 'familia', 'marca', 'modelo' )
    search_fields = ( 'departamento', 'familia', 'marca', 'modelo')
    #ordering = ( 'carrito')
    #list_filter = ( 'fechaDeCreacion','devolucion', 'garantia')

    fieldsets = (
        ('Datos del carrito', {
            'fields': ('carrito',)
        }),
        ('Partida', {
            'fields': ('cantidad', 'sku', 'departamento', 'familia', 'marca', 'modelo', 'claveSAT', 'descuento', 'precioUnitario',
                       'tasaIVA', 'IVA', 'tasaIEPS', 'IEPS', 'total',)
        }),
    )

class PartidasCarritoInline(admin.StackedInline):
    model = PartidasCarrito
    extra = 1
    classes = ['collapse']
    fieldsets = (
        ('Partida', {
            'fields': ('cantidad', 'sku', 'modelo', 'precioUnitario', 'tasaIVA', 'IVA', 'tasaIEPS', 'IEPS', 'total' )
        }),
    )

# Register your models here.
class carritoAdmin(admin.ModelAdmin):
    list_display = ('uuid_carrito','fechaDeCreacion','cliente', 'usuario')
    search_fields = ('uuid_carrito','cliente__razonSocial',)
    ordering = ( 'uuid_carrito','fechaDeCreacion','cliente', 'usuario')
    list_filter = ( 'fechaDeCreacion', )

    inlines = [PartidasCarritoInline]



class ventaAdmin(admin.ModelAdmin):
    list_display = ('fechaDeVenta', 'documentType', 'folio','observaciones','Total', 'devolucion','garantia',)
    search_fields = ('carrito__uuid_carrito', 'observaciones','documentType', 'folio')
    ordering = ( 'fechaDeVenta','folio', 'devolucion','garantia')
    list_filter = ( 'fechaDeVenta','vendedor', 'caja', 'documentType','devolucion', 'garantia')

    fieldsets = (
        ('Datos básicos', {
            'fields': ('carrito', 'vendedor', 'caja', 'fechaDeVenta', 'documentType', 'folio', 'observaciones')
        }),
        ('Montos', {
            'fields': ('Subtotal', 'IVA','IEPS','Total' )
        }),
        ('Estado de la venta', {
            'fields': ('devolucion','garantia')
        }),
        ('Ticket', {
            'fields': ('ticketFile',)
        }),
    )



admin.site.register(Carrito, carritoAdmin)
admin.site.register(Venta, ventaAdmin)
admin.site.register(PartidasCarrito, partidasCarritoAdmin)