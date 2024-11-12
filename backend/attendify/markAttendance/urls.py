from django.urls import path
from . import views

urlpatterns = [
    path('mark_attendance/', views.mark_attendance_view, name='mark_attendance'),
]

# http://127.0.0.1:8000/api/markAttendance/mark_attendance/