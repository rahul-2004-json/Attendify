from django.urls import path
from . import views

urlpatterns = [
    path('fetch_students/', views.fetch_students, name='fetch_students'),
]

# http://localhost:8000/getAttendanceList/fetch_students/?year=2022&batch=4&branch=CSE