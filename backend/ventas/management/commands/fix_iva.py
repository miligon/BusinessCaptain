from django.core.management.base import BaseCommand, CommandError
from django.db.utils import IntegrityError
from decimal import *
import pandas as pd

from ventas.models import Venta, Carrito, PartidasCarrito


class Command(BaseCommand):
    help = "Fix IVA miscalculations on DB"

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        for venta in Venta.objects.select_related('carrito').all():
            partidas = PartidasCarrito.objects.filter(carrito=venta.carrito)
            totalIVA = 0.0
            totalIEPS = 0.0
            subtotal = 0.0
            
            for p in partidas:
                precio_sin_iva = p.total / (1 + p.tasaIVA)
                p.IVA = p.total - precio_sin_iva
                precio_sin_ieps = precio_sin_iva / (1 + p.tasaIEPS)
                p.IEPS = precio_sin_iva - precio_sin_ieps
                p.save()
                totalIVA += float(p.IVA)
                totalIEPS += float(p.IEPS)
                subtotal += float(precio_sin_ieps) 
                
            venta.Subtotal = Decimal(round(subtotal, 2))
            venta.IVA = Decimal(round(totalIVA, 2))
            venta.IEPS = Decimal(round(totalIEPS, 2))
            venta.save()
            print(f'{venta.documentType}-{venta.folio}')

        
