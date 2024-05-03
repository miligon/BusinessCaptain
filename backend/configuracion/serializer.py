from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import *


class ConfiguracionCajaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionCaja
        fields = ('__all__')
        

class UserSerializer(serializers.ModelSerializer):
    configuracion_caja = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id',
                  'first_name',
                  'last_name',
                  'groups',
                  'user_permissions',
                  'configuracion_caja',
                  )
        
    def get_configuracion_caja(self, obj):
        try:
            config = ConfiguracionCajaSerializer(obj.caja.configuracion)
            return config.data
        except ConfiguracionCaja.DoesNotExist:
            return None



class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = '__all__'


class CajaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Caja
        fields = '__all__'


class ConsecutivosSucursalesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsecutivosSucursales
        fields = '__all__'


class EmpleadosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleados
        fields = '__all__'
