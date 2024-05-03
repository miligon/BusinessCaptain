from django.db import models
from django.utils import timezone
from ventas.models import Venta
from configuracion.models import Caja

class detalleMovimiento(models.Model):
    EF ='EF'
    TB = 'TB'
    TD = 'TD'
    TC = 'TC'
    CH = 'CH'
    UN = 'UN'
    PAYMENT_TYPES = [
        (EF, 'Efectivo'),
        (TB, 'Transferencia bancaria'),
        (TD, 'Tarjeta de Debito'),
        (TC, 'Tarjeta de Credito'),
        (CH, 'Cheque'),
        (UN, 'Otros')
    ]
    PAR = 'PAR'
    UNA = 'UNA'
    PAYMENT_MOD_TYPES = [
        (PAR, 'Parcialidades'),
        (UNA, 'Una sola exhibición'),
    ]
    venta = models.OneToOneField(Venta, on_delete=models.PROTECT, verbose_name ="ID Venta", related_name='detalle_pago', null=True, blank=True) 
    caja = models.ForeignKey(Caja, on_delete=models.PROTECT, verbose_name ="ID Caja", related_name='movimientos', null=True, blank=True) 
    descripcion = models.TextField(verbose_name ="Descripción",
                                   max_length=256) 
    fechaDeMovimiento = models.DateTimeField(verbose_name ="Fecha del movimiento",
                                             null = False, default=timezone.now) 
    monto = models.DecimalField(verbose_name ="Monto del movimiento",
                                max_digits=19, decimal_places=2, null=False)
    formaDePago = models.CharField(verbose_name ="Forma de pago",
                                   max_length=2,choices=PAYMENT_TYPES)
    modalidadDePago = models.CharField(verbose_name ="Modalidad de pago",
                                       max_length=3,choices=PAYMENT_MOD_TYPES)
    banco = models.TextField (verbose_name ="Banco",
                              max_length=100, null=True, blank=True)
    referencia = models.TextField (verbose_name ="Referencia bancaria",
                                   max_length=100, null=True, blank=True)
    montoEfectivo = models.DecimalField(verbose_name ="Monto pagado en Efectivo",
                                        max_digits=19, decimal_places=2, null=True, blank=True)
    montoCambioEfectivo = models.DecimalField(verbose_name ="Monto devuelto en efectivo",
                                              max_digits=19, decimal_places=2, null=True, blank=True)

    class Meta:
        verbose_name ="Detalle de movimiento"
        verbose_name_plural ="Detalle de movimientos"