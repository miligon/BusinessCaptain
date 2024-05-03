# Create your tests here.
from django.test import TestCase
from django.db.utils import IntegrityError
from .models import *

# Create your tests here.
class clientesTestCase(TestCase):
    def setUp(self):
        Cliente.objects.create(RFC="RFC",
                                regimen_fiscal="Regimen fiscal",
                                razonSocial="Razon Social",
                                telefono_movil="123456789",
                                observaciones="observaciones",
                                email = "email@correo.com",
                                publicidad=True)

    def test_cliente_has_address(self):
        cliente = Cliente.objects.get(RFC="RFC")
        cliente.calle = "CALLE"
        cliente.no_ext = "15"
        cliente.no_int = "D"
        cliente.colonia = "CENTRO"
        cliente.localidad = "LOCALIDAD"
        cliente.municipio = "MUNICIPIO"
        cliente.estado = "ESTADO"
        cliente.pais = "MEXICO"
        cliente.cp = "12345"
        self.assertEqual(cliente.calle, "CALLE")
        self.assertEqual(cliente.no_ext, "15")
        self.assertEqual(cliente.no_int, "D")
        self.assertEqual(cliente.colonia, "CENTRO")
        self.assertEqual(cliente.localidad, "LOCALIDAD")        
        self.assertEqual(cliente.municipio, "MUNICIPIO")
        self.assertEqual(cliente.estado, "ESTADO")
        self.assertEqual(cliente.pais, "MEXICO")
        self.assertEqual(cliente.cp, "12345")