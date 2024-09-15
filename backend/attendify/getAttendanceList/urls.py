from django.urls import path
from . import views

urlpatterns = [
    path('fetch_students/', views.fetch_students, name='fetch_students'),
    path('add_student/', views.add_student, name='add_student'),
    # path('upload_csv/', views.upload_csv, name='upload_csv'),
]