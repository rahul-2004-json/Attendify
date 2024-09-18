from django.urls import path
from . import views

urlpatterns = [
    path('delete_image/', views.delete_image, name='delete_image'),
]
