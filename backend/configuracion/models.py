from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from clientes.models import Cliente, Address
from .manager import CustomUserManager

class Sucursal(Address):
    nombre = models.TextField(max_length=256)
    razonSocial = models.CharField(max_length=250, null=True)
    RFC = models.CharField(max_length=250, null=True)
    regimenFiscal = models.CharField(max_length=250, null=True)
    telefono = models.TextField(null=True)
    email = models.EmailField(max_length=256, null=True)
    logo = models.ImageField(upload_to='logos/', null=True)
    
    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name ="Sucursal"
        verbose_name_plural ="Sucursales"

class Caja(models.Model):
    nombre =  models.TextField(verbose_name="Nombre de caja",
                                   max_length=250, null=True, blank=True)
    sucursal = models.ForeignKey(Sucursal, on_delete=models.PROTECT, null=False, blank=True)

    def __str__(self):
        return self.nombre + "({})".format(self.sucursal)
    
    class Meta:
        verbose_name ="Caja"
        verbose_name_plural ="Cajas"

class ConfiguracionCaja(models.Model):
    caja = models.OneToOneField(Caja, related_name='configuracion', on_delete=models.CASCADE)
    activar_integracion_MP = models.BooleanField(verbose_name='Activar integracion mercado pago')
    open_print_ticket = models.BooleanField(verbose_name='Abrir ventana para impresion de ticket siempre')
    
    class Meta:
        verbose_name ="Configuracion Caja"
        verbose_name_plural ="Configuracion Cajas"

class Empleados(models.Model):
    id = models.PositiveBigIntegerField(
        verbose_name="Clave de empleado", 
        primary_key=True, unique =True, null=False, blank=False)
    first_name = models.TextField(verbose_name="Nombre", 
                max_length=256, null=False, blank=False)
    last_name = models.TextField(verbose_name="Apellidos", 
                max_length=256, null=False, blank=True)
    observaciones = models.TextField(verbose_name="observaciones",
                                   max_length=250, null=True, blank=True)
    sucursal = models.ManyToManyField(Sucursal)

    def __str__(self):
        return self.first_name + " " + self.last_name
    
    class Meta:
        verbose_name ="Empleado"
        verbose_name_plural ="Empleados"

class User(AbstractUser):
    first_name = models.TextField(verbose_name="Nombre", 
                max_length=256, null=True, blank=True)
    last_name = models.TextField(verbose_name="Apellidos", 
                max_length=256, null=True, blank=True)
    descripcion = models.TextField(verbose_name="Descripción",
                                   max_length=250, null=True, blank=True)
    cliente = models.OneToOneField(Cliente,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )

    empleado = models.OneToOneField(Empleados,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )

    caja = models.ForeignKey(Caja, on_delete=models.PROTECT, null=True, blank=True)

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'

    objects = CustomUserManager()

    def is_client(self):
        verbose_name="Es cliente?"
        if (self.cliente):
            return True
        else:
            return False

class BaseDocument(models.Model):
    TICKET = 'TK'
    NOTA_DE_VENTA = 'NV'
    FACTURA = 'FA'
    ORDEN_DE_TRABAJO = 'OT'

    DOC_TYPES = [
        (TICKET, 'Ticket'),
        (NOTA_DE_VENTA, 'Nota de Venta'),
        (FACTURA, 'Factura'),
        (ORDEN_DE_TRABAJO, 'Orden de Trabajo'),
    ]
    documentType = models.CharField(max_length=3,choices=DOC_TYPES) 
    folio = models.PositiveIntegerField(null=False)

    class Meta:
        abstract = True

class ConsecutivosSucursales(models.Model):
    id_sucursal = models.ForeignKey(Sucursal, on_delete=models.PROTECT,verbose_name="Sucursal")
    documentType = models.CharField(max_length=3,choices=BaseDocument.DOC_TYPES,verbose_name="Tipo de Doc.") 
    consecutivo = models.PositiveBigIntegerField(verbose_name="Consecutivo")
    
    class Meta:
        verbose_name ="Consecutivo de sucursal"
        verbose_name_plural ="Consecutivos de sucursales"