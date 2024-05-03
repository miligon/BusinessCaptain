from django.db import models

# Create your models here.
class Address(models.Model):
    calle = models.TextField(verbose_name="Calle", null=True, blank=True)
    no_ext = models.CharField(verbose_name="Número exterior:", max_length=50,null=True, blank=True)
    no_int = models.CharField(verbose_name="Número interior", max_length=50, null=True, blank=True)
    colonia = models.CharField(verbose_name="Colonia", max_length=50,null=True, blank=True)
    localidad = models.CharField(verbose_name="Localidad", max_length=100,null=True, blank=True)
    municipio = models.CharField(verbose_name="Municipio", max_length=100,null=True, blank=True)
    estado = models.CharField(verbose_name="Estado", max_length=50,null=True, blank=True)
    pais = models.CharField(verbose_name="País", max_length=50,null=True, blank=True)
    cp = models.CharField(verbose_name="CP", max_length=12)

    class Meta:
        abstract = True

class Cliente(Address):
    id_client = models.BigAutoField(verbose_name="Clave de cliente", auto_created=True, primary_key=True)
    RFC = models.CharField(verbose_name="RFC", max_length=20, db_index=True)
    regimen_fiscal = models.TextField(verbose_name="Régimen fiscal", max_length=250)
    razonSocial = models.TextField(verbose_name="Razón social", max_length=256)
    telefono_movil = models.TextField(verbose_name="Telefono Móvil / Principal", null=True, blank=True)
    telefonos = models.TextField(verbose_name="Teléfonos secundarios", max_length=250, null=True, blank=True)
    observaciones = models.TextField(verbose_name="Observaciones", max_length=250, null=True, blank=True)
    email = models.EmailField(verbose_name="Correo principal", max_length=256, blank=True)
    email2 = models.EmailField(verbose_name="Correo alternativo 1", max_length=256, null=True, blank=True)
    email3 = models.EmailField(verbose_name="Correo alternativo 2", max_length=256, null=True,blank=True)
    publicidad = models.BooleanField(verbose_name="Activar publicidad?", default=False)
    
    def __str__(self):
        return self.razonSocial + " ({})".format(self.RFC)
    
    class Meta:
        verbose_name ="Cliente"
        verbose_name_plural ="Clientes"