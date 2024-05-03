from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.hashers import *
from .models import *


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username','password', 'email', 'is_active', 'is_staff', 'is_superuser','cliente')
    list_filter = ('is_active', 'cliente', 'is_staff', 'is_superuser')
    search_fields = ('email', 'username')
    ordering = ('email',)

    def save_model(self, request, obj, form, change):
        if obj.pk is not None:
            user_database = User.objects.get(pk=obj.pk)
            # Check firs the case in which the password is not encoded, then check in the case that the password is encode
            if not (check_password(form.data['password'], user_database.password) or user_database.password == form.data['password']):
                obj.password = make_password(obj.password)
            else:
                obj.password = user_database.password
        else:
            if obj.password is not None:
                obj.password = make_password(obj.password)
        super().save_model(request, obj, form, change)

class SucursalesAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'telefono', 'email')
    #search_fields = ('sku', 'departamento', 'familia', 'marca', 'modelo',)
    search_fields = ('nombre', 'telefono', 'email',) 
    ordering = ( 'nombre', 'email')

class EmpleadosAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'observaciones',)
    search_fields = ('id', 'first_name', 'last_name', 'observaciones',) 
    ordering = ( 'id', 'first_name', 'last_name', 'observaciones',)

class ConsecutivosSucursalesAdmin(admin.ModelAdmin):
    list_display = ('id_sucursal', 'documentType', 'consecutivo',)
    search_fields = ('id_sucursal', 'documentType', 'consecutivo',) 
    ordering = ('id_sucursal', 'documentType', 'consecutivo',)

class CajaAdmin(admin.ModelAdmin):
    list_display = ('sucursal', 'nombre',)
    search_fields = ('id', 'nombre',) 
    ordering = ( 'id', 'sucursal', 'nombre',)

class ConfiguracionCajaAdmin(admin.ModelAdmin):
    list_display = ('nombre_caja', 'sucursal')
    search_fields = ('caja__nombre', 'caja__sucursal',) 
    list_filter = ('caja__sucursal', )

    def nombre_caja(self, caja):
        return caja.caja.nombre
    
    def sucursal(self, caja):
        return caja.caja.sucursal
    
admin.site.register(User, CustomUserAdmin)
admin.site.register(Sucursal, SucursalesAdmin)
admin.site.register(Caja, CajaAdmin)
admin.site.register(ConfiguracionCaja, ConfiguracionCajaAdmin)
admin.site.register(ConsecutivosSucursales, ConsecutivosSucursalesAdmin)
admin.site.register(Empleados, EmpleadosAdmin)