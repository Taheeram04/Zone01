from django.conf import settings
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver

from applicants.models import Applicant


@receiver(post_save, sender=Applicant)
def notify_on_application(sender, instance, created, **kwargs):
    if not created:
        return
    # Confirmation to applicant
    send_mail(
        subject="Zone01 Application Received",
        message=f"Hi {instance.name},\n\nWe received your application for {instance.get_choice_display()}. We'll be in touch.\n\nZone01 Team",
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@zone01.org"),
        recipient_list=[instance.email],
        fail_silently=True,
    )
    # Staff notification
    staff_email = getattr(settings, "STAFF_NOTIFICATION_EMAIL", None)
    if staff_email:
        send_mail(
            subject=f"New Applicant: {instance.name}",
            message=f"New application submitted.\nName: {instance.name}\nEmail: {instance.email}\nTrack: {instance.get_choice_display()}\nMotivation: {instance.motivation}",
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@zone01.org"),
            recipient_list=[staff_email],
            fail_silently=True,
        )