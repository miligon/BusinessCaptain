from django.contrib import admin
from .models import *

class DepartamentoAdmin(admin.ModelAdmin):
    list_display = ('clave', 'descripcion')
    search_fields = ('clave', 'descripcion')
    ordering = ('descripcion',)

class FamiliaAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)

class MarcaAdmin(admin.ModelAdmin):
    list_display = ('clave', 'name')
    search_fields = ('clave', 'name')
    ordering = ('name',)

class PublicacionImpresaInline(admin.StackedInline):
    model = PublicacionImpresa
    extra = 1
    classes = ['collapse']
    fieldsets = (
        ('Datos publicación impresa (opcional)', {
            'fields': ('editorial', 'autorPrincipal', 'autoresSecundarios', )
        }),
    )

class CodigosInline(admin.StackedInline):
    model = Codigos
    extra = 1
    fieldsets = (
        ('Codigos del producto', {
            'fields': ('codigo',)
        }),
    )


class ProductoAdmin(admin.ModelAdmin):
    list_display = ('sku', '__str__', 'costo', 'precio')
    #search_fields = ('sku', 'departamento', 'familia', 'marca', 'modelo',)
    search_fields = ('modelo',)
    autocomplete_fields = ['departamento', 'familia', 'marca']  
    ordering = ( 'modelo', 'costo', 'precio',)

    fieldsets = (
        ('Propiedades', {
            'fields': ('departamento', 'familia', 'marca', 'modelo', 'sku')
        }),
        ('Económico', {
            'fields': ('costo', 'precio', 'tasaIVA', 'tasaIEPS', 'claveSAT')
        }),
    )

    inlines = [PublicacionImpresaInline, CodigosInline]

class CodigosAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'producto')
    search_fields = ('codigo',)
    autocomplete_fields = ['producto']

class PublicacionImpresaAdmin(admin.ModelAdmin):
    list_display = ('producto', 'editorial', 'autorPrincipal', 'autoresSecundarios')
    search_fields = ( 'editorial', 'autorPrincipal', 'autoresSecundarios')
    autocomplete_fields = ['producto']


admin.site.register(Departamento, DepartamentoAdmin)
admin.site.register(Familia, FamiliaAdmin)
admin.site.register(Marca, MarcaAdmin)
admin.site.register(Producto, ProductoAdmin)
admin.site.register(PublicacionImpresa, PublicacionImpresaAdmin)
admin.site.register(Codigos, CodigosAdmin)