from django.db.models.signals import pre_save
from django.dispatch import receiver
import os
from .helpers import *
from .models import Venta  # Import your model here

@receiver(pre_save, sender=Venta)
def when_venta_cancelled(sender, instance, update_fields, **kwargs):
    record = Venta.objects.filter(pk=instance.pk)
    if record.count() == 0 :
        print('INSERT !!')
        pass
    else:
        previous = Venta.objects.get(pk=instance.pk)
        if previous.cancelado != instance.cancelado:
            print('cancelado')
            instance.ticketFile = make_ticket(instance)

