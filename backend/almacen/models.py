from django.db import models
from django.core.exceptions import ObjectDoesNotExist

# Create your models here.

class Departamento(models.Model):
    clave = models.CharField(verbose_name="Clave",
        unique=True,max_length=45)
    descripcion = models.CharField(verbose_name="Descripción",
        max_length=100)

    def __str__(self):
        return str(self.clave)
    
    class Meta:
        verbose_name ="Departamento"
        verbose_name_plural ="Departamentos"

class Familia(models.Model):
    name = models.CharField(verbose_name="Familia", 
        unique=True, max_length=100)

    def __str__(self):
        return str(self.name)
    
    class Meta:
        verbose_name ="Familia"
        verbose_name_plural ="Familias"

class Marca(models.Model):
    clave = models.CharField(verbose_name="Clave",
        unique=True,max_length=45)
    name = models.CharField(verbose_name="Descripción",
        max_length=100)

    def __str__(self):
        return str(self.name)
    
    class Meta:
        verbose_name ="Marca"
        verbose_name_plural ="Marcas"

class Producto(models.Model):
    id = models.BigAutoField(
        primary_key=True, null=False, auto_created=True, unique=True, )
    sku = models.CharField(verbose_name="SKU",
        max_length=150, db_index=True, unique=True, auto_created=False)
    departamento = models.ForeignKey(
        Departamento, on_delete=models.PROTECT)
    familia = models.ForeignKey(
        Familia, on_delete=models.PROTECT)
    marca = models.ForeignKey(
        Marca, on_delete=models.PROTECT)
    modelo = models.CharField(verbose_name="Nombre del producto",
        max_length=1000)
    costo = models.DecimalField(verbose_name="Costo",
        max_digits=19, decimal_places=2)
    precio = models.DecimalField(verbose_name="Precio",
        max_digits=19, decimal_places=2)
    claveSAT = models.CharField(verbose_name="Clave SAT",
        max_length=45)
    tasaIVA = models.DecimalField(verbose_name="Tasa de IVA",
        max_digits=3, decimal_places=2)
    tasaIEPS = models.DecimalField(verbose_name="Tasa de IEPS",
        max_digits=3, decimal_places=2)
    #Discount

    def DeptoClave(self):
        return self.departamento.clave
    
    def familiaClave(self):
        return self.familia.name
    
    def marcaClave(self):
        return self.marca.clave
    

    def __str__(self):
        # nombre = str(self.departamento.clave + ' ' +
        # self.familia.name + ' ' +
        # self.marca.name + ' ' +
        # self.modelo)  
        nombre = str(self.modelo)
        try:
            if self.PubImpresaInfo:
                nombre = (nombre + ' - EDITORIAL: ' + 
                self.PubImpresaInfo.editorial + ' / AUTOR: ' +
                self.PubImpresaInfo.autorPrincipal)
                return nombre
        except ObjectDoesNotExist:
            return nombre
    
    class Meta:
        verbose_name ="Producto"
        verbose_name_plural ="Productos"
    
class PublicacionImpresa(models.Model):
    producto = models.OneToOneField(
        Producto, related_name='PubImpresaInfo',
        on_delete=models.CASCADE, primary_key=True)
    editorial = models.CharField(verbose_name="Editorial",
        max_length=250, blank=True)
    autorPrincipal = models.CharField(verbose_name="Autores principales",
        max_length=100, blank = True)
    autoresSecundarios = models.CharField(verbose_name="Autores Secundarios",
        max_length=500, blank=True, default ="")
    
    def __str__(self):
        return str(self.producto.modelo) + " - " + self.autorPrincipal
    
    class Meta:
        verbose_name ="Publicación Impresa"
        verbose_name_plural ="Publicaciones Impresas"

class Codigos(models.Model):
    producto = models.ForeignKey(
        Producto, related_name='codigos',
        on_delete=models.CASCADE)
    codigo = models.CharField(verbose_name="Codigo de producto",
    unique=True, null=False, db_index = True, max_length=50)

    def __str__(self):
        return str(self.codigo) + " - " + str(self.producto)
    
    class Meta:
        verbose_name ="Código de producto"
        verbose_name_plural ="Códigos de productos"