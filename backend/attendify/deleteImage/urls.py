from django.urls import path
from . import views

urlpatterns = [
    path('delete_image/<str:public_id>/', views.delete_image, name='delete_image'),
]
