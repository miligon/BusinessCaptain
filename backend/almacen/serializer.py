from rest_framework import serializers
from django.db.models import Q

from .models import *

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = '__all__'

class FamiliaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Familia
        fields = '__all__'

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = '__all__'

class PublicacionImpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicacionImpresa
        fields = '__all__'
    
class CodigosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Codigos
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    codigos = CodigosSerializer(
        many=True,
        read_only=True,
    )

    PubImpresaInfo = PublicacionImpresaSerializer(
        read_only=True,
        
    )

    costo = serializers.FloatField()
    precio = serializers.FloatField()
    tasaIVA = serializers.FloatField()
    tasaIEPS = serializers.FloatField()
    
    class Meta:
        model = Producto
        fields = '__all__'


class ProductoSearchSerializer(serializers.ModelSerializer):
    producto = serializers.CharField(source='modelo')
    precio = serializers.FloatField()
    depto = serializers.CharField(source='departamento.clave')
    familia = serializers.CharField(source='familia.name')
    marca = serializers.CharField(source='marca.name')
    
    class Meta:
        model = Producto
        
        fields = (
            "id", 
            "sku", 
            "depto",
            "familia",
            "marca",
            "producto", 
              "precio"
        )


