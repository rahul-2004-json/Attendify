from django.urls import path
from . import views

urlpatterns = [
    path('add_students/', views.add_students, name='add_students'),
]

# http://localhost:8000/api/addStudents/add_students/