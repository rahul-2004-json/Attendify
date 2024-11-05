from django.urls import path
from . import views

urlpatterns = [
    path('mark_attendance/', views.mark_attendance_view, name='mark_attendance'),
]
