from django.urls import path
from . import views

urlpatterns = [
    path('delete_image/', views.delete_image, name='delete_image'),
]

'''
http://127.0.0.1:8000/api/deleteImage/delete_image/
'''