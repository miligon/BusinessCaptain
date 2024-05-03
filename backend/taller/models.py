from django.db import models
from django.utils import timezone

import uuid 

from configuracion.models import BaseDocument, Empleados, Caja
from ventas.models import Carrito

# Create your models here.
class OrdenDeTrabajo(BaseDocument):
    IDLE = '1'
    IN_PROGRESS = '2'
    EXCEPTION = '3'
    READY = '4'
    CLOSED = '5'
    CLOSED_PAID = '6'
    STATUS_TYPES = [
        (IDLE, 'En espera'),
        (IN_PROGRESS, 'En proceso'),
        (EXCEPTION, 'Excepción'),
        (READY, 'Listo para entrega'),
        (CLOSED, 'Orden Cerrada'),
        (CLOSED_PAID, 'Orden Cerrada y cobrada'),
    ]
    carrito = models.OneToOneField(Carrito, on_delete=models.CASCADE, verbose_name="Carrito asociado a OT", related_name='orden_trabajo', null=True)
    caja = models.ForeignKey(Caja, on_delete=models.PROTECT, verbose_name="Caja", related_name='orden_trabajo')
    empleado = models.ForeignKey(Empleados, on_delete=models.PROTECT, verbose_name="Empleado", related_name='orden_trabajo')
    last_status = models.CharField(verbose_name="Estado de la OT", max_length=1,choices=STATUS_TYPES) 
    fecha_ultimo_evento = models.DateTimeField(verbose_name="Ultima actualización", default=timezone.now)
    observaciones = models.TextField (verbose_name="Observaciones", max_length=1000,blank=True, default="")
    nombre_cliente = models.TextField (verbose_name="Nombre del cliente", max_length=200)
    telefono = models.TextField (verbose_name="Telefono de contacto", max_length=15, blank=True, null=True)
    anticipo = models.DecimalField(verbose_name="Anticipo", max_digits=19, decimal_places=2)
    total = models.DecimalField(verbose_name="Total", max_digits=19, decimal_places=2)

    class Meta:
        verbose_name ="Orden de trabajo"
        verbose_name_plural ="Ordenes de trabajo"

class eventosOT(models.Model):
    id_OT = models.ForeignKey(OrdenDeTrabajo, on_delete=models.CASCADE, verbose_name="Eventos del OT", related_name='eventos')
    fecha = models.DateTimeField(verbose_name="Fecha", default=timezone.now)
    tipo_de_evento = models.CharField(verbose_name="Estado de la OT", max_length=1,choices=OrdenDeTrabajo.STATUS_TYPES) 
    observaciones = models.TextField (verbose_name="Observaciones", blank=True, default="")

    class Meta:
        verbose_name ="Evento de OT"
        verbose_name_plural ="Eventos de OT"