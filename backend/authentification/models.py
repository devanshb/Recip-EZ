from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid

class PasswordResetRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

# added march 18 for search bar
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()