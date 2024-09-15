from django.urls import path
from . import views

urlpatterns = [
    path('fetch_students/', views.fetch_students, name='fetch_students'),
    # path('upload_csv/', views.upload_csv, name='upload_csv'),
]