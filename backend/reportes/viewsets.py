from rest_framework import status
from decimal import Decimal
from django.utils import timezone
from datetime import datetime

import pandas as pd

from rest_framework import viewsets
from rest_framework.permissions import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from django.db.models import F

#from clientes.models import Cliente
#from configuracion.models import User, Empleados, ConsecutivosSucursales
from almacen.models import Departamento
from almacen.serializer import DepartamentoSerializer
#from finanzas.models import detalleMovimiento
from ventas.models import *
from .permissions import ReportAccess
from .serializer import *
import json

def parseDateTime(fecha):
    # Se captura la venta
    parsed_datetime = datetime.strptime(fecha, "%Y-%m-%d %H:%M:%S")
    # Assuming the input time is in Central Time (CT)
    # You can convert it to UTC if needed
    ct_timezone = timezone.get_fixed_timezone(-360)  # Central Time is UTC-6
    return timezone.make_aware(parsed_datetime, ct_timezone)

@api_view(['GET'])
@permission_classes([ReportAccess])
def ventasGeneral(request):
    inicio = request.GET.get('inicio','')
    fin = request.GET.get('fin','')

    if (inicio and fin):
        fechaInicio=parseDateTime(inicio)
        fechaFin=parseDateTime(fin)
        
        carritos = Carrito.objects.filter(info_venta__fechaDeVenta__gt=fechaInicio, info_venta__fechaDeVenta__lt=fechaFin, info_venta__cancelado=False)
        partidas = PartidasCarrito.objects.filter(carrito__in=carritos)#.annotate(fechaVenta=F('carrito__venta__fechaDeVenta'))
        serializer=ReporteGeneralSerializer(partidas, many=True)
        
        data = pd.DataFrame().from_dict(serializer.data)
        articulosReporte=None
        departamentosReporte=None
        total=None

        if (len(data) > 0):
            # Reporte x articulos
            art_gdf = data.groupby(["departamento", "marca", "familia", "modelo"]).sum().reset_index()
            art_df = art_gdf[['cantidad', "departamento", "marca", "familia", "modelo", 'total']]
            articulosReporte = art_df
        else:
            articulosReporte = data

        d = Departamento.objects.all()
        deptos = pd.DataFrame.from_dict(DepartamentoSerializer(d, many=True).data)
        deptos.insert(loc=len(deptos.columns), column='total', value=0.0)
        deptos = deptos[['clave','total']]
        deptos = deptos.rename(columns={'clave':'departamento'})
        if (len(data) > 0):
            # Reporte x Departamentos
            data2 = data[["departamento", 'total']]
            dep_gdf = data2.groupby(["departamento"]).sum().reset_index()
            # Merge deptos and ventas dataframes on 'departamento' column (outer join to keep all 'departamentos' from deptos)
            merged_df = deptos.merge(dep_gdf, on='departamento', suffixes=('_deptos', '_ventas'), how='outer')
            # Fill missing 'total_deptos' values with 0.0
            merged_df['total_deptos'] = merged_df['total_ventas'].fillna(0.0)
            # Replace 'total' column with the modified values
            deptos['total'] = merged_df['total_deptos']
            departamentosReporte = deptos.sort_values(by='departamento')
        else:
            departamentosReporte = deptos
            
        # Venta Total
        if (len(data) > 0):
            total = round(data['total'].sum(),2)
        else:
            total = 0.0

        respuesta={
            "articulos" : articulosReporte.to_dict(orient='records'),
            "departamentos" : departamentosReporte.to_dict(orient='records'),
            "total" : total,
        }

        acumulado = 0.0

        if fechaInicio.month == fechaFin.month:
            inicio = fechaInicio
            final = fechaFin
            inicio = inicio.replace(day=1)
            
            carritos = Carrito.objects.filter(info_venta__fechaDeVenta__gt=inicio, info_venta__fechaDeVenta__lt=final, info_venta__cancelado=False)
            partidas = PartidasCarrito.objects.filter(carrito__in=carritos)#.annotate(fechaVenta=F('carrito__venta__fechaDeVenta'))
            serializer=ReporteGeneralSerializer(partidas, many=True)
            
            data = pd.DataFrame().from_dict(serializer.data)
            if (len(data) > 0):
                acumulado = round(data['total'].sum(),2)
                respuesta['acumulado'] = acumulado

        return Response(status=200, data=respuesta)

    return Response(status=400)
    
