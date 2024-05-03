from rest_framework import serializers

from ventas.models import *

class ReporteProductoSerializer(serializers.ModelSerializer):
    fechaVenta = serializers.SerializerMethodField()
    precioUnitario = serializers.FloatField()
    IVA = serializers.FloatField()
    IEPS = serializers.FloatField()
    total = serializers.FloatField()

    def get_fechaVenta(self, obj):
        return obj.fechaVenta

    class Meta:
        model = PartidasCarrito
        fields = ('fechaVenta',
                'cantidad',
                'departamento',
                'marca',
                'familia',
                'modelo',
                'precioUnitario',
                'IVA',
                'IEPS',
                'total')
        
class ReporteGeneralSerializer(serializers.ModelSerializer):
    precioUnitario = serializers.FloatField()
    IVA = serializers.FloatField()
    IEPS = serializers.FloatField()
    total = serializers.FloatField()

    class Meta:
        model = PartidasCarrito
        fields = ('cantidad',
                'departamento',
                'marca',
                'familia',
                'modelo',
                'precioUnitario',
                'IVA',
                'IEPS',
                'total')

class CarritoSerializer(serializers.ModelSerializer):
    partidas = ReporteGeneralSerializer(many=True, read_only=False)
    class Meta:
        model = Carrito
        fields = ('partidas',)

class VentaCompleteSerializer(serializers.ModelSerializer):
    carrito = CarritoSerializer(
            read_only=True
    )

    class Meta:
        model = Venta
        fields = ('carrito',
                  'documentType',
                  'folio',
                  'fechaDeVenta',
                  'vendedor',
                  'observaciones',
                  'Subtotal',
                  'IVA',
                  'IEPS',
                  'Total',
                  )