from fpdf import FPDF
import qrcode
from PIL import Image, ImageOps
from io import BytesIO
from django.core.files import File
from django.conf import settings
import os
from decimal import Decimal

from datetime import datetime, timedelta
from dateutil import tz

def convertTime(fecha):
    # Define the CST timezone
    cst_tz = tz.gettz('America/Mexico_City')

    # Convert UTC datetime to CST
    cst_datetime = fecha.astimezone(cst_tz).strftime("%Y-%m-%d %H:%M:%S")

    # Print the CST representation
    return cst_datetime

def genColorQR(logoPath, data, big=False):
    
    logo = Image.open(logoPath)
    logo = ImageOps.invert(logo.convert("RGB"))
    
    basewidth = 80
    # taking base width
    if (big):
        basewidth = 100
    
    # adjust image size
    wpercent = (basewidth/float(logo.size[0]))
    hsize = int((float(logo.size[1])*float(wpercent)))
    logo = logo.resize((basewidth, hsize))

    
    QRcode = qrcode.QRCode(
        #version=None,
        error_correction=qrcode.ERROR_CORRECT_Q if big else qrcode.ERROR_CORRECT_M,
        #box_size=2,
        #border=4,
    )
    
    # taking url or text
    url = data
    
    # adding URL or text to QRcode
    QRcode.add_data(url)
    
    # generating QR code
    QRcode.make()#fit=Tre)
    
    # taking color name from user
    QRcolor = 'Black'
    
    # adding color to QR code
    QRimg = QRcode.make_image(
        fill_color=QRcolor, back_color="white").convert('RGB')
    
    # set size of QR code
    pos = ((QRimg.size[0] - logo.size[0]) // 2,
        (QRimg.size[1] - logo.size[1]) // 2)
    QRimg.paste(logo, pos)
    
    qr_image_buffer = BytesIO()
    QRimg.save(qr_image_buffer, format='PNG')
    
    return qr_image_buffer

def add_watermark(pdf, watermark_text):
    fontType = 'helvetica'
    pdf.set_font(fontType, '', 30)  # Choose the font and size for the watermark
    pdf.set_text_color(200, 200, 200)  # Set text color (light gray)
    
    # Rotate the coordinate system for diagonal watermark
    pdf.rotate(45)
    
    # Loop through each page to add the watermark
    pdf.text(45, 70, watermark_text)  # Adjust position as needed
    pdf.text(15, 110, watermark_text)  # Adjust position as needed
    pdf.rotate(0)  # Reset rotation

def render_ticket(self, pdf):
    fontType = 'helvetica'
    sucursal = self.caja.sucursal

    nombre = sucursal.nombre.strip()
    razonSocial = sucursal.razonSocial.strip()
    RFC = sucursal.RFC.strip()
    regimenFiscal = sucursal.regimenFiscal.strip()
    telefono = sucursal.telefono if sucursal.telefono else ""
    direccion = (sucursal.calle if sucursal.calle  else "") + " " + (sucursal.no_ext if sucursal.no_ext else "") + " " + (sucursal.no_int if sucursal.no_int else "")
    colonia = sucursal.colonia if sucursal.colonia else ""
    municipio = sucursal.municipio if sucursal.municipio else ""
    estado = sucursal.estado if sucursal.estado else ""
    CP = sucursal.cp if sucursal.cp else ""
    fecha = self.fechaDeVenta

    # Add a page to the PDF
    pdf.add_page()
    pdf.set_margins(left= 0.0, top= 3.0, right=2.5)
    pdf.set_auto_page_break(auto = True, margin = 5.0)

    # Set the font and size
    pdf.set_font(fontType, 'B', 8)
    # Add some text
    pdf.ln(0)
    pdf.cell(0, 0, nombre, align='C', ln=2)
    pdf.ln(3)

    font = 7
    h = int(font *0.5)
    pdf.set_font(fontType, 'B', font)
    if telefono != "": 
            pdf.image(settings.STATIC_ROOT / "icons/whatsapp_logo.png", 
                    12.50,pdf.get_y()-0.1, 3, 3)
            pdf.cell(0, h, telefono, align='C', ln=2) 
            pdf.ln(1)
    font = 6
    h = int(font *0.5)
    pdf.set_font(fontType, '', font)
    qr_y = pdf.get_y()
    if (self.documentType != self.TICKET and self.documentType != self.ORDEN_DE_TRABAJO):
        pdf.cell(0, h, razonSocial, align='L', ln=2)
        pdf.cell(0, h, "RFC: " + RFC, align='L', ln=2)
        if (len(regimenFiscal) > 46):
                pdf.cell(0, h, regimenFiscal[:46], align='L', ln=2)
                pdf.cell(0, h, regimenFiscal[46:], align='L', ln=2)
        else:
                pdf.cell(0, h, regimenFiscal, align='L', ln=2)
        qr_y = pdf.get_y()
        if direccion != "": pdf.cell(0, h, direccion, align='L', ln=2)
        if colonia != "": pdf.cell(0, h, colonia + " " + CP, align='L', ln=2)
        if municipio != "": pdf.cell(0, h, municipio, align='L', ln=2)
        if estado != "": pdf.cell(0, h, estado, align='L', ln=2)

    font = 7
    h = int(font *0.5)
    pdf.set_font(fontType, 'B', font)
    if (self.documentType != self.TICKET):
        if hasattr(self.carrito, 'orden_trabajo'):
            pdf.cell(0, h, f"{str(self.documentType)} {str(self.folio)} (OT)" , align='L', ln=2)
        else:
            pdf.cell(0, h, f"{str(self.documentType)} {str(self.folio)}" , align='L', ln=2)

    font = 7
    h = int(font *0.5)
    pdf.set_font(fontType, 'B', font)

    fecha = convertTime(fecha)

    if (self.documentType != self.TICKET and self.documentType != self.ORDEN_DE_TRABAJO):
        pdf.cell(0, h, "Fecha: " + fecha[:11], align='L', ln=2)
        pdf.cell(0, h, "Hora: " + fecha[11:19], align='L', ln=2)
        pdf.cell(0, h, f"Cliente({self.carrito.cliente.id_client}): ", align='L', ln=2)
        
        if (len(str(self.carrito.cliente.razonSocial)) > 29):
            pdf.cell(0, h, str(self.carrito.cliente.razonSocial[:29]), align='L', ln=2)
            pdf.cell(0, h, str(self.carrito.cliente.razonSocial[29:]), align='L', ln=2)
            if (len(str(self.carrito.cliente.razonSocial)) > 58):
                pdf.cell(0, h, str(self.carrito.cliente.razonSocial[:58]), align='L', ln=2)
        else:
            pdf.cell(0, h, str(self.carrito.cliente.razonSocial), align='L', ln=2)
        
        pdf.cell(0, h, str(self.carrito.cliente.RFC), align='L', ln=2)
        if (len(str(self.carrito.cliente.regimen_fiscal)) > 29):
            pdf.cell(0, h, str(self.carrito.cliente.regimen_fiscal[:29]), align='L', ln=2)
            pdf.cell(0, h, str(self.carrito.cliente.regimen_fiscal[29:]), align='L', ln=2)
            if (len(str(self.carrito.cliente.regimen_fiscal)) > 58):
                pdf.cell(0, h, str(self.carrito.cliente.regimen_fiscal[58:]), align='L', ln=2)
        else:
            pdf.cell(0, h, str(self.carrito.cliente.regimen_fiscal), align='L', ln=2)
        pdf.cell(0, h, str(self.carrito.cliente.cp), align='L', ln=2)
    else:
        pdf.cell(0, h, "Fecha: " + fecha[:19], align='L', ln=2) 

    if (self.observaciones != ''):
        pdf.cell(0, h, str(self.observaciones), align='L', ln=2)
    
    #if logo is not None:
    #    pdf.image(sucursal.logo, 35,qr_y-5.0, 9, 9)

    from .models import PartidasCarrito
    partidas = PartidasCarrito.objects.filter(carrito__exact=self.carrito.uuid_carrito)

    font = 6
    h = int(font *0.5)
    pdf.set_font(fontType, '', font)
    pdf.ln(3)

    pdf.set_font(fontType, '', font)
    pdf.cell(0, h, "DESCRIPCION",  align='L', ln=2, border = "T",)
    pdf.set_font(fontType, '', font)
    if (self.documentType != self.TICKET and self.documentType != self.ORDEN_DE_TRABAJO):  
        pdf.cell(0, h, "   CANT x PRECIO",  align='L')
        pdf.cell(0, h, "TOTAL",  align='R', ln=1)
        pdf.cell(0, h, "IMPUESTO",  align='L', border = "B")
        pdf.cell(0, h, "",  align='R', ln=2, border = "B")
    else:
        pdf.cell(0, h, "   CANT x PRECIO",  align='L', border = "B")
        pdf.cell(0, h, "TOTAL",  align='R', ln=2, border = "B")

    for partida in partidas:
        pdf.ln(3)

        font = 6
        h = int(font *0.5)
        pdf.set_font(fontType, 'B', font)
        pdf.cell(0, h, partida.modelo if len(partida.modelo) < 36 else partida.modelo[:36], align='L', ln=2)
        if len(partida.modelo) > 36:
            pdf.cell(0, h, partida.modelo[36:], align='L', ln=2)

        font = 7
        h = int(font *0.5)
        pdf.set_font(fontType, '', font)
        if (self.documentType != self.TICKET and self.documentType != self.ORDEN_DE_TRABAJO):
            precio_desglosado = (partida.precioUnitario - (partida.IVA / Decimal(partida.cantidad)) - (partida.IEPS / Decimal(partida.cantidad)))
            pdf.cell(0, h, "   {:.3f}".format(partida.cantidad) + " x ${:.2f}".format(precio_desglosado), align='L')
        else:
            pdf.cell(0, h, "   {:.3f}".format(partida.cantidad) + " x ${:.2f}".format(partida.precioUnitario), align='L')
        pdf.cell(0, h, "${:.2f}".format(partida.total), align='R', ln=1)

        if (self.documentType != self.TICKET and self.documentType != self.ORDEN_DE_TRABAJO):
            pdf.cell(0, h, "{}".format(partida.sku), ln=1)
            pdf.cell(0, h, "IVA({}%): ${:.2f}".format(int(partida.tasaIVA * 100), partida.IVA), ln=1)
            pdf.cell(0, h, "IEPS({}%): ${:.2f}".format(int(partida.tasaIEPS * 100), partida.IEPS), align='L', ln=1)
            pdf.cell(0, h, f"Clave:   {partida.claveSAT}", align='L', ln=1)

    font = 8
    h = int(font *0.5)
    pdf.set_font(fontType, 'B', font)
    pdf.ln(h)
    if (self.documentType != self.TICKET and self.documentType != self.ORDEN_DE_TRABAJO):
        pdf.cell(0, h, "Subtotal:" + " ${:.2f}".format(self.Subtotal), align='R', ln=2)
        pdf.cell(0, h, "IVA:" + " ${:.2f}".format(self.IVA), align='R', ln=2)
        pdf.cell(0, h, "IEPS:" + " ${:.2f}".format(self.IEPS), align='R', ln=2)
    pdf.cell(0, h, "Total:" + " ${:.2f}".format(self.Total), align='R', ln=2,border = "B")
    
    if (self.cancelado):
        pdf.ln(h)
        pdf.cell(0, h, "NOTA CANCELADA", align='C', ln=2)
    else:
        if (self.detalle_pago.formaDePago == self.detalle_pago.EF):
            pdf.cell(0, h, "Efectivo recibido:" + " ${:.2f}".format(self.detalle_pago.montoEfectivo), align='R', ln=2,border = "0")
            pdf.cell(0, h, "Cambio:" + " ${:.2f}".format(self.detalle_pago.montoCambioEfectivo), align='R', ln=2,border = "B")
        
        if (self.documentType != self.TICKET and self.documentType != self.ORDEN_DE_TRABAJO and self.detalle_pago.formaDePago != 'EF'):
            pdf.cell(0, h, f"Forma de pago: {self.detalle_pago.formaDePago}", align='C', ln=2)
            if (self.detalle_pago.formaDePago != self.detalle_pago.TC and self.detalle_pago.formaDePago != self.detalle_pago.TD):
                pdf.cell(0, h, f"Banco: {self.detalle_pago.banco}", align='C', ln=2)
                pdf.cell(0, h, f"Referencia: {self.detalle_pago.referencia}", align='C', ln=2, border = "B")
        
        pdf.ln(h)
        pdf.cell(0, h, "GRACIAS POR SU COMPRA!", align='C', ln=2)
        
        if (self.documentType == self.NOTA_DE_VENTA):
            font = 8
            h = int(font *0.5)
            pdf.set_font(fontType, '', font)
            pdf.cell(0, h, "Esta no es una factura", align='C', ln=2)
        else:
            pdf.ln(h)
            pdf.cell(0, h, "Comprobante sin valor fiscal", align='C', ln=2)
        #pdf.ln(h*2)
    #pdf.ln(h*2)
    #autocut_script = b'\x1D\x56\x00'  # Secuencia de comandos para autocorte en ESC/POS
    #pdf.cell(0, 0, autocut_script.decode('latin-1'), 0, 0, 'L')
    

    if (self.cancelado):
        watermark_text = "CANCELADO"  # Change watermark text as desired
        add_watermark(pdf, watermark_text)


def make_ticket(self):
        # Create a new PDF object
        pdf = FPDF('P', 'mm', (48, 3000))
        render_ticket(self, pdf)
        longitud_final = pdf.get_y() + 10
        print(longitud_final)

        pdf = FPDF('P', 'mm', (48, int(longitud_final)))
        render_ticket(self, pdf)

        # Output the PDF to a file
        pdf_buffer = BytesIO(pdf.output())         

        return File(pdf_buffer, name='ticket-{}.pdf'.format(self.carrito.uuid_carrito))

