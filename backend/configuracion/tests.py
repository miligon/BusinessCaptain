from django.test import TestCase

# Create your tests here.
from django.db.utils import IntegrityError
from .models import *
from clientes.models import *

# Create your tests here.
class userTestCase(TestCase):
    def setUp(self):
        Cliente.objects.create(RFC="RFC",
                                regimen_fiscal="Regimen fiscal",
                                razonSocial="Razon Social",
                                telefono_movil="123456789",
                                observaciones="observaciones",
                                email = "email@correo.com",
                                publicidad=True)
        
    
    def test_user_is_client(self):
        cliente = Cliente.objects.get(RFC="RFC")
        user = User.objects.create(username="test_user", 
                                   email="correo@gmail.com",
                                   password="password",
                                   cliente=cliente)
        self.assertEqual(user.is_client(), True)
        
class BaseDocumentTestCase(TestCase):
    def setUp(self):
        pass        
    
    def test_BaseDocument_docTypes(self):
        self.assertEqual(BaseDocument.TICKET, "TK")
        self.assertEqual(BaseDocument.NOTA_DE_VENTA, "NV")
        self.assertEqual(BaseDocument.FACTURA, "FA")
        self.assertEqual(BaseDocument.ORDEN_DE_TRABAJO, "OT")
        self.assertTupleEqual(BaseDocument.DOC_TYPES[0], (BaseDocument.TICKET, 'Ticket'))
        self.assertTupleEqual(BaseDocument.DOC_TYPES[1], (BaseDocument.NOTA_DE_VENTA, 'Nota de Venta'))
        self.assertTupleEqual(BaseDocument.DOC_TYPES[2], (BaseDocument.FACTURA, 'Factura'))
        self.assertTupleEqual(BaseDocument.DOC_TYPES[3], (BaseDocument.ORDEN_DE_TRABAJO, 'Orden de Trabajo'))