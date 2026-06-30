"""apps/bookings/signals.py — Auto-generate WhatsApp redirect URL on booking save."""
import urllib.parse
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import BookingRequest


@receiver(post_save, sender=BookingRequest)
def generate_whatsapp_url(sender, instance, created, **kwargs):
    if created and not instance.whatsapp_redirect_url:
        category_name = instance.category.title if instance.category else 'خدمة'
        message = (
            f'السلام عليكم، أنا {instance.customer_name} '
            f'أريد الاستفسار عن {category_name}. '
            f'تاريخ الفعالية: {instance.event_date or "لم يحدد"}. '
            f'ملاحظات: {instance.notes or "لا يوجد"}'
        )
        number = instance.tenant.whatsapp.replace('+', '').replace(' ', '')
        encoded = urllib.parse.quote(message)
        url = f'https://api.whatsapp.com/send/?phone={number}&text={encoded}'
        BookingRequest.objects.filter(pk=instance.pk).update(whatsapp_redirect_url=url)
