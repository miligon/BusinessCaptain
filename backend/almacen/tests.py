from django.test import TestCase
from django.db.utils import IntegrityError
from .models import *

# Create your tests here.
class almacenTestCase(TestCase):
    def setUp(self):
        depto = Departamento.objects.create(clave="T_DEPTO", descripcion="TEST DEPTO")
        familia = Familia.objects.create(name="TEST FAMILY")
        marca = Marca.objects.create(clave="T_MARCA", name="TEST_MARCA")
        Producto.objects.create(sku="LIBRO1",
                                departamento=depto,
                                familia=familia,
                                marca=marca,
                                modelo="Libro",
                                costo=100.00,
                                precio=12.0,
                                claveSAT="",
                                tasaIVA=0.16,
                                tasaIEPS=0.0)
        Producto.objects.create(sku="LIBRO2",
                                departamento=depto,
                                familia=familia,
                                marca=marca,
                                modelo="Libro 2",
                                costo=100.00,
                                precio=12.0,
                                claveSAT="",
                                tasaIVA=0.16,
                                tasaIEPS=0.0)

    def test_PubImpresa_create(self):
        producto = Producto.objects.get(sku="LIBRO1")
        PublicacionImpresa.objects.create(producto=producto,
                                        editorial="Editorial X",
                                        autorPrincipal="Autor Y")
    def test_producto_properties(self):
        producto = Producto.objects.get(sku="LIBRO2")
        PublicacionImpresa.objects.create(producto=producto,
                                        editorial="Editorial X2",
                                        autorPrincipal="Autor Y2")
        self.assertEqual(producto.DeptoClave(), 'T_DEPTO')
        self.assertEqual(producto.familiaClave(), 'TEST FAMILY')
        self.assertEqual(producto.marcaClave(), 'T_MARCA')
        self.assertEqual(producto.__str__(), 'Libro 2 - EDITORIAL: Editorial X2 / AUTOR: Autor Y2')

