from django.core.management.base import BaseCommand, CommandError
from django.db.utils import IntegrityError
import pandas as pd

from clientes.models import Cliente


class Command(BaseCommand):
    help = "Imports Customers from an excel file"

    def add_arguments(self, parser):
        parser.add_argument("excel_file_path", nargs=1, type=str)

    def handle(self, *args, **options):
        path = options['excel_file_path'][0]
        excel_customers = pd.read_excel(path, 'Clientes')
        excel_customers = excel_customers.fillna('')
        print("Importando clientes ...")
        count = 0
        for customer in excel_customers.iterrows():
            c = customer[1]
            cp = c.pop('cp')
            if (cp != ''):
                cp = str(int(cp))

            try:
                customer, created = Cliente.objects.get_or_create(cp=cp, **c)
            except IntegrityError:
                print(c)
        print(count)
        #data.to_excel('catalogo_actualizado.xlsx')

        
