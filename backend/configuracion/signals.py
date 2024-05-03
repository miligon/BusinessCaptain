from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Caja, ConfiguracionCaja  # Import your model here

@receiver(post_save, sender=Caja)
def when_new_caja_is_added(sender, instance, created, **kwargs):
    if created:
        config = ConfiguracionCaja(caja=instance, activar_integracion_MP=False, open_print_ticket=False)
        config.save()

