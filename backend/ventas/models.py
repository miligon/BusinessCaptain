import uuid
from .helpers import *
import os
from django.db import models
from configuracion.models import BaseDocument, Cliente, Empleados, Caja

from django.conf import settings

# Create your models here.
class Carrito(models.Model):
    uuid_carrito = models.UUIDField(verbose_name = "UUID",
                                    unique=True, default=uuid.uuid4,  primary_key=True)
    fechaDeCreacion = models.DateTimeField(verbose_name = "Fecha de creación",
                                           auto_now_add=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT, verbose_name = "Cliente")
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT,verbose_name = "Usuario sistema")

    class Meta:
        verbose_name ="Carrito"
        verbose_name_plural ="Carritos"

    def __str__(self):
        return str(self.uuid_carrito)

class Venta(BaseDocument):
    carrito = models.OneToOneField( Carrito, on_delete=models.PROTECT, verbose_name = "Carrito", related_name='info_venta', primary_key=True)
    fechaDeVenta = models.DateTimeField(verbose_name = "Fecha de venta")
    caja = models.ForeignKey(Caja, on_delete=models.PROTECT,verbose_name = "Caja")
    vendedor = models.ForeignKey(Empleados, on_delete=models.PROTECT,verbose_name = "Vendedor")
    observaciones = models.CharField(verbose_name = "Observaciones", blank=True, max_length=150)
    Subtotal = models.DecimalField(verbose_name = "Subtotal", max_digits=19, decimal_places=2, null = True)  
    IVA = models.DecimalField(verbose_name = "IVA", max_digits=19, decimal_places=2, null = True)
    IEPS = models.DecimalField(verbose_name = "IEPS", max_digits=19, decimal_places=2, null = True)
    Total = models.DecimalField(verbose_name = "Total", max_digits=19, decimal_places=2, null = True)
    devolucion = models.BooleanField(verbose_name = "Devuelto?", default=False)
    garantia = models.BooleanField(verbose_name = "Solicitud de garantia?", default=False)
    cancelado = models.BooleanField(verbose_name = "Cancelado?", default=False)
    ticketFile = models.FileField(upload_to='tickets/%Y/%m/%d/' ,verbose_name="Ticket de pago en PDF", blank=True, null=True )

    def ticket(self):
        if self.ticketFile:
            if (os.path.exists(self.ticketFile.path)):
                return settings.BASE_URL + self.ticketFile.url
            else:
                self.ticketFile = make_ticket(self)
                self.save()
                return settings.BASE_URL + self.ticketFile.url
        else:
            self.ticketFile = make_ticket(self)
            self.save()
            return settings.BASE_URL + self.ticketFile.url
    
    class Meta:
        verbose_name ="Venta"
        verbose_name_plural ="Ventas"

class PartidasCarrito(models.Model):
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE, 
                        verbose_name = "Carrito", related_name='partidas')
    cantidad = models.FloatField(verbose_name = "Cantidad")
    sku = models.CharField(verbose_name="SKU",
        max_length=150)
    departamento = models.CharField(verbose_name="Departamento",
        max_length=45, null = True)
    familia = models.CharField(verbose_name="Familia",
        max_length=100, null = True)
    marca = models.CharField(verbose_name="Marca",
        max_length=45, null = True)
    modelo = models.CharField(verbose_name="Nombre del producto",
        max_length=1000)
    claveSAT = models.CharField(verbose_name="Clave SAT",
        max_length=45, null = True)
    descuento = models.DecimalField(verbose_name = "Descuento",
                                    max_digits=5, decimal_places=2, null = True)
    precioUnitario = models.DecimalField(verbose_name = "Precio unitario",
                                         max_digits=19, decimal_places=2, null = True)
    total = models.DecimalField(verbose_name = "Total",
                                max_digits=19, decimal_places=2, null = True)
    tasaIVA = models.DecimalField(verbose_name = "Tasa de IVA",
                                  max_digits=3, decimal_places=2, null = True)
    tasaIEPS = models.DecimalField(verbose_name = "Tasa de IEPS",
                                   max_digits=3, decimal_places=2, null = True)
    IVA = models.DecimalField(verbose_name = "IVA",
                              max_digits=19, decimal_places=2, null = True)
    IEPS = models.DecimalField(verbose_name = "IEPS",
                               max_digits=19, decimal_places=2, null = True)

    class Meta:
        verbose_name ="Partida carrito"
        verbose_name_plural ="Partidas carrito"
