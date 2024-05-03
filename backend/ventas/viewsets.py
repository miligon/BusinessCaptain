from rest_framework import status
from decimal import Decimal
from django.utils import timezone
from datetime import datetime

from rest_framework import viewsets, mixins
from rest_framework.permissions import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from clientes.models import Cliente
from configuracion.models import User, Empleados, ConsecutivosSucursales
from almacen.models import Producto
from taller.models import OrdenDeTrabajo
from finanzas.models import detalleMovimiento

from .models import *
from .serializer import *

class CarritoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Carrito.objects.all()

    def get_serializer(self, *args, **kwargs):
        if "data" in kwargs:
            data = kwargs["data"]

            if isinstance(data, list):
                kwargs["many"] = True

        return super(CarritoViewSet, self).get_serializer(*args, **kwargs)
        
    def get_serializer_class(self, *args, **kwargs):
    
        if self.action == 'retrieve':
            return CarritoConPartidasSerializer   
        return CarritoSerializer

class VentaViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Venta.objects.all()
    #serializer_class = VentaSerializer

    def destroy(self, request, pk=None):
        if request.user and pk is not None:
            print(pk)
            idVenta=pk
            try:
                ventas = Venta.objects.get(pk=idVenta)
                movDetail = detalleMovimiento.objects.get(venta=ventas)
                carrito = ventas.carrito

                if (ventas.documentType == BaseDocument.TICKET or ventas.documentType == BaseDocument.ORDEN_DE_TRABAJO):
                    # Realizar transaccion en base de datos
                    movDetail.delete()
                    ventas.delete()
                    carrito.delete()
                    return Response("DELETED", status=status.HTTP_204_NO_CONTENT)
                else:
                    movDetail.delete()
                    ventas.cancelado = True
                    ventas.save()
                    return Response("MARKED", status=status.HTTP_204_NO_CONTENT)
            except Exception as e:
                print(e)
                return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response("ERROR", status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self, *args,**kwargs):
        self.request.parser_context.get('kwargs')
        fecha = self.request.query_params.get('fecha')
        if fecha:
            parsed_datetime = datetime.strptime(fecha, "%Y-%m-%d")
            ct_timezone = timezone.get_fixed_timezone(-360)  # Central Time is UTC-6
            
            inicio = parsed_datetime.replace(hour=0, minute=0, second=0)
            inicio = timezone.make_aware(inicio, ct_timezone)
            fin = parsed_datetime.replace(hour=23, minute=59, second=59)
            fin = timezone.make_aware(fin, ct_timezone)
            self.queryset = Venta.objects.filter(fechaDeVenta__gt=inicio, fechaDeVenta__lt=fin)
            return self.queryset
        else:
            self.queryset = Venta.objects.all()
            return self.queryset

    def get_serializer(self, *args, **kwargs):
        if "data" in kwargs:
            data = kwargs["data"]

            if isinstance(data, list):
                kwargs["many"] = True

        return super(VentaViewSet, self).get_serializer(*args, **kwargs)
    
    def get_serializer_class(self, *args, **kwargs):
        if self.action == 'list':
            return VentaSerializer
        if self.action == 'retrieve':
            return VentaCompleteSerializer
        return VentaSerializer

class PartidasCarritoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = PartidasCarrito.objects.all()
    serializer_class = PartidasCarritoSerializer

    def get_serializer(self, *args, **kwargs):
        if "data" in kwargs:
            data = kwargs["data"]

            if isinstance(data, list):
                kwargs["many"] = True

        return super(PartidasCarritoViewSet, self).get_serializer(*args, **kwargs)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ventaCreate(request):
    fechaHora  = request.data.get('dateTime', '')
    idVendedor = request.data.get('vendedor', '')
    idCliente = request.data.get('cliente', '')
    idUser = request.user
    idCaja = idUser.caja.id
    docType = request.data.get('docType', '')
    infoPago = request.data.get('infoPago', '')
    partidas = request.data.get('partidas', '')
    observaciones = request.data.get('observaciones', '')

    if (fechaHora and idVendedor and idCliente and docType and infoPago and partidas):
        try:
            # Se crea carrito
            cliente = Cliente.objects.get(id_client=idCliente)
            user = User.objects.get(id=1)
            carrito = Carrito(usuario=user, cliente=cliente)
            
            subtotal = Decimal(0.0)
            totalIVA = Decimal(0.0)
            totalIEPS = Decimal(0.0)
            total = Decimal(0.0)
            new_partidas = list()
            # Se agregan partidas al carrito
            for p in partidas:
                id = p['id']
                cantidad = Decimal(p['cantidad'])
                punitario = Decimal(p['precioUnitario'])
                # Change to total to match interfaces
                ptotal = Decimal(p['precioTotal'])
                producto = Producto.objects.get(id=id)
                precio_sin_iva = ptotal / (1 + producto.tasaIVA)
                piva = ptotal - precio_sin_iva
                precio_sin_ieps = precio_sin_iva / (1 + producto.tasaIEPS)
                pieps = precio_sin_iva - precio_sin_ieps
                partida = PartidasCarrito(carrito=carrito,
                                        cantidad=cantidad,
                                        sku=producto.sku,
                                        departamento=producto.departamento.clave,
                                        familia=producto.familia.name,
                                        marca=producto.marca.name,
                                        modelo=producto.modelo,
                                        claveSAT=producto.claveSAT,
                                        descuento=0.0,
                                        precioUnitario=punitario,
                                        total=ptotal,
                                        tasaIVA=producto.tasaIVA,
                                        tasaIEPS=producto.tasaIEPS,
                                        IVA=piva,
                                        IEPS=pieps
                                        )
                new_partidas.append(partida)
                total += ptotal
                totalIVA += piva
                totalIEPS += pieps
                
            subtotal = total-(totalIVA+totalIEPS)
            
            dType = docType
            if docType == BaseDocument.ORDEN_DE_TRABAJO:
                if ('PUBLICO GENERAL' in cliente.razonSocial and infoPago['forma'] == 'EF'):
                    dType = BaseDocument.TICKET
                else:
                    dType = BaseDocument.NOTA_DE_VENTA
                

            # Se captura la venta
            parsed_datetime = datetime.strptime(fechaHora, "%Y-%m-%dT%H:%M:%S")

            # Assuming the input time is in Central Time (CT)
            # You can convert it to UTC if needed
            ct_timezone = timezone.get_fixed_timezone(-360)  # Central Time is UTC-6
            dateTime = timezone.make_aware(parsed_datetime, ct_timezone)

            vendedor = Empleados.objects.get(id=idVendedor)
            caja = Caja.objects.get(pk=idCaja)
            folio = ConsecutivosSucursales.objects.get(id_sucursal=caja.sucursal,documentType=dType)

            venta = Venta(carrito=carrito,
                        documentType=dType,
                        folio=folio.consecutivo,
                        fechaDeVenta=dateTime,
                        caja=caja,
                        vendedor=vendedor,
                        observaciones=observaciones,
                        Subtotal=subtotal,
                        IVA=totalIVA,
                        IEPS=totalIEPS,
                        Total=total,
                        devolucion=False,
                        garantia=False,
                        cancelado=False)

            # Se captura información de pago
            formaDePago = ''
            montoEfectivo=None
            montoCambioEfectivo=None
            banco=None
            referencia=None
            if (infoPago['forma'] == 'EF'):
                formaDePago=detalleMovimiento.EF
                montoEfectivo=infoPago['montoEfectivo']
                montoCambioEfectivo=infoPago['cambioEfectivo']

            if (infoPago['forma'] == 'CH'):
                formaDePago=detalleMovimiento.CH
            if (infoPago['forma'] == 'TB'):
                formaDePago=detalleMovimiento.TB
            if (infoPago['forma'] == 'TC'):
                formaDePago=detalleMovimiento.TC
            if (infoPago['forma'] == 'TD'):
                formaDePago=detalleMovimiento.TD

            if (infoPago['forma'] == 'CH' or 
                infoPago['forma'] == 'TB'):
                banco=infoPago['banco']
                referencia=infoPago['referencia']                

            movimiento = detalleMovimiento(
                venta=venta,
                caja=caja,
                descripcion="Ingreso Venta",
                fechaDeMovimiento=dateTime,
                monto=infoPago['monto'],
                formaDePago=formaDePago,
                modalidadDePago=detalleMovimiento.PAR if infoPago['modo'] == 'PAR' else detalleMovimiento.UNA,
                montoEfectivo=montoEfectivo,
                montoCambioEfectivo=montoCambioEfectivo,
                banco=banco,
                referencia=referencia
            )
            
            # Realizar transaccion en base de datos
            carrito.save()
            PartidasCarrito.objects.bulk_create(new_partidas)
            venta.save()
            movimiento.save()
            folio.consecutivo+=1
            folio.save()
            if docType == BaseDocument.ORDEN_DE_TRABAJO:
                folio_ot = ConsecutivosSucursales.objects.get(id_sucursal=caja.sucursal,documentType=BaseDocument.ORDEN_DE_TRABAJO)
                ot = OrdenDeTrabajo(
                    documentType = BaseDocument.ORDEN_DE_TRABAJO,
                    folio=folio_ot.consecutivo,
                    carrito=carrito,
                    caja=caja,
                    empleado=vendedor,
                    last_status=OrdenDeTrabajo.CLOSED_PAID,
                    fecha_ultimo_evento=dateTime,
                    observaciones='',
                    nombre_cliente=observaciones if 'PUBLICO GENERAL' in cliente.razonSocial else cliente.razonSocial,
                    telefono=None if 'PUBLICO GENERAL' in cliente.razonSocial else cliente.telefono_movil,
                    anticipo=0.0,
                    total=total,
                )
                ot.save()
                folio_ot.consecutivo += 1
                folio_ot.save()
            serializer = VentaCompleteSerializer(venta)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response("ERROR", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response("ERROR", status=status.HTTP_400_BAD_REQUEST)
