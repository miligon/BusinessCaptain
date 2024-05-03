from django.db.models import Q, Count, Case, When, Value, IntegerField, Sum, CharField
from django.db import transaction, IntegrityError
from django.shortcuts import get_object_or_404
from functools import reduce
import operator
from django.http import Http404
from rest_framework import status

from rest_framework import viewsets, mixins
from rest_framework.permissions import *
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import *
from .serializer import *
from BusinessCaptain.common.pagination import CustomPagination

from django.conf import settings
from django.core.files import File
from fpdf import FPDF
import qrcode
from io import BytesIO
import os

class DepartamentoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer

class FamiliaViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Familia.objects.all()
    serializer_class = FamiliaSerializer

class MarcaViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    @transaction.atomic
    def update(self, request, pk=None):
        codigos = request.data.pop('codigos', None)
        PubImpresaInfo = request.data.pop('PubImpresaInfo', None)
        request.data.pop('id', None)
        request.data.pop('sku', None)

        try:
            producto = Producto.objects.get(id=pk)
        except Producto.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        for key, value in request.data.items():
            if key == 'departamento':
                setattr(producto, key, get_object_or_404(Departamento, pk=value)) 
                continue   
            if key == 'familia':
                setattr(producto, key, get_object_or_404(Familia, pk=value)) 
                continue   
            if key == 'marca':
                setattr(producto, key, get_object_or_404(Marca, pk=value)) 
                continue   
            setattr(producto, key, value)
        
        # Save the changes to the database
        producto.save()
        
        if codigos:
            if not isinstance(codigos, list):
                return Response(data={"error":"Codigos should be a list"}, status=status.HTTP_400_BAD_REQUEST)
            
            codigos_list = [codigo['codigo'] for codigo in codigos] if len(codigos) > 0 else []
            # Delete all that are not present in the new list
            queryset = producto.codigos.filter(~(Q(codigo__in=codigos_list) & Q(producto=pk)))
            queryset.delete()

             # Get the list of existing codigos
            existing_codigos = set(Codigos.objects.filter(producto=pk).values_list('codigo', flat=True))
            
            # Create new codigos that are present in the updated data but not in the instance
            try:
                for codigo in codigos:
                    if codigo['codigo'] not in existing_codigos:
                        Codigos.objects.create(codigo=codigo['codigo'], producto=producto)
            except IntegrityError:
                return Response(data={"error":"Code already exists"}, status=status.HTTP_400_BAD_REQUEST)  
        else:
            queryset = producto.codigos.all()
            queryset.delete()
        
        if PubImpresaInfo:
            try:
                pubImpresa = PublicacionImpresa.objects.get(producto=pk)
                pubImpresa.editorial = PubImpresaInfo['editorial']
                pubImpresa.autorPrincipal = PubImpresaInfo['autorPrincipal']
                if ('autoresSecundarios' in PubImpresaInfo):
                    pubImpresa.autoresSecundarios = PubImpresaInfo['autoresSecundarios']
                pubImpresa.save()
            except PublicacionImpresa.DoesNotExist:
                pubImpresa = PublicacionImpresa(producto=producto, editorial=PubImpresaInfo['editorial'], autorPrincipal=PubImpresaInfo['autorPrincipal'])
                if ('autoresSecundarios' in PubImpresaInfo):
                    pubImpresa.autoresSecundarios = PubImpresaInfo['autoresSecundarios']
                pubImpresa.save()
        else:
            try:
                p = PublicacionImpresa.objects.get(producto=pk)
                p.delete()
            except:
                pass

        return Response(ProductoSerializer(producto).data, status=status.HTTP_200_OK)
    
    @transaction.atomic
    def create(self, request):
        codigos = request.data.pop('codigos', None)
        PubImpresaInfo = request.data.pop('PubImpresaInfo', None)
        departamento = request.data.pop('departamento', None),
        familia = request.data.pop('familia', None),
        marca = request.data.pop('marca', None),
        request.data.pop('id', None)
        print(request.data)
        if departamento and familia and marca:
            d = get_object_or_404(Departamento, id=departamento[0])
            f = get_object_or_404(Familia, id=familia[0])
            m = get_object_or_404(Marca, id=marca[0])

            try:
                p = Producto.objects.create(departamento=d, familia=f, marca=m, **request.data)
            except IntegrityError:
                return Response(data={"error":"A product with the same SKU already exist"}, status=status.HTTP_400_BAD_REQUEST)    
        else:
            return Response(data={"error":"Departmento, marca and familia must be included"}, status=status.HTTP_400_BAD_REQUEST)

        if codigos:
            if not isinstance(codigos, list):
                return Response(data={"error":"Codigos should be a list"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create new codigos that are present in the updated data but not in the instance
            try:
                for codigo in codigos:
                    Codigos.objects.create(codigo=codigo['codigo'], producto=p)
            except IntegrityError:
                return Response(data={"error":"Code already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        if PubImpresaInfo:
            pubImpresa = PublicacionImpresa(producto=p, **PubImpresaInfo)
            pubImpresa.save()

        return Response(ProductoSerializer(p).data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ProductoSearch(request):
    query = request.GET.get('query', '')
    marca = request.GET.get('marca', '')
    familia = request.GET.get('familia', '')
    depto = request.GET.get('depto', '')
    codigo = request.GET.get('codigo', '')

    paginator = CustomPagination()

    paginator.page_size = 150

    
    if codigo:
        print("codigo")
        products = Producto.objects.filter(Q(sku__exact=codigo))
        if (len(products) == 0):
            products = Producto.objects.filter(Q(codigos__codigo__exact=codigo))

        if(len(products) == 1):
            result_page = paginator.paginate_queryset(products, request)
            serializer = ProductoSearchSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
        else:
            result_page = paginator.paginate_queryset([], request)
            serializer = ProductoSearchSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
                
    if query:
        #Q(modelo__icontains=query) | 
        filtro = Q()#Q(departamento__clave__icontains=query) | Q(familia__name__icontains=query) | Q(marca__clave__icontains=query)
        if depto:
            filtro = Q(departamento__clave__iexact=depto) & filtro
        if familia:
            filtro = Q(familia__name__iexact=familia) & filtro
        if marca:
            filtro = Q(marca__name__iexact=marca) & filtro
        
        keywords = query.split(" ")
        # Build a Q object to combine the filters for each keyword
        q_objects = Q()
        for keyword in keywords:
            q_objects |= Q(modelo__icontains=keyword)
            q_objects |= Q(PubImpresaInfo__editorial__icontains=keyword)
            q_objects |= Q(PubImpresaInfo__autorPrincipal__icontains=keyword)
            q_objects |= Q(PubImpresaInfo__autoresSecundarios__icontains=keyword)
            filtro = filtro & q_objects
        products = Producto.objects.prefetch_related('departamento', 'familia', 'marca', 'PubImpresaInfo').filter(filtro).annotate(
                    order=Case(
                        When(modelo__iexact=query, then=Value(len(keywords) + 6)),
                        When(reduce(operator.and_, [Q(modelo__icontains=kw) for kw in keywords]), then=Value(1+3)),
                        When(modelo__istartswith=query, then=Value(3)),
                        When(modelo__iendswith=query, then=Value(2)),
                        When(modelo__icontains=query, then=Value(1)),
                        default=Value(0),
                        output_field=IntegerField()),
                    ).order_by('-order')
        
        result_page = paginator.paginate_queryset(products, request)
        serializer = ProductoSearchSerializer(result_page, many=True)
        #return Response(serializer.data)
        return paginator.get_paginated_response(serializer.data)
    else:
        if marca or familia or depto:
            if depto:
                filtro = Q(departamento__clave__iexact=depto)
                if familia:
                    filtro = Q(familia__name__iexact=familia) & filtro
                if marca:
                    filtro = Q(marca__name__iexact=marca) & filtro
            else:
                if familia:
                    filtro = Q(familia__name__iexact=familia)
                    if marca:
                        filtro = Q(marca__name__iexact=marca) & filtro
                else:
                    if marca:
                        filtro = Q(marca__name__iexact=marca)
            products = Producto.objects.prefetch_related('departamento', 'familia', 'marca', 'PubImpresaInfo').filter(filtro).order_by('modelo')
            result_page = paginator.paginate_queryset(products, request)
            serializer = ProductoSearchSerializer(result_page, many=True)
            #return Response(serializer.data)
            return paginator.get_paginated_response(serializer.data)
        else:
            products = Producto.objects.prefetch_related('departamento', 'familia', 'marca', 'PubImpresaInfo').all()
            result_page = paginator.paginate_queryset(products, request)
            serializer = ProductoSearchSerializer(result_page, many=True)
            #return Response(serializer.data)
            return paginator.get_paginated_response(serializer.data)

class PublicacionImpresaViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = PublicacionImpresa.objects.all()
    serializer_class = PublicacionImpresaSerializer

class CodigosViewSet(mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    mixins.ListModelMixin,
                    viewsets.GenericViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Codigos.objects.all()
    serializer_class = CodigosSerializer

    def get_serializer(self, *args, **kwargs):
        if "data" in kwargs:
            data = kwargs["data"]

            if isinstance(data, list):
                kwargs["many"] = True
                
        return super(CodigosViewSet, self).get_serializer(*args, **kwargs)

# @api_view(['POST'])
# @permission_classes([DjangoModelPermissions])
# def GeneraEtiqueta(request):
#     codigo = request.data.get('CODE', '')
#     sku = request.data.get('SKU', '')
#     primaryKey = request.data.get('PK', '')
    
#     if codigo:
#         producto = Codigos.objects.get(codigo=codigo).producto
#     else:
#         if sku:
#             producto = Producto.objects.get(sku=sku)
#         else:
#             if primaryKey:
#                 producto = Producto.objects.get(id=primaryKey)
#             else:
#                 return Response("ERROR", status=status.HTTP_400_BAD_REQUEST)
    
#     etiquetaPath = settings.STATIC_URL[1:] + 'etiquetas/' + str(producto.sku) + '.pdf'
  
#     if (os.path.exists(etiquetaPath)):
#         return Response({"label" : settings.BASE_URL + settings.STATIC_URL + 'etiquetas/' + str(producto.sku) + '.pdf'})
#     else:
#         ticketFile = make_label(producto)
#         return Response({"label" : settings.BASE_URL + settings.STATIC_URL + ticketFile})
            
# def make_label(producto):
#     fontType = 'Arial'

#     # Create a new PDF object
#     pdf = FPDF('P', 'mm', (48, 100))

#     # Add a page to the PDF
#     pdf.add_page()
#     pdf.set_margins(left= 0.0, top= 1.0, right=2.5)
#     pdf.set_auto_page_break(auto = True, margin = 5.0)

#     # Set the font and size
#     pdf.set_font(fontType, 'B', 8)
#     # Add some text
#     font = 7
#     h = int(font *0.5)
#     pdf.set_font(fontType, '', font)
#     qr_y = pdf.get_y()

#     linea1 = producto.modelo if len(producto.modelo) < 19 else producto.modelo[:19]
#     linea2 = (producto.modelo[19:])[:19] if len(producto.modelo) > 19 else ""
#     linea3 = (producto.modelo[38:])[:19] if len(producto.modelo) > 38 else ""

#     pdf.cell(0, h, str(linea1), align='L', ln=2)
#     pdf.cell(0, h, str(linea2), align='L', ln=2)
#     pdf.cell(0, h, str(linea3), align='L', ln=2)
#     pdf.cell(0, h, "$" + str(producto.precio), align='L', ln=2)

#     qr = qrcode.QRCode(
#         version=None,
#         error_correction=qrcode.ERROR_CORRECT_L,
#         box_size=1,
#         border=4,
#     )
#     qr.add_data(producto.sku)
#     qr.make(fit=True)

#     # Guardar el código QR en un archivo PNG
#     img = qr.make_image(fill_color="black", back_color="white")
#     qr_image_buffer = BytesIO()
#     img.save(qr_image_buffer, format='PNG')
    
#     pdf.image(qr_image_buffer, x=30.5,y=qr_y, w=16.0,h=16.0)
#     pdf.cell(0, h, ".", align='C', ln=2)

#     # Output the PDF to a file
#     pdf.output(settings.STATIC_URL[1:] + 'etiquetas/' + str(producto.sku) + '.pdf', 'F')

#     return  'etiquetas/' + str(producto.sku) + '.pdf'
