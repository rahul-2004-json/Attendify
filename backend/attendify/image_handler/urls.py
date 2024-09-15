from django.urls import path
from . import views

urlpatterns = [
    path('upload_images/', views.upload_images, name='upload_images'),
    path('view_image/<str:image_id>/', views.view_image, name='view_image'),
]