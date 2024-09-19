from django.urls import path
from . import views

urlpatterns = [
    path('fetch_preview_images/', views.fetch_preview_images, name='fetch_preview_images'),
]

'''
 http://127.0.0.1:8000/api/previewImages/fetch_preview_images/
'''