@api_view(['GET'])
@permission_classes([ReportAccess])
def ventasPorDocumento(request):
    inicio = request.GET.get('inicio','')
    fin = request.GET.get('fin','')

    if (inicio and fin):
        fechaInicio=parseDateTime(inicio)
        fechaFin=parseDateTime(fin)
        
        reporte = []
        report = pd.DataFrame([])
        for docType in BaseDocument.DOC_TYPES:
            if (docType[0] != BaseDocument.FACTURA):

                if (docType[0] == BaseDocument.ORDEN_DE_TRABAJO):
                    carritos = Carrito.objects.filter(orden_trabajo__isnull=False, info_venta__documentType=BaseDocument.TICKET, info_venta__fechaDeVenta__gt=fechaInicio, info_venta__fechaDeVenta__lt=fechaFin, info_venta__cancelado=False)
                else:
                    if (docType[0] == BaseDocument.NOTA_DE_VENTA):
                        carritos = Carrito.objects.filter(info_venta__documentType=docType[0] ,info_venta__fechaDeVenta__gt=fechaInicio, info_venta__fechaDeVenta__lt=fechaFin, info_venta__cancelado=False)
                    else:
                        carritos = Carrito.objects.filter(orden_trabajo__isnull=True, info_venta__documentType=docType[0] ,info_venta__fechaDeVenta__gt=fechaInicio, info_venta__fechaDeVenta__lt=fechaFin, info_venta__cancelado=False)

                partidas = PartidasCarrito.objects.prefetch_related('carrito', 'carrito__info_venta').filter(carrito__in=carritos)#.annotate(fechaVenta=F('carrito__venta__fechaDeVenta'))
                serializer=ReporteGeneralSerializer(partidas, many=True)
                data = pd.DataFrame().from_dict(serializer.data)

                d = Departamento.objects.all()
                deptos = pd.DataFrame.from_dict(DepartamentoSerializer(d, many=True).data)
                deptos.insert(loc=len(deptos.columns), column='total', value=0.0)
                deptos = deptos[['clave','total']]
                deptos = deptos.rename(columns={'clave':'departamento'})
                if (len(data) > 0):
                    # Reporte x Departamentos
                    data2 = data[["departamento", 'total']]
                    dep_gdf = data2.groupby(["departamento"]).sum().reset_index()
                    # Merge deptos and ventas dataframes on 'departamento' column (outer join to keep all 'departamentos' from deptos)
                    merged_df = deptos.merge(dep_gdf, on='departamento', suffixes=('_deptos', '_ventas'), how='outer')
                    # Fill missing 'total_deptos' values with 0.0
                    merged_df['total_deptos'] = merged_df['total_ventas'].fillna(0.0)
                    # Replace 'total' column with the modified values
                    deptos['total'] = merged_df['total_deptos']
                    departamentosReporte = deptos.sort_values(by='departamento')
                else:
                    departamentosReporte = deptos
                
                departamentosReporte.rename(columns = {'total':docType[1]}, inplace = True) 
                if report.columns.empty:
                    report = departamentosReporte.copy()
                else:
                    report = pd.merge(report, departamentosReporte, on='departamento')

        column_totals = report.sum(axis=0)
        df_totals = pd.DataFrame(column_totals).transpose()
        df_totals['departamento'] = 'Total'
        merged_df_with_totals = pd.concat([report, df_totals], ignore_index=True)
        totales_por_depto = merged_df_with_totals.transpose()
        merged_df_with_totals['Total'] = totales_por_depto.drop('departamento', axis=0).sum(axis=0)
        merged_df_with_totals.rename(columns = {'departamento':'-'}, inplace = True) 
        return Response(status=200, data=merged_df_with_totals.to_dict('split'))

    return Response(status=400)
