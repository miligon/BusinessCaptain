from django.core.management.base import BaseCommand, CommandError
from django.db.utils import IntegrityError
import pandas as pd

from almacen.models import Marca, Familia, Departamento, Codigos, Producto, PublicacionImpresa 


class Command(BaseCommand):
    help = "Imports Products from an excel file"

    def add_arguments(self, parser):
        parser.add_argument("excel_file_path", nargs=1, type=str)

    def handle(self, *args, **options):
        path = options['excel_file_path'][0]
        excel_prods = pd.read_excel(path, 'Productos')
        excel_deptos = pd.read_excel(path, 'Departamentos')
        print(excel_prods)
        print(excel_deptos)
        print("Importando departamentos ...")
        for departamento in excel_deptos.iterrows():
            Departamento.objects.get_or_create(clave=str(departamento[1]['clave']).strip(), descripcion=str(departamento[1]['descripcion']).strip())
        
        
        print("Importando marcas ...")
        for marca in excel_prods['marca'].unique():
            name = str(marca).strip()
            clave = name.replace(' ', '_')
            Marca.objects.get_or_create(name=name, clave=clave)

        print("Importando familia ...")
        for familia in excel_prods['familia'].unique():
            name = str(familia).strip()
            Familia.objects.get_or_create(name=name)

        print("importando productos ...")
        count = 0
        for producto in excel_prods.iterrows():
            p = producto[1]
            codigo1 = str(p.pop('codigo1')).strip()
            codigo2 = str(p.pop('codigo2')).strip()
            autorPrincipal = str(p.pop('autorPrincipal')).strip()
            editorial = str(p.pop('editorial')).strip()
            departamento = str(p.pop('departamento')).strip()
            marca = str(p.pop('marca')).strip()
            familia = str(p.pop('familia')).strip()
            claveSAT = p.pop('claveSAT')
            claveSAT = str(int(claveSAT) if str(claveSAT) != 'nan' else '').strip()
            depto_id = Departamento.objects.get(clave=departamento)
            marca_id = Marca.objects.get(name=marca)
            familia_id = Familia.objects.get(name=familia)
            
            try:
                prod, created = Producto.objects.get_or_create(departamento=depto_id, marca=marca_id, familia=familia_id, claveSAT=claveSAT, **p)
            except IntegrityError:
                prod = Producto.objects.get(sku=p['sku'])
            
            if 'nan' not in codigo1:
                #print(codigo1)
                Codigos.objects.get_or_create(producto=prod, codigo=codigo1)

            if 'nan' not in codigo2:
                #print(codigo2)
                Codigos.objects.get_or_create(producto=prod, codigo=codigo2)
            
            if 'nan' not in autorPrincipal or 'nan' not in editorial:
                autorPrincipal = autorPrincipal if 'nan' not in autorPrincipal else ''
                editorial = editorial if 'nan' not in editorial else ''
                PublicacionImpresa.objects.get_or_create(producto=prod, autorPrincipal=autorPrincipal, editorial=editorial)

            count+=1
            if (count % 500 == 0):
                print(count)
        print(count)
        #data.to_excel('catalogo_actualizado.xlsx')

        
