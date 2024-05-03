# Generated by Django 5.0.3 on 2024-04-30 14:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Departamento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('clave', models.CharField(max_length=45, unique=True, verbose_name='Clave')),
                ('descripcion', models.CharField(max_length=100, verbose_name='Descripción')),
            ],
            options={
                'verbose_name': 'Departamento',
                'verbose_name_plural': 'Departamentos',
            },
        ),
        migrations.CreateModel(
            name='Familia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True, verbose_name='Familia')),
            ],
            options={
                'verbose_name': 'Familia',
                'verbose_name_plural': 'Familias',
            },
        ),
        migrations.CreateModel(
            name='Marca',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('clave', models.CharField(max_length=45, unique=True, verbose_name='Clave')),
                ('name', models.CharField(max_length=100, verbose_name='Descripción')),
            ],
            options={
                'verbose_name': 'Marca',
                'verbose_name_plural': 'Marcas',
            },
        ),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, unique=True)),
                ('sku', models.CharField(db_index=True, max_length=150, unique=True, verbose_name='SKU')),
                ('modelo', models.CharField(max_length=1000, verbose_name='Nombre del producto')),
                ('costo', models.DecimalField(decimal_places=2, max_digits=19, verbose_name='Costo')),
                ('precio', models.DecimalField(decimal_places=2, max_digits=19, verbose_name='Precio')),
                ('claveSAT', models.CharField(max_length=45, verbose_name='Clave SAT')),
                ('tasaIVA', models.DecimalField(decimal_places=2, max_digits=3, verbose_name='Tasa de IVA')),
                ('tasaIEPS', models.DecimalField(decimal_places=2, max_digits=3, verbose_name='Tasa de IEPS')),
                ('departamento', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='almacen.departamento')),
                ('familia', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='almacen.familia')),
                ('marca', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='almacen.marca')),
            ],
            options={
                'verbose_name': 'Producto',
                'verbose_name_plural': 'Productos',
            },
        ),
        migrations.CreateModel(
            name='PublicacionImpresa',
            fields=[
                ('producto', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='PubImpresaInfo', serialize=False, to='almacen.producto')),
                ('editorial', models.CharField(blank=True, max_length=250, verbose_name='Editorial')),
                ('autorPrincipal', models.CharField(blank=True, max_length=100, verbose_name='Autores principales')),
                ('autoresSecundarios', models.CharField(blank=True, default='', max_length=500, verbose_name='Autores Secundarios')),
            ],
            options={
                'verbose_name': 'Publicación Impresa',
                'verbose_name_plural': 'Publicaciones Impresas',
            },
        ),
        migrations.CreateModel(
            name='Codigos',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codigo', models.CharField(db_index=True, max_length=50, unique=True, verbose_name='Codigo de producto')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='codigos', to='almacen.producto')),
            ],
            options={
                'verbose_name': 'Código de producto',
                'verbose_name_plural': 'Códigos de productos',
            },
        ),
    ]