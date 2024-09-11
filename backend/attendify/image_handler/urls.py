from django.urls import path
from . import views

urlpatterns = [
    path('upload_images/', views.upload_images, name='upload_images'),
]