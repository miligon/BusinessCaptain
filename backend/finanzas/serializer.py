from rest_framework import serializers

from .models import *

class detalleMovimientoBulkCreateSerializer(serializers.ListSerializer):  
        def create(self, validated_data): 
            detalle = [detalleMovimiento(**item) for item in validated_data]  
            return detalleMovimiento.objects.bulk_create(detalle)
        
class detalleMovimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = detalleMovimiento
        fields = '__all__'
        list_serializer_class = detalleMovimientoBulkCreateSerializer

