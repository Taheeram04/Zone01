"""URL routes for the WhatsApp webhook."""

from django.urls import path

from whatsapp_bot import views

app_name = "whatsapp_bot"

# Mounted at /webhooks/whatsapp/ (see config.urls). One path serves both the
# GET verification handshake and POST event deliveries.
urlpatterns = [
    path("", views.webhook, name="webhook"),
]
