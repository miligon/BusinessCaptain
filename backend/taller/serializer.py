from rest_framework import serializers

from .models import *

class OrdenDeTrabajoSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenDeTrabajo
        fields = '__all__'

class eventosOTSerializer(serializers.ModelSerializer):
    class Meta:
        model = eventosOT
        fields = '__all__'
