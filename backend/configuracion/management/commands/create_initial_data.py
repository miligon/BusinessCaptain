from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import Group
from django.db.utils import IntegrityError
from faker import Faker
from configuracion.models import *
from clientes.models import *
from almacen.models import *


class Command(BaseCommand):
    help = "Create initial data for testing"

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        faker = Faker(['es_MX'])
        sucursal = Sucursal(
            calle=faker.street_name(),
            no_ext=faker.building_number(),
            no_int=faker.secondary_address(),
            colonia=faker.city(),
            localidad=faker.city(),
            municipio=faker.city(),
            estado=faker.state(),
            pais="México",
            cp=faker.postcode(),
            nombre=faker.company(),
            razonSocial=faker.company(),
            RFC=faker.rfc(),
            telefono=faker.msisdn()[:10],
            email=faker.ascii_company_email(),
            logo=None,
            regimenFiscal=faker.job(),
        )
        sucursal.save()

        caja = Caja(
            nombre='Caja 1',
            sucursal=sucursal
        )
        caja.save()

        consecutivo = ConsecutivosSucursales(
            id_sucursal=sucursal,
            documentType=BaseDocument.TICKET,
            consecutivo=1,
        )
        consecutivo.save()

        consecutivo = ConsecutivosSucursales(
            id_sucursal=sucursal,
            documentType=BaseDocument.NOTA_DE_VENTA,
            consecutivo=1,
        )
        consecutivo.save()

        consecutivo = ConsecutivosSucursales(
            id_sucursal=sucursal,
            documentType=BaseDocument.ORDEN_DE_TRABAJO,
            consecutivo=1,
        )
        consecutivo.save()

        consecutivo = ConsecutivosSucursales(
            id_sucursal=sucursal,
            documentType=BaseDocument.FACTURA,
            consecutivo=1,
        )
        consecutivo.save()

        empleado = Empleados(
            id=1,
            first_name=faker.first_name(),
            last_name=faker.last_name(),
            observaciones="",
        )
        empleado.save()

        client=Cliente(
            id_client=1,
            RFC='XAXX010101000',
            regimen_fiscal="Sin Obligaciones fiscales",
            razonSocial='VENTAS PUBLICO GENERAL',
            telefono_movil='2222222222',
            cp='72000',
        )
        client.save()

        client=Cliente(
            id_client=2,
            RFC=faker.rfc(),
            regimen_fiscal="Sin Obligaciones fiscales",
            razonSocial=faker.name(),
            telefono_movil=faker.phone_number(),
            cp=faker.postcode(),
        )
        client.save()

        depto=Departamento(clave='AB', descripcion='ABARROTES')
        familia=Familia(name='DETERGENTES')
        marca1=Marca(clave='COR', name='La Corona')
        marca2=Marca(clave='PB', name='Procter&Gamble')

        depto.save()
        familia.save()
        marca1.save()
        marca2.save()

        p1= Producto(
            sku='AB01',
            departamento=depto,
            familia=familia,
            marca=marca1,
            modelo='ROMA DE 1kg',
            costo=22.0,
            precio=30,
            claveSAT='4329089',
            tasaIVA=0.16,
            tasaIEPS=0.0,
        )
        p1.save()

        p2= Producto(
            sku='AB02',
            departamento=depto,
            familia=familia,
            marca=marca2,
            modelo='SALVO de 1.4L',
            costo=50.0,
            precio=70.0,
            claveSAT='4329089',
            tasaIVA=0.16,
            tasaIEPS=0.0,
        )
        p2.save()

        Codigos(
            producto=p2,
            codigo='7500435108249'
        ).save()

        Codigos(
            producto=p1,
            codigo='7501026004605',
        ).save()

        

        user=User(
            username='test',
            email='test@gmail.com',
            caja=caja,
        )

        user.set_password('test_password')
        
        user.save()

        group = Group(name='Reportes')
        group.save()

        user.groups.add(group)





        
