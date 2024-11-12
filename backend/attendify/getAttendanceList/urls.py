from django.urls import path
from . import views

urlpatterns = [
    path('fetch_students/', views.fetch_students, name='fetch_students'),
    # path('upload_csv/', views.upload_csv, name='upload_csv'),
]

'''
 http://127.0.0.1:8000/api/getAttendanceList/fetch_students/?year=2024&batch=B1&batch=B2&branch=CSE
 http://127.0.0.1:8000/api/getAttendanceList/upload_csv/
'''