# Generated by Django 5.0.3 on 2024-04-30 14:35

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Cliente',
            fields=[
                ('id_client', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='Clave de cliente')),
                ('calle', models.TextField(blank=True, null=True, verbose_name='Calle')),
                ('no_ext', models.CharField(blank=True, max_length=50, null=True, verbose_name='Número exterior:')),
                ('no_int', models.CharField(blank=True, max_length=50, null=True, verbose_name='Número interior')),
                ('colonia', models.CharField(blank=True, max_length=50, null=True, verbose_name='Colonia')),
                ('localidad', models.CharField(blank=True, max_length=100, null=True, verbose_name='Localidad')),
                ('municipio', models.CharField(blank=True, max_length=100, null=True, verbose_name='Municipio')),
                ('estado', models.CharField(blank=True, max_length=50, null=True, verbose_name='Estado')),
                ('pais', models.CharField(blank=True, max_length=50, null=True, verbose_name='País')),
                ('cp', models.CharField(max_length=12, verbose_name='CP')),
                ('RFC', models.CharField(db_index=True, max_length=20, verbose_name='RFC')),
                ('regimen_fiscal', models.TextField(max_length=250, verbose_name='Régimen fiscal')),
                ('razonSocial', models.TextField(max_length=256, verbose_name='Razón social')),
                ('telefono_movil', models.TextField(blank=True, null=True, verbose_name='Telefono Móvil / Principal')),
                ('telefonos', models.TextField(blank=True, max_length=250, null=True, verbose_name='Teléfonos secundarios')),
                ('observaciones', models.TextField(blank=True, max_length=250, null=True, verbose_name='Observaciones')),
                ('email', models.EmailField(blank=True, max_length=256, verbose_name='Correo principal')),
                ('email2', models.EmailField(blank=True, max_length=256, null=True, verbose_name='Correo alternativo 1')),
                ('email3', models.EmailField(blank=True, max_length=256, null=True, verbose_name='Correo alternativo 2')),
                ('publicidad', models.BooleanField(default=False, verbose_name='Activar publicidad?')),
            ],
            options={
                'verbose_name': 'Cliente',
                'verbose_name_plural': 'Clientes',
            },
        ),
    ]
