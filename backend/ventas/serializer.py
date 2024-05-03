from rest_framework import serializers
from django.db.models import Q

from .models import *
from finanzas.serializer import detalleMovimientoSerializer
from taller.models import OrdenDeTrabajo

class PartidasCarritoBulkCreateSerializer(serializers.ListSerializer):  
        def create(self, validated_data): 
            partidas = [PartidasCarrito(**item) for item in validated_data]  
            return PartidasCarrito.objects.bulk_create(partidas)
        
class PartidasCarritoSerializer(serializers.ModelSerializer):
    precioUnitario = serializers.FloatField()
    IVA = serializers.FloatField()
    IEPS = serializers.FloatField()
    total = serializers.FloatField()
    class Meta:
        model = PartidasCarrito
        fields = '__all__'
        list_serializer_class = PartidasCarritoBulkCreateSerializer


class CarritoBulkCreateSerializer(serializers.ListSerializer):  
        def create(self, validated_data): 
            carrito_data = [Carrito(**item) for item in validated_data]  
            return Carrito.objects.bulk_create(carrito_data)  
        
class CarritoSerializer(serializers.ModelSerializer):
   class Meta:
        model = Carrito
        fields = '__all__'
        list_serializer_class = CarritoBulkCreateSerializer

class CarritoConPartidasSerializer(serializers.ModelSerializer):
    partidas = PartidasCarritoSerializer(many=True, read_only=False)
    class Meta:
        model = Carrito
        fields = '__all__'

class VentasBulkCreateSerializer(serializers.ListSerializer):  
        def create(self, validated_data): 
            venta = [Venta(**item) for item in validated_data]  
            return Venta.objects.bulk_create(venta)
        
class VentaSerializer(serializers.ModelSerializer):
    Subtotal = serializers.FloatField()
    IVA = serializers.FloatField()
    IEPS = serializers.FloatField()
    Total = serializers.FloatField()
    OT = serializers.SerializerMethodField()
    class Meta:
        model = Venta
        list_serializer_class = VentasBulkCreateSerializer
        fields = ('carrito',
                  'documentType',
                  'folio',
                  'fechaDeVenta',
                  'caja',
                  'vendedor',
                  'observaciones',
                  'Subtotal',
                  'IVA',
                  'IEPS',
                  'Total',
                  'devolucion',
                  'garantia',
                  'cancelado',
                  'OT',
                  )
    
    def get_OT(self, obj):
        if hasattr(obj.carrito, 'orden_trabajo'):
            if obj.carrito.orden_trabajo:
                return obj.carrito.orden_trabajo.folio
        else:
            return None
        
class VentaCompleteSerializer(serializers.ModelSerializer):
    carrito = CarritoConPartidasSerializer(
            read_only=True
    )
    cliente_name = serializers.SerializerMethodField()
    vendedor_name = serializers.SerializerMethodField()
    detalle_pago = detalleMovimientoSerializer(
         read_only = True,
    )
    OT = serializers.SerializerMethodField()

    class Meta:
        model = Venta
        fields = ('carrito',
                  'documentType',
                  'folio',
                  'fechaDeVenta',
                  'caja',
                  'vendedor',
                  'observaciones',
                  'Subtotal',
                  'IVA',
                  'IEPS',
                  'Total',
                  'devolucion',
                  'garantia',
                  'cancelado',
                  'ticket',
                  'cliente_name',
                  'vendedor_name',
                  'detalle_pago',
                  'OT',
                  )
    
    def get_cliente_name(self, obj):
        return obj.carrito.cliente.razonSocial
    
    def get_vendedor_name(self, obj):
        return obj.vendedor.first_name + ' ' + obj.vendedor.last_name
    
    def get_OT(self, obj):
        if hasattr(obj.carrito, 'orden_trabajo'):
            if obj.carrito.orden_trabajo:
                return obj.carrito.orden_trabajo.folio
        else:
            return None