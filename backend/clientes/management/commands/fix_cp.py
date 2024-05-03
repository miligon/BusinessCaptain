from django.core.management.base import BaseCommand, CommandError
from django.db.utils import IntegrityError
import pandas as pd

from clientes.models import Cliente


class Command(BaseCommand):
    help = "Fix cp on Clientes"

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        for c in Cliente.objects.all():
            if len(c.cp) < 5:
                ceros = 5 - len(c.cp)
                padded = c.cp
                for i in range(0, ceros):
                  padded = '0' + padded
                c.cp = padded
                c.save()
        #data.to_excel('catalogo_actualizado.xlsx')

        
